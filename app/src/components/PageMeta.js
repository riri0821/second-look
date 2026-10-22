import { useCallback } from 'react';
import { Platform } from 'react-native';
import Head from 'expo-router/head';
import { useFocusEffect } from 'expo-router';

function setMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Page title and description for the web version and link previews. Keep descriptions under 155 characters.
// `fullTitle` replaces the usual "Page | Second Look" pattern, for the homepage.
export default function PageMeta({ title, fullTitle, description }) {
  const text = fullTitle ?? (title ? `${title} | Second Look` : 'Second Look');

  // Tabs stay loaded in the background, so the page that comes on screen sets the title itself.
  useFocusEffect(useCallback(() => {
    if (Platform.OS !== 'web') return;
    const apply = () => {
      document.title = text;
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:title"]', 'property', 'og:title', text);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    };
    apply();
    const timer = setTimeout(apply, 50); // after the navigator updates the title
    return () => clearTimeout(timer);
  }, [text, description]));

  return (
    <Head>
      <title>{text}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={text} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
