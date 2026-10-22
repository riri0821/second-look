import test from 'node:test';
import assert from 'node:assert/strict';
import { addFeedback, addReport, reportCount, setPool } from './db.js';
import { reporterId, validateFeedback, validateReport } from './reports.js';

// A stand-in database that records every query instead of running it.
function fakePool(rows = []) {
  const calls = [];
  return { calls, query: async (text, values) => { calls.push({ text, values }); return { rows }; } };
}

test('reports are reduced to a plain website name', () => {
  assert.equal(validateReport({ url: 'https://secure.bdo-login.top/verify?x=1' }), 'bdo-login.top');
  assert.equal(validateReport({ url: 'gcash-promo.online' }), 'gcash-promo.online');
  assert.equal(validateReport({ url: 'shop.example.com.ph/x' }), 'example.com.ph');
});

test('reports that are not a public website name are refused', () => {
  for (const url of ['', 'hello there', 'http://127.0.0.1/admin', 'x'.repeat(3000)]) {
    assert.throws(() => validateReport({ url }), url);
  }
  assert.throws(() => validateReport({}));
  assert.throws(() => validateReport({ url: 42 }));
});

test('feedback only accepts known values', () => {
  assert.deepEqual(validateFeedback({ verdict: 'danger', correct: false, codes: ['code', 'code', 'bad code!'], lang: 'fil' }),
    { verdict: 'danger', correct: false, codes: ['code'], lang: 'fil' });
  assert.throws(() => validateFeedback({ verdict: 'maybe', correct: true }));
  assert.throws(() => validateFeedback({ verdict: 'danger', correct: 'yes' }));
});

test('user input is never part of the SQL text, only the values', async () => {
  const hostile = "evil.top'); drop table scam_reports; --";
  const db = fakePool([{ n: 0 }]);
  await addReport(hostile, 'a'.repeat(64), db);
  await reportCount(hostile, db);
  await addFeedback({ verdict: 'danger', correct: true, codes: [hostile], lang: 'en' }, db);
  for (const call of db.calls) {
    assert.ok(!call.text.includes('evil'), `SQL text must be fixed: ${call.text}`);
    assert.match(call.text, /\$1/);
    assert.ok(JSON.stringify(call.values).includes('evil'), 'input travels as a value');
  }
});

test('reporter id is a one-way hash that needs the secret', () => {
  const a = reporterId('203.0.113.9', 's3cret');
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.equal(a, reporterId('203.0.113.9', 's3cret'));
  assert.notEqual(a, reporterId('203.0.113.9', 'other'));
  assert.ok(!a.includes('203'));
  assert.throws(() => reporterId('203.0.113.9', ''));
});

test('without a database, storing quietly does nothing', async () => {
  setPool(null);
  assert.equal(await addReport('x.top', 'a'.repeat(64), null), false);
  assert.equal(await reportCount('x.top', null), 0);
});
