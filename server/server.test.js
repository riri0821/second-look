import test from 'node:test';
import assert from 'node:assert/strict';
import { clientAddress, server } from './server.js';

const req = (forwarded, socket = '10.0.0.5') => ({ headers: forwarded ? { 'x-forwarded-for': forwarded } : {}, socket: { remoteAddress: socket } });

test('rate limit uses the address added by the trusted proxy, not one sent by the client', () => {
  assert.equal(clientAddress(req('1.2.3.4, 203.0.113.9'), true), '203.0.113.9');
  assert.equal(clientAddress(req('5.6.7.8, 9.9.9.9, 203.0.113.9'), true), '203.0.113.9');
});

test('without a trusted proxy the header is ignored', () => {
  assert.equal(clientAddress(req('1.2.3.4'), false), '10.0.0.5');
  assert.equal(clientAddress(req(null), true), '10.0.0.5');
});

async function post(path, body) {
  server.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, { method: 'POST', body });
    return { status: res.status, data: await res.json() };
  } finally {
    server.close();
  }
}

test('bad input gets a clear 400, never an internal error message', async () => {
  assert.deepEqual(await post('/v1/check-link', JSON.stringify({ url: 'hello there' })), { status: 400, data: { error: 'not a link' } });
  assert.deepEqual(await post('/v1/analyze', JSON.stringify({ text: '' })), { status: 400, data: { error: 'missing text' } });
});

test('a message far over the size limit is refused', async () => {
  const { status } = await post('/v1/analyze', JSON.stringify({ text: 'ñ'.repeat(30000) }));
  assert.equal(status, 413);
});
