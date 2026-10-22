import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { C, T } from '../components/theme';
import { LanguageProvider, useLanguage } from '../i18n';

// On a computer screen the app is shown as a centered column instead of stretching edge to edge.
const COLUMN = 640;

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Frame>
        <Screens />
      </Frame>
    </LanguageProvider>
  );
}

function Frame({ children }) {
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width > COLUMN + 40;
  if (!wide) return children;
  return (
    <View style={styles.backdrop}>
      <View style={styles.column}>{children}</View>
    </View>
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: C.surface, alignItems: 'center' },
  column: {
    flex: 1, width: '100%', maxWidth: COLUMN, backgroundColor: C.bg,
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
});
