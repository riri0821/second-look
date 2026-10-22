import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C, T } from '../components/theme';
import { LanguageProvider, useLanguage } from '../i18n';
import { READING_MAX, useWide } from '../lib/layout';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Screens />
    </LanguageProvider>
  );
}

function Screens() {
  const { t } = useLanguage();
  const wide = useWide();
  // On a computer screen, single pages (lessons, quiz, About) read best as a centered column.
  const page = wide ? { width: '100%', maxWidth: READING_MAX, alignSelf: 'center' } : null;
  return (
    <>
      <Stack
        screenOptions={{
          headerTintColor: C.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: C.bg },
          headerTitleStyle: { fontWeight: '700', fontSize: T.M },
          headerBackTitle: t.lesson.back,
          contentStyle: [{ backgroundColor: C.bg }, page],
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="lesson/[id]" options={{ title: '' }} />
        <Stack.Screen name="quiz" options={{ title: t.quiz.title }} />
        <Stack.Screen name="result/[id]" options={{ title: t.saved.title }} />
        <Stack.Screen name="about" options={{ title: t.about.title, presentation: wide ? 'card' : 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
