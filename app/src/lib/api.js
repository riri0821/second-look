import Constants from 'expo-constants';

// Set EXPO_PUBLIC_API_URL in app/.env to point at the server.
// Otherwise, assume the server runs on the same computer as the Expo dev server.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3123`;

export async function checkMessage(text) {
  const res = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Check failed');
  return data;
}
