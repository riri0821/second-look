import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, T } from '../../components/theme';
import { isOnboarded } from '../../lib/storage';

// Custom label so the larger text is never clipped by the default label box.
const label = (text) => ({ color }) => (
  <Text style={{ fontSize: T.S, lineHeight: 20, fontWeight: '600', color }}>{text}</Text>
);

const icon = (name) => ({ color, focused }) => (
  <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />
);

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
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
      <Tabs.Screen name="index" options={{ title: 'Check', tabBarLabel: label('Check'), tabBarIcon: icon('shield-checkmark') }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarLabel: label('Learn'), tabBarIcon: icon('book') }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarLabel: label('History'), tabBarIcon: icon('time') }} />
    </Tabs>
  );
}
