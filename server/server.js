import http from 'node:http';
import { readFileSync } from 'node:fs';
import { analyze, analyzeLink, asSingleLink } from './analyze.js';
import { SUPPORTED_LANGS } from './messages.js';

const PORT = process.env.PORT || 3123;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '';
const PRIVACY_HTML = readFileSync(new URL('./privacy.html', import.meta.url), 'utf8').replaceAll('{{CONTACT_EMAIL}}', CONTACT_EMAIL);

// Simple per-IP limit so a public server can't be hammered: 30 checks per minute.
const LIMIT = 30;
const hits = new Map();
setInterval(() => hits.clear(), 60_000).unref();

const json = (res, status, body) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));

async function handleAnalyze(req, res, { linkOnly = false } = {}) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 20000) return json(res, 413, { error: 'Message is too long' });
  }
  try {
    const { text, url, lang } = JSON.parse(body);
    const input = linkOnly ? url : text;
    if (typeof input !== 'string' || !input.trim()) throw new Error(linkOnly ? 'missing url' : 'missing text');
    const language = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    // A message that is only a link gets the direct link check.
    const direct = linkOnly || asSingleLink(input);
    json(res, 200, { ...(await (direct ? analyzeLink(input, process.env, language) : analyze(input, process.env, language))), mode: direct ? 'link' : 'message' });
  } catch (e) {
    json(res, 400, { error: e.message });
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.end();

  if (req.method === 'GET' && req.url === '/health') return res.end('ok');
  if (req.method === 'GET' && req.url === '/privacy') {
    return res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(PRIVACY_HTML);
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const count = (hits.get(ip) || 0) + 1;
  hits.set(ip, count);
  if (count > LIMIT) return json(res, 429, { error: 'Too many checks, try again in a minute' });

  // /v1/analyze is the current API. /analyze stays for app versions released before it.
  if (req.method === 'POST' && (req.url === '/v1/analyze' || req.url === '/analyze')) return handleAnalyze(req, res);
  // Checks one link directly: { "url": "https://..." }
  if (req.method === 'POST' && req.url === '/v1/check-link') return handleAnalyze(req, res, { linkOnly: true });

  res.writeHead(404).end();
});

server.listen(PORT, () => console.log(`Second Look server on http://localhost:${PORT}`));
