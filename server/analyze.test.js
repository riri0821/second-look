import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, brandInText, extractUrls, staticChecks, textChecks, unwrapLink } from './analyze.js';

const reasons = flags => flags.map(f => f.reason).join(' | ');
const offline = {}; // no API keys

test('extracts links from a scam text', () => {
  assert.deepEqual(extractUrls('USPS: your package is held. Visit usps-redelivery.top/track now.'), ['http://usps-redelivery.top/track']);
});

test('reveals disguised links', () => {
  assert.deepEqual(extractUrls('go to hxxps://bdo-secure[.]com/login'), ['https://bdo-secure.com/login']);
  assert.ok(extractUrls('open https%3A%2F%2Fgcash-promo.top%2Fclaim').includes('https://gcash-promo.top/claim'));
});

test('flags lookalike websites', () => {
  assert.match(reasons(staticChecks('https://paypa1.com/login')), /made to look like PayPal/);
  assert.match(reasons(staticChecks('http://paypa1-secure-login.xyz/verify')), /made to look like PayPal/);
  assert.match(reasons(staticChecks('https://gcash-rewards.online/')), /uses the name GCash/);
  assert.match(reasons(staticChecks('https://sss-benefits.com/claim')), /uses the name SSS/);
  assert.match(reasons(staticChecks('https://metr0bank-ph.com/')), /made to look like Metrobank/);
});

test('does not flag real websites', () => {
  for (const url of ['https://www.paypal.com/signin', 'https://www.bdo.com.ph/', 'https://online.bpi.com.ph/', 'https://www.gcash.com/', 'https://outlook.live.com/', 'https://www.amazon.co.uk/']) {
    assert.equal(staticChecks(url).length, 0, url);
  }
});

test('ignores everyday words inside website names', () => {
  assert.equal(staticChecks('https://smart-home-store.com/').length, 0);
  assert.equal(staticChecks('https://united-way.org/').length, 0);
});

test('unwraps links hidden behind trusted websites', () => {
  const g = unwrapLink('https://www.google.com/url?q=https://bdo-login.top/x');
  assert.equal(g.target, 'https://bdo-login.top/x');
  assert.ok(g.via[0].known);
  assert.equal(unwrapLink('https://www.linkedin.com/redir/redirect?url=https%3A%2F%2Fevil.example%2F').target, 'https://evil.example/');
  assert.equal(unwrapLink('https://www.bdo.com.ph/').via.length, 0);
});

test('catches scams with no link', () => {
  assert.match(reasons(textChecks('Please send the OTP we sent you to cancel the transaction')), /security code/);
  assert.match(reasons(textChecks('Pay your tax balance with Google Play gift cards today')), /gift cards/);
  assert.match(reasons(textChecks('Nanalo ka ng 50,000 sa raffle! I-claim ngayon din')), /won something/);
  assert.match(reasons(textChecks('Ibigay mo ang OTP para ma-verify')), /security code/);
  assert.match(reasons(textChecks('Hi Ma, bagong number ko to. Nawala ang phone ko, padala ka pera sa gcash')), /someone you know/);
  assert.match(reasons(textChecks('Install AnyDesk so our technician can help')), /remote access/);
});

test('leaves normal messages alone', () => {
  assert.equal(textChecks('Reminder: your dental appointment is Tuesday at 10:30 AM.').length, 0);
  assert.equal(textChecks('Can you pick up milk on the way home?').length, 0);
});

test('spots which brand a message claims to be', () => {
  assert.equal(brandInText('BDO: Your account has been locked')?.key, 'bdo');
  assert.equal(brandInText('Your Pag-IBIG contribution is unpaid')?.key, 'pagibig');
  assert.equal(brandInText('I will target the morning train')?.key, undefined);
  assert.equal(brandInText('Your Target order shipped')?.key, 'target');
});

test('no-link scams can reach "Likely a scam"', async () => {
  const r = await analyze('URGENT: This is the BIR. You have unpaid taxes and a warrant for your arrest. Pay with GCash load or gift cards today.', offline);
  assert.equal(r.verdict, 'danger');
});

test('never fetches internal addresses', async () => {
  const r = await analyze('see http://127.0.0.1:3123/health and http://169.254.169.254/latest', offline);
  assert.ok(r.links.every(l => l.finalUrl === l.url));
});

test('a family emergency money request is never shown as safe', async () => {
  const r = await analyze('Ma, bagong number ko to. Nawala ang phone ko, padala ka pera sa gcash ko please', offline);
  assert.notEqual(r.verdict, 'no_red_flags');
});

test('explains reasons in Filipino when asked', async () => {
  const r = await analyze('Ibigay mo ang OTP para ma-verify', offline, 'fil');
  assert.match(reasons(r.messageFlags), /OTP mo/);
});

test('real bank safety messages are not flagged', async () => {
  const real = [
    'BPI: Your OTP is 482913. Do not share this code with anyone. BPI will never ask for your OTP.',
    'BPI: Never share your OTP, PIN or password with anyone. BPI will never call, text or email you to ask for them.',
    'BPI: Your BPI Online password will expire in 7 days. Log in to the BPI app to update it.',
    'BDO: Huwag ibigay ang OTP mo kahit kanino. Hindi namin ito hihingin.',
    'BPI: You paid PHP 1,250.00 to MERALCO via the BPI app. If you did not make this transaction, call our hotline at (02) 889-10000.',
  ];
  for (const text of real) assert.equal((await analyze(text, offline)).verdict, 'no_red_flags', text);
});

test('a warning sentence does not hide a scam request after it', async () => {
  const r = await analyze('Do not ignore this message. Send the OTP we sent you now to keep your account.', offline);
  assert.match(reasons(r.messageFlags), /security code/);
});

test('a real BPI transaction OTP alert is not flagged', async () => {
  const text = `[BPI] TRANSACTION ALERT: BEWARE OF SCAMMERS. NEVER SHARE THIS SECRET ONE-TIME PIN (OTP) WITH ANYONE.

This OTP is to approve your purchase at agoda.com amounting to PHP 16,057.90 using your BPI debit card ending in 0420.

Are you sure that this is a valid transaction? If yes, the SECRET OTP is 022319. If this is not your transaction, do not use this OTP and call (+632) 889-10000`;
  assert.equal((await analyze(text, offline)).verdict, 'no_red_flags');
});
