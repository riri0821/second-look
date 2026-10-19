import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C, T } from '../components/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTintColor: C.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: C.bg },
          headerTitleStyle: { fontWeight: '700', fontSize: T.M },
          headerBackTitle: 'Back',
          contentStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="lesson/[id]" options={{ title: '' }} />
        <Stack.Screen name="quiz" options={{ title: 'Test your knowledge' }} />
        <Stack.Screen name="result/[id]" options={{ title: 'Saved check' }} />
        <Stack.Screen name="about" options={{ title: 'About & privacy', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
