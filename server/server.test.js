import test from 'node:test';
import assert from 'node:assert/strict';
import { clientAddress } from './server.js';

const req = (forwarded, socket = '10.0.0.5') => ({ headers: forwarded ? { 'x-forwarded-for': forwarded } : {}, socket: { remoteAddress: socket } });

test('rate limit uses the address added by the trusted proxy, not one sent by the client', () => {
  assert.equal(clientAddress(req('1.2.3.4, 203.0.113.9'), true), '203.0.113.9');
  assert.equal(clientAddress(req('5.6.7.8, 9.9.9.9, 203.0.113.9'), true), '203.0.113.9');
});

test('without a trusted proxy the header is ignored', () => {
  assert.equal(clientAddress(req('1.2.3.4'), false), '10.0.0.5');
  assert.equal(clientAddress(req(null), true), '10.0.0.5');
});
