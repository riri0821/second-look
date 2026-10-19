import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { STRINGS } from './strings';

const KEY = 'language.v1';
export const LANGUAGES = ['en', 'fil'];

// First launch: use Filipino if the phone is set to Filipino or Tagalog.
function deviceLanguage() {
  try {
    const code = getLocales()[0]?.languageCode;
    return code === 'fil' || code === 'tl' ? 'fil' : 'en';
  } catch {
    return 'en';
  }
}

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(saved => setLangState(LANGUAGES.includes(saved) ? saved : deviceLanguage()))
      .catch(() => setLangState(deviceLanguage()));
  }, []);

  const value = useMemo(() => ({
    lang: lang ?? 'en',
    setLang: next => {
      setLangState(next);
      AsyncStorage.setItem(KEY, next).catch(() => {});
    },
  }), [lang]);

  if (lang === null) return null; // brief: avoids showing English, then switching
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// Fills {name} placeholders.
export const fill = (text, values = {}) => text.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));

export function useLanguage() {
  const { lang, setLang } = useContext(LanguageContext);
  return { lang, setLang, t: STRINGS[lang], toggle: () => setLang(lang === 'en' ? 'fil' : 'en') };
}
