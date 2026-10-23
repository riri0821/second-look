import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, button, type, T } from '../components/theme';
import { setOnboarded } from '../lib/storage';
import PageMeta from '../components/PageMeta';
import LanguagePicker from '../components/LanguagePicker';
import { fill, useLanguage } from '../i18n';

const ICONS = ['shield-checkmark', 'clipboard', 'lock-closed'];

export default function Onboarding() {
  const { t } = useLanguage();
  const o = t.onboarding;
  const [i, setI] = useState(0);
  const step = o.steps[i];
  const last = i === o.steps.length - 1;

  // The intro screens are for the phone app only; on the website this address goes to the homepage.
  if (Platform.OS === 'web') return <Redirect href="/" />;

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
          <Pressable onPress={() => setI(i - 1)} hitSlop={10} style={styles.back} accessibilityRole="button">
            <Ionicons name="chevron-back" size={22} color={C.text} />
            <Text style={styles.backText}>{o.back}</Text>
          </Pressable>
        ) : <View />}
        <Text style={styles.count}>{fill(o.stepOf, { n: i + 1, total: o.steps.length })}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons name={ICONS[i]} size={44} color="#fff" />
        </View>
        <Text style={[type.h1, styles.title]} accessibilityRole="header">{step.title}</Text>
        <Text style={[type.body, styles.body]}>{step.body}</Text>

        {i === 0 && (
          <View style={styles.language}>
            <Text style={styles.languageLabel}>{o.chooseLanguage}</Text>
            <LanguagePicker />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [button.primary, pressed && { opacity: 0.75 }]} onPress={next} accessibilityRole="button">
          <Text style={button.primaryText}>{last ? o.start : o.next}</Text>
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
  language: { marginTop: 32 },
  languageLabel: { fontSize: T.M, fontWeight: '700', color: C.text, marginBottom: 10 },
  footer: { padding: 24 },
});
