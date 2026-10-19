import { fill } from '../i18n';

// "Just now", "5 min ago", "Yesterday", or a date. Written for people, not developers.
export function timeAgo(iso, words) {
  const mins = Math.floor((Date.now() - Date.parse(iso)) / 60000);
  if (mins < 1) return words.justNow;
  if (mins < 60) return fill(words.minAgo, { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return fill(words.hrAgo, { n: hours });
  if (hours < 48) return words.yesterday;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
