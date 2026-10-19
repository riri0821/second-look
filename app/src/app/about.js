import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { C, type, T } from '../components/theme';
import { PRIVACY_URL } from '../lib/api';
import PageMeta from '../components/PageMeta';
import LanguagePicker from '../components/LanguagePicker';
import { fill, useLanguage } from '../i18n';

export default function About() {
  const { t } = useLanguage();
  const a = t.about;
  const links = [
    { icon: 'document-text-outline', label: a.privacyPolicy, url: PRIVACY_URL },
    { icon: 'flag-outline', label: a.reportPH, url: 'https://cicc.gov.ph' },
    { icon: 'flag-outline', label: a.reportUS, url: 'https://reportfraud.ftc.gov' },
  ];

  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={styles.container}>
      <PageMeta title="About and privacy" description={'What Second Look does, how your messages are handled, and why nothing you check is ever stored on our servers.'} />

      <View style={styles.section}>
        <Text style={styles.heading} accessibilityRole="header">{a.language}</Text>
        <View style={{ marginTop: 10 }}><LanguagePicker /></View>
      </View>

      {a.sections.map(s => (
        <View key={s.title} style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">{s.title}</Text>
          <Text style={[type.body, { marginTop: 8, color: C.muted }]}>{s.body}</Text>
        </View>
      ))}

      {links.map((l, i) => (
        <Pressable
          key={l.url}
          style={({ pressed }) => [styles.link, i > 0 && { borderTopWidth: 0 }, pressed && { opacity: 0.7 }]}
          onPress={() => Linking.openURL(l.url)}
          accessibilityRole="link"
        >
          <Ionicons name={l.icon} size={20} color={C.text} />
          <Text style={styles.linkText}>{l.label}</Text>
          <Ionicons name="open-outline" size={18} color={C.muted} />
        </Pressable>
      ))}

      <Text style={styles.version}>{fill(a.version, { v: Constants.expoConfig?.version ?? '1.0.0' })}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  section: { marginBottom: 28 },
  heading: { fontSize: T.M, fontWeight: '800', color: C.text },
  link: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border },
  linkText: { flex: 1, fontSize: T.M, fontWeight: '600', color: C.text },
  version: { fontSize: T.S, color: C.faint, textAlign: 'center', marginTop: 28 },
});
