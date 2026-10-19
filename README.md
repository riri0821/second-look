# Second Look

Paste a suspicious text, email or link; Second Look tells you if it looks like a scam and why.

- `app/`: the mobile app (React Native + Expo)
- `server/`: the checking backend (Node.js, no dependencies)

## Run it

You need two terminals.

**1. Server**
```
cd server
npm start
```
Runs on http://localhost:3123. Optional: copy `.env.example` to `.env` and add free
Google Safe Browsing / VirusTotal keys for extra checks.

**2. App**
```
cd app
npx expo start
```
Install **Expo Go** on your phone, scan the QR code, and make sure the phone is on the same
Wi-Fi as your PC. Windows may ask to allow Node.js through the firewall; allow it on private networks.

## What it checks
- Lookalike domains (`paypa1.com`), brand names in fake domains, punycode, raw IPs
- Link shorteners (follows them to the real destination)
- Domain age via RDAP (brand-new sites are a red flag)
- Risky domain endings, pressure language ("urgent", "suspended")
- Message mentions a brand but links elsewhere
- Google Safe Browsing and VirusTotal (if keys are set)

## Tests
```
cd server
npm test
```
