import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, button, type, T } from '../components/theme';
import { setOnboarded } from '../lib/storage';
import PageMeta from '../components/PageMeta';

const STEPS = [
  {
    icon: 'shield-checkmark',
    title: 'A second look before you click',
    body: 'Scam texts and emails are designed to look real. Second Look checks them for you and explains what it finds, in plain words.',
  },
  {
    icon: 'clipboard',
    title: 'Copy, paste, check',
    body: 'Got a message that feels off? Copy it, paste it into the app, and tap Check it. You will see right away whether it looks safe.',
  },
  {
    icon: 'lock-closed',
    title: 'Your messages stay private',
    body: 'We check the message and then forget it. Nothing is stored on our side. Your history is saved only on this phone, and you can delete it anytime.',
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  async function next() {
    if (!last) return setI(i + 1);
    await setOnboarded();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <PageMeta title="Welcome" description={'Second Look checks suspicious messages before you click. Learn how it works and how your messages stay private.'} />
      <View style={styles.top}>
        {i > 0 ? (
          <Pressable onPress={() => setI(i - 1)} hitSlop={10} style={styles.back}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : <View />}
        <Text style={styles.count}>{i + 1} of {STEPS.length}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons name={step.icon} size={44} color="#fff" />
        </View>
        <Text style={[type.h1, styles.title]}>{step.title}</Text>
        <Text style={[type.body, styles.body]}>{step.body}</Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [button.primary, pressed && { opacity: 0.75 }]} onPress={next}>
          <Text style={button.primaryText}>{last ? 'Get started' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, minHeight: 44 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { fontSize: T.M, fontWeight: '600', color: C.text },
  count: { fontSize: T.M, color: C.muted },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  icon: { width: 88, height: 88, borderRadius: 24, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 28 },
  body: { marginTop: 14, color: C.muted },
  footer: { padding: 24 },
});
