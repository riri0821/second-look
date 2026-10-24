import Constants from 'expo-constants';

// Set EXPO_PUBLIC_API_URL in app/.env to point at the server.
// Otherwise, assume the server runs on the same computer as the Expo dev server.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3123`;
export const PRIVACY_URL = `${API_URL}/privacy`;

async function post(path, text, lang) {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang }),
  });
}

export async function checkMessage(text, lang = 'en') {
  let res = await post('/v1/analyze', text, lang);
  // Servers deployed before the versioned API only know /analyze.
  if (res.status === 404) res = await post('/analyze', text, lang);
  // A sleeping or restarting server can answer with an HTML page, not JSON.
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Check failed');
  return data;
}

async function send(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Could not send');
  return res.json();
}

// "Report this website as a scam". Only the website address is sent.
export const reportSite = url => send('/v1/report', { url });

// "Was this result right?" Only the verdict, the answer and which checks fired are sent.
export const sendFeedback = (result, correct, lang) => send('/v1/feedback', {
  verdict: result.verdict,
  correct,
  lang,
  codes: [...result.messageFlags, ...result.links.flatMap(l => l.flags)].map(f => f.code).filter(Boolean),
});
