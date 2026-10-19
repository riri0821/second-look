// Core analysis: pulls links out of a message, runs checks on each, and scores risk.
import dns from 'node:dns/promises';
import net from 'node:net';

const BRANDS = [
  'paypal', 'apple', 'amazon', 'microsoft', 'google', 'netflix', 'facebook',
  'instagram', 'whatsapp', 'chase', 'wellsfargo', 'bankofamerica', 'usps',
  'fedex', 'dhl', 'ups', 'coinbase', 'binance', 'steam', 'outlook', 'icloud',
];
// Real brand domains whose names don't match the brand (e.g. Outlook lives on live.com).
const OFFICIAL_DOMAINS = new Set([
  'live.com', 'office.com', 'microsoftonline.com', 'icloud.com', 'apple.com',
  'amazon.co.uk', 'fb.com', 'wa.me', 'youtube.com', 'gmail.com',
]);
const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'cutt.ly',
  'rebrand.ly', 'shorturl.at', 'rb.gy', 'tiny.cc', 'buff.ly',
]);
const RISKY_TLDS = new Set([
  'zip', 'mov', 'xyz', 'top', 'click', 'link', 'shop', 'live', 'icu', 'buzz',
  'rest', 'cfd', 'sbs', 'monster', 'quest', 'cam', 'tk', 'ml', 'ga', 'cf', 'gq',
]);
const URGENT_WORDS = [
  'urgent', 'immediately', 'suspended', 'locked', 'verify your', 'confirm your',
  'unusual activity', 'final notice', 'act now', 'within 24 hours', 'package',
  'delivery failed', 'refund', 'gift card', 'you have won', 'prize', 'password',
];

export function extractUrls(text) {
  const re = /\b((?:https?:\/\/|www\.)[^\s<>"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}\/[^\s<>"']*)/gi;
  const found = new Set();
  for (const m of text.matchAll(re)) {
    let u = m[1].replace(/[).,!?]+$/, '');
    if (!/^https?:\/\//i.test(u)) u = 'http://' + u;
    try { found.add(new URL(u).href); } catch { /* not a URL */ }
  }
  return [...found].slice(0, 5);
}

// Classic edit distance, used to spot lookalikes like "paypa1".
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

function registrableDomain(host) {
  const parts = host.split('.');
  return parts.slice(-2).join('.');
}

// Checks that only look at the URL string; no network needed.
export function staticChecks(url) {
  const u = new URL(url);
  const host = u.hostname.toLowerCase();
  const flags = [];
  const add = (points, reason) => flags.push({ points, reason });

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add(30, 'The link points to a raw IP address instead of a website name.');
  if (host.includes('xn--')) add(30, 'The website name uses special characters that can imitate real letters (punycode).');
  if (u.username || url.includes('@')) add(25, 'The link contains "@", which can hide where it really goes.');
  if (u.protocol === 'http:') add(5, 'The link does not use a secure (https) connection.');
  if (RISKY_TLDS.has(host.split('.').pop())) add(15, `The ".${host.split('.').pop()}" ending is commonly used by scam sites.`);
  if (host.split('.').length > 4) add(10, 'The website name has an unusually long chain of subdomains.');
  if ((host.match(/-/g) || []).length >= 3) add(10, 'The website name has many hyphens, a common scam pattern.');
  if (SHORTENERS.has(host)) add(10, 'This is a link shortener, which hides the real destination.');

  const base = registrableDomain(host);
  if (OFFICIAL_DOMAINS.has(base)) return flags;
  const label = base.split('.')[0];
  if (BRANDS.includes(label)) return flags;
  const brand = impersonatedBrand(host);
  if (brand?.lookalike) add(40, `"${base}" looks like an imitation of ${brand.name}.`);
  else if (brand) add(30, `Mentions "${brand.name}" but the real website is "${base}", not ${brand.name}.`);
  return flags;
}

const normalize = s => s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/rn/g, 'm');

// Finds a brand the hostname pretends to be, e.g. "paypa1-login.xyz" -> paypal.
function impersonatedBrand(host) {
  const tokens = host.split(/[.-]/);
  for (const name of BRANDS) {
    for (const t of tokens) {
      if (t === name) return { name, lookalike: false };
      if (normalize(t) === name || (name.length >= 5 && distance(t, name) === 1)) return { name, lookalike: true };
    }
    if (name.length >= 5 && normalize(host).includes(name)) return { name, lookalike: false };
  }
  return null;
}

async function withTimeout(promise, ms = 6000) {
  return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith('::ffff:')) return isPrivateIp(v6.slice(7));
  return v6 === '::1' || v6 === '::' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80');
}

