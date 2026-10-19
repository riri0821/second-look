import AsyncStorage from '@react-native-async-storage/async-storage';

// Everything here stays on the phone. Nothing is sent to the server.
const KEYS = {
  history: 'history.v1',
  onboarded: 'onboarded.v1',
  lessons: 'lessonsDone.v1',
  bestStreak: 'quizBestStreak.v1',
};
const MAX_HISTORY = 50;

async function getJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const setJSON = (key, value) => AsyncStorage.setItem(key, JSON.stringify(value));

export const getHistory = () => getJSON(KEYS.history, []);

export async function addHistory(text, result) {
  const entry = { id: String(Date.now()), at: new Date().toISOString(), text, result };
  const list = [entry, ...(await getHistory())].slice(0, MAX_HISTORY);
  await setJSON(KEYS.history, list);
  return entry;
}

export async function getHistoryEntry(id) {
  return (await getHistory()).find(e => e.id === id) ?? null;
}

export async function removeHistory(id) {
  await setJSON(KEYS.history, (await getHistory()).filter(e => e.id !== id));
}

export const clearHistory = () => AsyncStorage.removeItem(KEYS.history);

export const isOnboarded = () => getJSON(KEYS.onboarded, false);
export const setOnboarded = () => setJSON(KEYS.onboarded, true);

export const getLessonsDone = () => getJSON(KEYS.lessons, []);
export async function markLessonDone(id) {
  const done = await getLessonsDone();
  if (!done.includes(id)) await setJSON(KEYS.lessons, [...done, id]);
}

export const getBestStreak = () => getJSON(KEYS.bestStreak, 0);
export const setBestStreak = n => setJSON(KEYS.bestStreak, n);
