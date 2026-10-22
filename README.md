# Second Look

A scam checker for text messages, emails and links, built for everyone, with people in the Philippines
as one of its main audiences.

Paste a message you're not sure about. Second Look tells you if it looks like a scam, explains why in
plain words, and says what to do next. It works in English and Filipino, and it never stores the
messages people check.

Try the website at [secondlook.tamara-dev.com](https://secondlook.tamara-dev.com). The phone app
(Android and iPhone, built with Expo) is still in development and not yet in the app stores.

## What it catches

- Fake websites that copy real ones, like `paypa1.com` or `bdo-online-verify.top`
- Company names used in websites they don't own, across 170+ banks, e-wallets, couriers,
  government offices and online stores, about 70 of them Philippine
- Links hidden behind shorteners or redirects through Google, Facebook, LinkedIn and Outlook
- Websites created only days or weeks ago
- Scams with no link at all: requests for your OTP, payment in gift cards or load, threats of arrest,
  fake prizes, "bagong number ko to" money requests, fake jobs and loans, in English and Tagalog
- Websites that several Second Look users have already reported as scams

Real bank messages that warn people *not* to share their OTP are recognized as safe. That case was a
real false alarm during testing and is now covered by tests.

## Limits

Second Look is not perfect. It looks for warning signs, so a new kind of scam it hasn't seen can get
through, and a real message can sometimes be flagged. A "no red flags" result does not prove a
message is safe. When in doubt, contact the company yourself using the number on your card or their
official app, never the one in the message.

That is why Second Look explains every result instead of only giving a score. Each check, lesson and
quiz question teaches the warning signs, so people learn to spot scams on their own, even the ones
the checker misses.

## Other features

- Six short lessons on spotting scams and a 12-question quiz, with Philippine examples
- History of past checks, kept only on the user's device
- "Was this result right?" feedback and "Report this website" buttons
- Senior-friendly design: large text, big buttons, plain language

## Privacy and security

- Messages are checked in memory and never saved or logged.
- Only website addresses are looked up with outside services, never the message itself.
- Reports store the website name and a one-way code instead of the reporter's address.
- The server refuses to fetch private or internal addresses (SSRF protection), limits each client
  to 30 checks a minute, and uses parameterized database queries only.
- Database tables use row level security, and the app's database account can only do what it needs.

A security self-assessment of the server found and fixed a
rate limit weakness and a false-positive issue. Both are covered by regression tests.

## How it's built

| Part | Technology |
| --- | --- |
| App and website | React Native, Expo (SDK 57), Expo Router |
| Server | Node.js, PostgreSQL (Supabase) |
| Hosting | Render |
| Tests | Node test runner, GitHub Actions on every push |

```
app/      the phone app and website
server/   the checker API, scam patterns, brand list and database code
```

## Running it locally

Server:

```
cd server
npm install
npm start
```

It runs on port 3123. Copy `server/.env.example` to `server/.env` to add optional settings like the
database connection or a Google Safe Browsing key. Without them, the core checks still work.

App:

```
cd app
npm install
npx expo start
```

Open it in Expo Go on a phone, or press `w` for the website. Set `EXPO_PUBLIC_API_URL` in `app/.env`
to choose which server the app talks to.

## Tests

```
cd server
npm test
```

The tests cover real scam and real bank messages in both languages, the link checks, the database
code and the server's protections.
