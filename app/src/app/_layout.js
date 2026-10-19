import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C, T } from '../components/theme';
import { LanguageProvider, useLanguage } from '../i18n';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Screens />
    </LanguageProvider>
  );
}

function Screens() {
  const { t } = useLanguage();
  return (
    <>
      <Stack
        screenOptions={{
          headerTintColor: C.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: C.bg },
          headerTitleStyle: { fontWeight: '700', fontSize: T.M },
          headerBackTitle: t.lesson.back,
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="lesson/[id]" options={{ title: '' }} />
        <Stack.Screen name="quiz" options={{ title: t.quiz.title }} />
        <Stack.Screen name="result/[id]" options={{ title: t.saved.title }} />
        <Stack.Screen name="about" options={{ title: t.about.title, presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
