import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { analyze, analyzeLink, asSingleLink } from './analyze.js';
import { SUPPORTED_LANGS } from './messages.js';
import { handleFeedback, handleReport } from './reports.js';

const PORT = process.env.PORT || 3123;
// Set on the host (Render), so no personal address lives in the code.
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '';
const PRIVACY_HTML = readFileSync(new URL('./privacy.html', import.meta.url), 'utf8').replaceAll('{{CONTACT_EMAIL}}', CONTACT_EMAIL);

// Simple per-IP limit so a public server can't be hammered: 30 checks per minute.
const LIMIT = 30;
const hits = new Map();
setInterval(() => hits.clear(), 60_000).unref();

// The address to rate-limit by. Behind Render's proxy (TRUST_PROXY=1) the real client is the
// LAST entry of X-Forwarded-For, the one the proxy adds itself; earlier entries come from the
// client and can be anything. Without a proxy, the header is ignored entirely.
export function clientAddress(req, trustProxy = process.env.TRUST_PROXY === '1') {
  const forwarded = req.headers['x-forwarded-for'];
  if (trustProxy && typeof forwarded === 'string') {
    const last = forwarded.split(',').map(s => s.trim()).filter(Boolean).pop();
    if (last) return last;
  }
  return req.socket.remoteAddress;
}

const json = (res, status, body) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));

// Reads a JSON body, refusing anything over the size limit. Returns null after answering 413/400.
async function readJson(req, res) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 20000) {
      json(res, 413, { error: 'Message is too long' });
      return null;
    }
  }
  try {
    const data = JSON.parse(body);
    if (data && typeof data === 'object' && !Array.isArray(data)) return data;
  } catch { /* fall through */ }
  json(res, 400, { error: 'invalid JSON' });
  return null;
}

async function handleAnalyze(req, res, { linkOnly = false } = {}) {
  const data = await readJson(req, res);
  if (!data) return;
  try {
    const { text, url, lang } = data;
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

export const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.end();

  if (req.method === 'GET' && req.url === '/health') return res.end('ok');
  if (req.method === 'GET' && req.url === '/privacy') {
    return res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(PRIVACY_HTML);
  }

  const ip = clientAddress(req);
  if (hits.size > 50_000) hits.clear(); // cap memory if many addresses appear at once
  const count = (hits.get(ip) || 0) + 1;
  hits.set(ip, count);
  if (count > LIMIT) return json(res, 429, { error: 'Too many checks, try again in a minute' });

  // /v1/analyze is the current API. /analyze stays for app versions released before it.
  if (req.method === 'POST' && (req.url === '/v1/analyze' || req.url === '/analyze')) return handleAnalyze(req, res);
  // Checks one link directly: { "url": "https://..." }
  if (req.method === 'POST' && req.url === '/v1/check-link') return handleAnalyze(req, res, { linkOnly: true });
  // "Report this website" and "Was this result right?". Validated, then stored with parameterized queries.
  if (req.method === 'POST' && (req.url === '/v1/report' || req.url === '/v1/feedback')) {
    const data = await readJson(req, res);
    if (!data) return;
    try {
      return json(res, 200, req.url === '/v1/report' ? await handleReport(data, ip) : await handleFeedback(data));
    } catch (e) {
      // Validation messages are safe to show; database errors are logged, never sent back.
      if (/^(missing|not a|bad )/.test(e.message)) return json(res, 400, { error: e.message });
      console.error('storage error:', e.code || e.message);
      return json(res, 503, { error: 'Could not save right now' });
    }
  }

  res.writeHead(404).end();
});

// Start listening only when run directly (tests import this file).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`Second Look server on http://localhost:${PORT}`));
}
