// SQL injection test through the real HTTP endpoints, the way an attacker would send it.
// Runs only on this machine with a stand-in database, never against the live server or database.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setPool } from './db.js';
import { server } from './server.js';

const PAYLOADS = [
  "' OR '1'='1",
  "x.top'; drop table scam_reports; --",
  "evil.top' union select password from pg_shadow --",
  "evil.top'||(select pg_sleep(5))||'",
  'evil.top"; delete from result_feedback; --',
];

function fakePool() {
  const calls = [];
  return { calls, query: async (text, values) => { calls.push({ text, values }); return { rows: [{ n: 0 }] }; } };
}

async function post(port, path, body) {
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.text() };
}

test('SQL injection payloads never become part of a database command', async () => {
  process.env.REPORT_SECRET = 'test-secret';
  const db = fakePool();
  setPool(db);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try {
    for (const p of PAYLOADS) {
      const sent = [
        await post(port, '/v1/report', { url: p }),
        await post(port, '/v1/report', { url: `https://${p}` }),
        await post(port, '/v1/feedback', { verdict: p, correct: true }),
        await post(port, '/v1/feedback', { verdict: 'danger', correct: true, codes: [p], lang: p }),
      ];
      for (const r of sent) {
        // Each request is either refused by validation or saved normally. Never a server error,
        // and never a database error message sent back.
        assert.ok([200, 400].includes(r.status), `${p} -> ${r.status} ${r.body}`);
        assert.ok(!/syntax|postgres|relation|pg_/i.test(r.body), `no database details leak: ${r.body}`);
      }
    }
    // Whatever did reach the database went only into the values, never into the SQL text.
    assert.ok(db.calls.length > 0, 'some requests must reach the database for this test to mean anything');
    for (const call of db.calls) {
      for (const p of PAYLOADS) assert.ok(!call.text.includes(p), `SQL text changed: ${call.text}`);
      assert.match(call.text, /\$1/);
    }
  } finally {
    await new Promise(r => server.close(r));
    setPool(null);
  }
});
