import http from 'node:http';
import { readFileSync } from 'node:fs';
import { analyze } from './analyze.js';

const PORT = process.env.PORT || 3123;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'privacy@example.com';
const PRIVACY_HTML = readFileSync(new URL('./privacy.html', import.meta.url), 'utf8').replaceAll('{{CONTACT_EMAIL}}', CONTACT_EMAIL);

// Simple per-IP limit so a public server can't be hammered: 30 checks per minute.
const LIMIT = 30;
const hits = new Map();
setInterval(() => hits.clear(), 60_000).unref();

const json = (res, status, body) => res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));

async function handleAnalyze(req, res) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 20000) return json(res, 413, { error: 'Message is too long' });
  }
  try {
    const { text } = JSON.parse(body);
    if (typeof text !== 'string' || !text.trim()) throw new Error('missing text');
    json(res, 200, await analyze(text));
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

  res.writeHead(404).end();
});

server.listen(PORT, () => console.log(`Second Look server on http://localhost:${PORT}`));
