// Core analysis: pulls links out of a message, runs checks on each, and scores risk.
import dns from 'node:dns/promises';
import net from 'node:net';
import { BRAND_LIST, COMMON_WORDS, GENERIC_IN_HOSTS } from './brands.js';
import { say } from './messages.js';

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'cutt.ly',
  'rebrand.ly', 'shorturl.at', 'rb.gy', 'tiny.cc', 'buff.ly', 's.id', 'tny.im',
]);
const RISKY_TLDS = new Set([
  'zip', 'mov', 'xyz', 'top', 'click', 'link', 'shop', 'live', 'icu', 'buzz', 'rest', 'cfd', 'sbs',
  'monster', 'quest', 'cam', 'tk', 'ml', 'ga', 'cf', 'gq', 'online', 'site', 'vip', 'cyou', 'bond', 'win',
]);
// Two-part endings, so "bdo.com.ph" is treated as one website, not "com.ph".
const SECOND_LEVEL = new Set([
  'com.ph', 'gov.ph', 'net.ph', 'org.ph', 'edu.ph', 'co.uk', 'org.uk', 'gov.uk', 'ac.uk',
  'com.au', 'gov.au', 'co.jp', 'com.br', 'co.nz', 'co.in', 'com.mx', 'com.sg', 'com.my', 'co.id',
]);

// Trusted websites that forward you to another address given in the link itself.
// Scammers use them so the link appears to start with google.com or linkedin.com.
const REDIRECTORS = [
  { host: /(^|\.)google\.[a-z.]+$/, path: /^\/url$/, params: ['q', 'url'] },
  { host: /(^|\.)youtube\.com$/, path: /^\/redirect$/, params: ['q'] },
  { host: /(^|\.)linkedin\.com$/, path: /^\/redir\/redirect/, params: ['url'] },
  { host: /^l[m]?\.facebook\.com$/, path: /^\/l\.php$/, params: ['u'] },
  { host: /^l\.instagram\.com$/, path: /.*/, params: ['u'] },
  { host: /\.safelinks\.protection\.outlook\.com$/, path: /.*/, params: ['url'] },
  { host: /^out\.reddit\.com$/, path: /.*/, params: ['url'] },
  { host: /^slack-redir\.net$/, path: /^\/link$/, params: ['url'] },
];

// Pressure words, in English and Filipino.
const PRESSURE_WORDS = [
  'urgent', 'immediately', 'suspended', 'locked', 'blocked', 'verify your', 'confirm your',
  'unusual activity', 'final notice', 'act now', 'within 24 hours', 'within 2 hours',
  'expires today', 'last chance', 'agad', 'ngayon din', 'huling paalala', 'na-suspend', 'na suspend',
  'ma-block', 'na-block', 'mawawala', 'i-verify', 'i-update', 'bago mag-expire',
];

// Scam tactics that work without any link. Each one adds to the risk score once.
const TACTICS = [
  {
    points: 30,
    re: /\b(anydesk|teamviewer|rustdesk|quick ?support|remote access|screen ?share)\b/i,
    key: 'remote',
  },
  {
    points: 30,
    re: /\b(send|share|give|tell|reply with|read|forward|ibigay|i-?send|ipadala|sabihin)\b.{0,30}\b(otp|code|pin|verification)\b|\b(otp|code|pin)\b.{0,25}\b(send|share|reply|ibigay|i-?send|ipadala)\b/i,
    key: 'code',
  },
  {
    points: 30,
    re: /\b(gift ?cards?|google play cards?|itunes cards?|apple cards?|steam cards?|load cards?|e-?load|pa-?load)\b/i,
    key: 'giftCards',
  },
  {
    points: 25,
    // Only when it asks you to hand them over; "update your password in the app" is normal.
    re: /\b(send|reply|provide|give|share|tell|forward|type|ibigay|i-?send|ipadala|ilagay)\b.{0,40}\b(card number|cvv|cvc|social security number|ssn|bank details|account number|password|mpin|pin code|full name and address)\b/i,
    key: 'private',
  },
  {
    points: 20,
    re: /\b(bitcoin|btc|usdt|crypto ?wallet|wire transfer|western union|moneygram)\b/i,
    key: 'irreversible',
  },
  {
    points: 25,
    re: /\b(arrest|warrant|lawsuit|legal action|police|deport|kakasuhan|ipapahuli|makukulong|kaso)\b/i,
    key: 'threat',
  },
  {
    points: 20,
    re: /\b(you (have )?won|winner|congratulations|claim your (prize|reward|gift)|lottery|raffle|nanalo ka|napili ka|premyo|pa-?premyo|i-?claim)\b/i,
    key: 'prize',
  },
  {
    points: 35,
    re: /\b(new number|lost my phone|dropped my phone|bagong number|nawala ang (phone|cellphone)|naaksidente|na-?ospital|emergency)\b.{0,80}\b(send|need|money|pera|padala|gcash|pautang|hiram)\b/i,
    key: 'family',
  },
  {
    points: 15,
    re: /\b(work from home|part[- ]?time|sideline|easy money|kumita ng|daily income|per day|kada araw|like (and|&) earn|commission)\b/i,
    key: 'job',
  },
  {
    points: 15,
    re: /\b(loan approved|pre-?approved loan|instant loan|na-?approve ang (loan|utang)|pautang|cash loan)\b/i,
    key: 'loan',
  },
  {
    // A gentle note only: real banks also say "call our hotline".
    points: 5,
    re: /\b(call|contact|tawagan|i-?text)\b.{0,40}(\+?\d[\d\s().-]{8,}\d)/i,
    key: 'call',
  },
];

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wordRe = (term, flags) => new RegExp(`(?<![a-z0-9])${escapeRe(term)}(?![a-z0-9])`, flags);

