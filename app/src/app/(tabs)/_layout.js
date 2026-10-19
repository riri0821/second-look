import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, T } from '../../components/theme';
import { isOnboarded } from '../../lib/storage';
import { useLanguage } from '../../i18n';

// Custom label so the larger text is never clipped by the default label box.
const label = (text) => ({ color }) => (
  <Text style={{ fontSize: T.S, lineHeight: 20, fontWeight: '600', color }} maxFontSizeMultiplier={1.3}>{text}</Text>
);

const icon = (name) => ({ color, focused }) => (
  <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />
);

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [onboarded, setOnboardedState] = useState(null);
  useEffect(() => { isOnboarded().then(setOnboardedState); }, []);

  if (onboarded === null) return null;
  if (!onboarded) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.text,
        tabBarInactiveTintColor: C.faint,
        // Taller than default so the larger labels fit.
        tabBarStyle: { backgroundColor: C.bg, borderTopColor: C.border, height: 66 + insets.bottom, paddingTop: 6, paddingBottom: insets.bottom + 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabs.check, tabBarLabel: label(t.tabs.check), tabBarAccessibilityLabel: t.tabs.check, tabBarIcon: icon('shield-checkmark') }} />
      <Tabs.Screen name="learn" options={{ title: t.tabs.learn, tabBarLabel: label(t.tabs.learn), tabBarAccessibilityLabel: t.tabs.learn, tabBarIcon: icon('book') }} />
      <Tabs.Screen name="history" options={{ title: t.tabs.history, tabBarLabel: label(t.tabs.history), tabBarAccessibilityLabel: t.tabs.history, tabBarIcon: icon('time') }} />
    </Tabs>
  );
}
