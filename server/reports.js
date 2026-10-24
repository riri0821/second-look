// Scam reports and result feedback: input validation and the request handlers.
// Nothing reaches the database until it has passed these checks.
import { createHmac } from 'node:crypto';
import { asSingleLink, hostOf, registrableDomain } from './analyze.js';
export { REPORT_THRESHOLD } from './analyze.js';
import { addFeedback, addReport } from './db.js';

const VERDICTS = ['danger', 'suspicious', 'no_red_flags'];
const LANGS = ['en', 'fil'];
const CODE = /^[a-zA-Z]{2,20}$/;

// Turns whatever the person reported into a plain website name like "bdo-login.top".
// Rejects raw IP addresses and anything that isn't a public website name.
export function validateReport(body) {
  const input = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!input || input.length > 2000) throw new Error('missing url');
  const url = asSingleLink(input);
  if (!url) throw new Error('not a link');
  const host = hostOf(url);
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) throw new Error('not a website name');
  return registrableDomain(host);
}

export function validateFeedback(body) {
  const verdict = body?.verdict;
  if (!VERDICTS.includes(verdict)) throw new Error('bad verdict');
  if (typeof body.correct !== 'boolean') throw new Error('bad correct');
  const codes = Array.isArray(body.codes) ? body.codes.filter(c => typeof c === 'string' && CODE.test(c)).slice(0, 30) : [];
  const lang = LANGS.includes(body.lang) ? body.lang : 'en';
  return { verdict, correct: body.correct, codes: [...new Set(codes)], lang };
}

// A one-way fingerprint of the reporter, so one person can't report the same site many times.
// The secret means it can't be reversed back to an address, and the address itself is never stored.
export function reporterId(clientAddress, secret = process.env.REPORT_SECRET) {
  if (!secret) throw new Error('REPORT_SECRET is not set');
  return createHmac('sha256', secret).update(String(clientAddress)).digest('hex');
}

export async function handleReport(body, clientAddress) {
  const domain = validateReport(body);
  if (!(await addReport(domain, reporterId(clientAddress)))) throw new Error('storage unavailable');
  return { ok: true, domain };
}

export async function handleFeedback(body) {
  if (!(await addFeedback(validateFeedback(body)))) throw new Error('storage unavailable');
  return { ok: true };
}
