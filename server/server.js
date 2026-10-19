import http from 'node:http';
import { analyze } from './analyze.js';

const PORT = process.env.PORT || 3123;

// Simple per-IP limit so a public server can't be hammered: 30 checks per minute.
const LIMIT = 30;
const hits = new Map();
setInterval(() => hits.clear(), 60_000).unref();

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.end();

  if (req.method === 'GET' && req.url === '/health') return res.end('ok');

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const count = (hits.get(ip) || 0) + 1;
  hits.set(ip, count);
  if (count > LIMIT) {
    return res.writeHead(429, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Too many checks, try again in a minute' }));
  }

  if (req.method === 'POST' && req.url === '/analyze') {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 20000) return res.writeHead(413).end();
    }
    try {
      const { text } = JSON.parse(body);
      if (typeof text !== 'string' || !text.trim()) throw new Error('missing text');
      const result = await analyze(text);
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: e.message }));
    }
    return;
  }
  res.writeHead(404).end();
});

server.listen(PORT, () => console.log(`Second Look server on http://localhost:${PORT}`));
