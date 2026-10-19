# Second Look

Paste a suspicious text, email or link; Second Look tells you if it looks like a scam and why.

- `app/`: the mobile app (React Native + Expo SDK 57)
- `server/`: the checking backend (Node.js, no dependencies), hosted at https://second-look-server.onrender.com

## Open the app on your iPhone

1. Open a **new PowerShell window** and go to the app folder first:
   ```
   cd C:\Users\user\Desktop\PCheck\app
   ```
   (If you skip this, npx offers to install `expo@58`. Answer **n**.)
2. Sign in to Expo for this window. Paste your token from expo.dev → Account settings → Access tokens:
   ```
   $env:EXPO_TOKEN="your-token"
   ```
   Check with `npx expo whoami`; it should print `0xakariri`.
3. Start the app:
   - Good home Wi-Fi: `npx expo start -c`
   - Weak Wi-Fi or mobile data: `npx expo start -c --tunnel`
4. On the iPhone: open **Expo Go**, pull down to refresh, tap **Second Look** under Development servers.
   Or scan the QR code in the terminal with the **Camera** app.

The server is online, so you don't need to run it. The first check after 15 idle minutes takes ~30 seconds.

**Changes:** code edits refresh on the phone automatically. After changing `.env`, `app.json` or
installing packages, stop with Ctrl+C and run step 3 again. Shake the phone → **Reload** if it gets stuck.

## Server

Pushing to GitHub redeploys it on Render automatically. To run it locally instead:
```
cd server
npm start
```
Then set `EXPO_PUBLIC_API_URL=http://<your-PC-IP>:3123` in `app/.env`.
Optional: add Google Safe Browsing / VirusTotal keys in Render's Environment settings.

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
