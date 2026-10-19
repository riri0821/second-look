import test from 'node:test';
import assert from 'node:assert/strict';
import { extractUrls, staticChecks } from './analyze.js';

test('extracts links from a scam text', () => {
  const urls = extractUrls('USPS: your package is held. Visit usps-redelivery.top/track now.');
  assert.deepEqual(urls, ['http://usps-redelivery.top/track']);
});

test('flags lookalike domains', () => {
  assert.ok(staticChecks('https://paypa1.com/login').some(f => f.reason.includes('imitation of paypal')));
  assert.ok(staticChecks('https://secure-apple.id-verify.xyz/').length >= 2);
  assert.ok(staticChecks('http://paypa1-secure-login.xyz/verify').some(f => f.reason.includes('imitation of paypal')));
});

test('never fetches internal addresses', async () => {
  const { analyze } = await import('./analyze.js');
  const r = await analyze('see http://127.0.0.1:3123/health and http://169.254.169.254/latest', {});
  assert.ok(r.links.every(l => l.finalUrl === l.url));
});

test('does not flag the real site', () => {
  assert.equal(staticChecks('https://www.paypal.com/signin').length, 0);
});
