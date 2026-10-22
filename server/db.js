// Database access for scam reports and result feedback.
//
// Security rules for this file:
// - Every query is a fixed SQL string. User input goes ONLY into the `values` array, never into
//   the SQL text. Postgres treats values as data, so they can't change the command (this is what
//   prevents SQL injection).
// - Input is validated before it gets here (see validate* in reports.js).
// - Without DATABASE_URL the features turn off quietly and the checker keeps working.
import pg from 'pg';

let pool = null;

export function getPool(env = process.env) {
  if (pool || !env.DATABASE_URL) return pool;
  pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: env.DATABASE_SSL === 'off' ? false : { rejectUnauthorized: false },
  });
  pool.on('error', () => {}); // a dropped idle connection must not crash the server
  return pool;
}

// Tests pass a fake pool here to see exactly what would be sent to the database.
export function setPool(p) {
  pool = p;
}

export async function addReport(domain, reporter, db = getPool()) {
  if (!db) return false;
  await db.query(
    'insert into scam_reports (domain, reporter) values ($1, $2) on conflict (domain, reporter) do nothing',
    [domain, reporter],
  );
  return true;
}

export async function reportCount(domain, db = getPool()) {
  if (!db) return 0;
  const { rows } = await db.query('select count(*)::int as n from scam_reports where domain = $1', [domain]);
  return rows[0]?.n ?? 0;
}

export async function addFeedback({ verdict, correct, codes, lang }, db = getPool()) {
  if (!db) return false;
  await db.query(
    'insert into result_feedback (verdict, correct, codes, lang) values ($1, $2, $3, $4)',
    [verdict, correct, codes, lang],
  );
  return true;
}