// Undo common tricks that hide links from filters: "hxxp", "example[.]com", %-encoding.
function revealLinks(text) {
  let t = text.replace(/hxxp/gi, 'http').replace(/\[\.\]|\(\.\)|\{\.\}|\[dot\]|\(dot\)/gi, '.').replace(/\[:\]/g, ':');
  if (/%[0-9a-f]{2}/i.test(t)) {
    try { t += ' ' + decodeURIComponent(t); } catch { /* malformed encoding */ }
  }
  return t;
}

export function extractUrls(text) {
  const re = /\b((?:https?:\/\/|www\.)[^\s<>"']+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}\/[^\s<>"']*)/gi;
  const found = new Set();
  for (const m of revealLinks(text).matchAll(re)) {
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
  const lastTwo = parts.slice(-2).join('.');
  return SECOND_LEVEL.has(lastTwo) ? parts.slice(-3).join('.') : lastTwo;
}

const onDomain = (host, domain) => host === domain || host.endsWith('.' + domain);
const isBrandSite = (host, brand) => brand.domains.some(d => onDomain(host, d));
const isAnyBrandSite = host => BRAND_LIST.some(b => isBrandSite(host, b));

const normalize = s => s.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/5/g, 's').replace(/rn/g, 'm');

// Finds a brand the website name pretends to be, e.g. "paypa1-login.xyz" -> PayPal.
function impersonatedBrand(host) {
  const tokens = host.split(/[.-]/);
  const squashed = normalize(host.replace(/[.-]/g, ''));
  for (const brand of BRAND_LIST) {
    const { key } = brand;
    if (GENERIC_IN_HOSTS.has(key)) continue;
    const fuzzy = key.length >= 5 && !COMMON_WORDS.has(key);
    for (const t of tokens) {
      if (t === key) return { brand, lookalike: false };
      if (fuzzy && (normalize(t) === key || distance(t, key) === 1)) return { brand, lookalike: true };
    }
    if (fuzzy && key.length >= 6 && squashed.includes(key)) return { brand, lookalike: false };
  }
  return null;
}

// Checks that only look at the link itself; no network needed.
export function staticChecks(url, lang = 'en') {
  const u = new URL(url);
  const host = u.hostname.toLowerCase();
  const flags = [];
  const add = (points, key, details) => flags.push({ points, code: key, reason: say(lang, key, details) });
  const ending = host.split('.').pop();

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) add(30, 'ip');
  if (host.includes('xn--')) add(30, 'punycode');
  if (u.username || url.includes('@')) add(25, 'at');
  if (u.protocol === 'http:') add(5, 'http');
  if (RISKY_TLDS.has(ending)) add(15, 'ending', { ending });
  if (host.split('.').length > 4) add(10, 'long');
  if ((host.match(/-/g) || []).length >= 3) add(10, 'dashes');
  if (SHORTENERS.has(host)) add(10, 'shortener');

  if (isAnyBrandSite(host)) return flags;
  const base = registrableDomain(host);
  const match = impersonatedBrand(host);
  if (match?.lookalike) add(40, 'lookalike', { base, brand: match.brand.name });
  else if (match) add(30, 'usesName', { base, brand: match.brand.name });
  return flags;
}

// Peels off trusted "redirect" wrappers to find the address a link really sends you to.
export function unwrapLink(url) {
  let current = url;
  const via = [];
  for (let i = 0; i < 3; i++) {
    let u;
    try { u = new URL(current); } catch { break; }
    const known = REDIRECTORS.find(r => r.host.test(u.hostname) && r.path.test(u.pathname));
    const params = known ? known.params : [...u.searchParams.keys()];
    const inner = params.map(p => u.searchParams.get(p)).find(v => v && /^https?:\/\//i.test(v));
    if (!inner) break;
    via.push({ host: u.hostname, known: Boolean(known) });
    current = inner;
  }
  return { target: current, via };
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
    current = unwrapLink(new URL(next, current).href).target;
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
      client: { clientId: 'second-look', clientVersion: '0.2.0' },
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

async function checkUrl(url, env, lang) {
  const flags = [];
  const add = (points, key, details) => flags.push({ points, code: key, reason: say(lang, key, details) });

  const { target, via } = unwrapLink(url);
  if (via.length) {
    const first = via[0];
    const hidden = new URL(target).hostname;
    if (first.known) add(20, 'disguised', { via: first.host, target: hidden });
    else add(10, 'hidden', { target: hidden });
  }

  let finalUrl = target;
  try { finalUrl = await resolveRedirects(target); } catch { /* unreachable is fine */ }
  if (finalUrl !== target) add(0, 'leadsTo', { host: new URL(finalUrl).hostname });

  // Tricks like "@" live in the original link; everything else is judged on where it really goes.
  if (url !== target) flags.push(...staticChecks(url, lang).filter(f => f.code === 'at'));
  flags.push(...staticChecks(target, lang));
  if (finalUrl !== target) flags.push(...staticChecks(finalUrl, lang).filter(f => !SHORTENERS.has(new URL(finalUrl).hostname)));

  const host = new URL(finalUrl).hostname;
  if (!isAnyBrandSite(host)) {
    try {
      const age = await domainAgeDays(host);
      if (age !== null && age < 30) add(35, 'brandNew', { age });
      else if (age !== null && age < 180) add(15, 'young', { age });
    } catch { /* not every website has public registration info */ }
  }

  if (env.GOOGLE_SAFE_BROWSING_KEY) {
    try { if (await safeBrowsing(finalUrl, env.GOOGLE_SAFE_BROWSING_KEY)) add(80, 'google'); } catch {}
  }
  if (env.VIRUSTOTAL_KEY) {
    try {
      const hits = await virusTotal(finalUrl, env.VIRUSTOTAL_KEY);
      if (hits) add(Math.min(80, 20 * hits), 'vendors', { hits });
    } catch {}
  }
  return { url, finalUrl, flags };
}

// Which brand does the message claim to be from? Everyday words like "target" only
// count when written the way the brand writes them ("Target").
export function brandInText(text) {
  const lower = text.toLowerCase();
  for (const brand of BRAND_LIST) {
    const display = brand.name.replace(/^the /, '');
    const terms = [brand.key, display.toLowerCase(), ...(brand.aliases ?? [])];
    for (const term of terms) {
      if (COMMON_WORDS.has(term) || COMMON_WORDS.has(brand.key) && term === brand.key) {
        if (wordRe(display, '').test(text)) return brand;
        continue;
      }
      if (term.length >= 3 && wordRe(term, 'i').test(lower)) return brand;
    }
  }
  return null;
}

// Real banks warn "do not share your OTP" and "we will never ask for your password".
// Those warnings use the same words as scams, so sentences that say NOT to do something
// are left out before looking for scam tactics.
const NEGATION = /\b(do not|don't|dont|never|will not|won't|huwag|wag|hindi (namin|kailanman|kailangan))\b/i;

export function withoutWarnings(text) {
  return text
    .split(/[.!?\n;]+|,\s*(?=(?:but|pero|tapos|then)\b)/i)
    .filter(part => !NEGATION.test(part))
    .join('. ');
}

export function textChecks(text, lang = 'en') {
  text = withoutWarnings(text);
  const lower = text.toLowerCase();
  const flags = [];
  const pressure = PRESSURE_WORDS.filter(w => lower.includes(w));
  if (pressure.length) {
    flags.push({ points: Math.min(25, pressure.length * 8), code: 'pressure', reason: say(lang, 'pressure', { words: pressure.slice(0, 2) }) });
  }
  for (const t of TACTICS) if (t.re.test(text)) flags.push({ points: t.points, code: t.key, reason: say(lang, t.key) });
  return flags;
}

export async function analyze(text, env = process.env, lang = 'en') {
  const urls = extractUrls(text);
  const links = await Promise.all(urls.map(u => checkUrl(u, env, lang)));
  const messageFlags = textChecks(text, lang);

  // A message that names a brand but links somewhere else is a classic scam.
  const brand = brandInText(text);
  const offsite = brand && links.find(l => !isBrandSite(new URL(l.finalUrl).hostname, brand));
  if (offsite) {
    messageFlags.push({ points: 25, code: 'claims', reason: say(lang, 'claims', { brand: brand.name, host: new URL(offsite.finalUrl).hostname }) });
  }

  return result(links, messageFlags);
}

function result(links, messageFlags) {
  const all = [...messageFlags, ...links.flatMap(l => l.flags)];
  const score = Math.min(100, all.reduce((s, f) => s + f.points, 0));
  const verdict = score >= 60 ? 'danger' : score >= 25 ? 'suspicious' : 'no_red_flags';
  return { score, verdict, links, messageFlags, checkedAt: new Date().toISOString() };
}

// Is this input just one link (or bare website name like "agoda.com") and nothing else?
export function asSingleLink(input) {
  const s = input.trim();
  if (!s || /\s/.test(s)) return null;
  const candidate = /^https?:\/\//i.test(s) ? s : `http://${s}`;
  try {
    const u = new URL(candidate);
    return /\.[a-z]{2,}$/i.test(u.hostname) || net.isIP(u.hostname) ? u.href : null;
  } catch {
    return null;
  }
}

// Checks a single link directly: no message, so only the website itself is judged.
export async function analyzeLink(input, env = process.env, lang = 'en') {
  const url = asSingleLink(input);
  if (!url) throw new Error('not a link');
  return result([await checkUrl(url, env, lang)], []);
}