// The server fetches links people send it, so never let it reach internal networks.
async function isPublicUrl(url) {
  const u = new URL(url);
  if (!['http:', 'https:'].includes(u.protocol)) return false;
  const host = u.hostname.replace(/^\[|\]$/g, '');
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  return addrs.length > 0 && addrs.every(a => !isPrivateIp(a.address));
}

// Follows redirects (shorteners) without downloading the page body.
async function resolveRedirects(url) {
  let current = url;
  for (let i = 0; i < 5; i++) {
    if (!(await isPublicUrl(current))) break;
    const res = await withTimeout(fetch(current, { method: 'HEAD', redirect: 'manual' }));
    const next = res.headers.get('location');
    if (res.status < 300 || res.status >= 400 || !next) break;
    current = new URL(next, current).href;
  }
  return current;
}

async function domainAgeDays(host) {
  const res = await withTimeout(fetch(`https://rdap.org/domain/${registrableDomain(host)}`));
  if (!res.ok) return null;
  const data = await res.json();
  const reg = data.events?.find(e => e.eventAction === 'registration');
  return reg ? Math.floor((Date.now() - Date.parse(reg.eventDate)) / 86400000) : null;
}

async function safeBrowsing(url, key) {
  const res = await withTimeout(fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client: { clientId: 'second-look', clientVersion: '0.1.0' },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }],
      },
    }),
  }));
  const data = await res.json();
  return (data.matches || []).length > 0;
}

async function virusTotal(url, key) {
  const id = Buffer.from(url).toString('base64url');
  const res = await withTimeout(fetch(`https://www.virustotal.com/api/v3/urls/${id}`, { headers: { 'x-apikey': key } }));
  if (!res.ok) return null;
  const stats = (await res.json()).data?.attributes?.last_analysis_stats;
  return stats ? stats.malicious + stats.suspicious : null;
}

async function checkUrl(url, env) {
  const flags = [];
  const add = (points, reason) => flags.push({ points, reason });
  let finalUrl = url;

  try { finalUrl = await resolveRedirects(url); } catch { /* unreachable is fine */ }
  if (finalUrl !== url) add(0, `The link actually leads to ${new URL(finalUrl).hostname}.`);

  flags.push(...staticChecks(url));
  if (finalUrl !== url) flags.push(...staticChecks(finalUrl).filter(f => !SHORTENERS.has(new URL(finalUrl).hostname)));

  const host = new URL(finalUrl).hostname;
  try {
    const age = await domainAgeDays(host);
    if (age !== null && age < 30) add(35, `The website was created only ${age} day(s) ago.`);
    else if (age !== null && age < 180) add(15, `The website is fairly new (${age} days old).`);
  } catch { /* RDAP not available for every domain */ }

  if (env.GOOGLE_SAFE_BROWSING_KEY) {
    try { if (await safeBrowsing(finalUrl, env.GOOGLE_SAFE_BROWSING_KEY)) add(80, 'Google Safe Browsing lists this site as dangerous.'); } catch {}
  }
  if (env.VIRUSTOTAL_KEY) {
    try {
      const hits = await virusTotal(finalUrl, env.VIRUSTOTAL_KEY);
      if (hits) add(Math.min(80, 20 * hits), `${hits} security vendor(s) on VirusTotal flag this site.`);
    } catch {}
  }
  return { url, finalUrl, flags };
}

function textChecks(text) {
  const lower = text.toLowerCase();
  const hits = URGENT_WORDS.filter(w => lower.includes(w));
  return hits.length ? [{ points: Math.min(25, hits.length * 8), reason: `Uses pressure language: "${hits.slice(0, 3).join('", "')}".` }] : [];
}

export async function analyze(text, env = process.env) {
  const urls = extractUrls(text);
  const links = await Promise.all(urls.map(u => checkUrl(u, env)));
  const messageFlags = textChecks(text);
  // A message that names a brand but links somewhere else is a classic phish.
  const lower = text.toLowerCase();
  const named = BRANDS.find(b => new RegExp(`\\b${b}\\b`).test(lower));
  const offsite = links.find(l => {
    const base = registrableDomain(new URL(l.finalUrl).hostname);
    return !base.startsWith(named + '.') && !OFFICIAL_DOMAINS.has(base);
  });
  if (named && offsite) {
    messageFlags.push({ points: 25, reason: `The message talks about ${named}, but the link goes to ${new URL(offsite.finalUrl).hostname}.` });
  }
  const all = [...messageFlags, ...links.flatMap(l => l.flags)];
  const score = Math.min(100, all.reduce((s, f) => s + f.points, 0));
  const verdict = score >= 60 ? 'danger' : score >= 25 ? 'suspicious' : 'no_red_flags';
  return { score, verdict, links, messageFlags, checkedAt: new Date().toISOString() };
}
