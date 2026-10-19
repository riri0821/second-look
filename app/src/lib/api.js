import Constants from 'expo-constants';

// Set EXPO_PUBLIC_API_URL in app/.env to point at the server.
// Otherwise, assume the server runs on the same computer as the Expo dev server.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3123`;
export const PRIVACY_URL = `${API_URL}/privacy`;

async function post(path, text) {
  return fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
}

export async function checkMessage(text) {
  let res = await post('/v1/analyze', text);
  // Servers deployed before the versioned API only know /analyze.
  if (res.status === 404) res = await post('/analyze', text);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Check failed');
  return data;
}
