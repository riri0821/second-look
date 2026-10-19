import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { C, type, T } from '../components/theme';
import PageMeta from '../components/PageMeta';

const SECTIONS = [
  {
    title: 'What Second Look does',
    body: 'It checks messages and links for the warning signs scammers rely on: fake look-alike websites, hidden links, brand-new websites, and pressure tactics. Then it tells you what it found in plain words.',
  },
  {
    title: 'What happens to your messages',
    body: 'When you tap Check it, the message is sent over a secure connection to our checker. It is checked and then forgotten. We do not save it or log it. Website addresses found in the message may be looked up with security services to see if they are known scams, but your message itself is never shared.',
  },
  {
    title: 'What stays on your phone',
    body: 'Your history and lesson progress are saved only on this phone. Delete them anytime from the History tab. Deleting the app removes them too.',
  },
  {
    title: 'No check is perfect',
    body: 'Second Look can miss new scams, and it can be cautious about real messages. If you are unsure, contact the company yourself using their official app or the number on your card.',
  },
];

export default function About() {
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={styles.container}>
      <PageMeta title="About and privacy" description={'What Second Look does, how your messages are handled, and why nothing you check is ever stored on our servers.'} />
      {SECTIONS.map(s => (
        <View key={s.title} style={styles.section}>
          <Text style={type.h2}>{s.title}</Text>
          <Text style={[type.body, { marginTop: 8, color: C.muted }]}>{s.body}</Text>
        </View>
      ))}

      <Pressable style={styles.link} onPress={() => Linking.openURL('https://reportfraud.ftc.gov')}>
        <Ionicons name="flag-outline" size={20} color={C.text} />
        <Text style={styles.linkText}>Report a scam to the FTC</Text>
        <Ionicons name="open-outline" size={18} color={C.muted} />
      </Pressable>

      <Text style={styles.version}>Version {Constants.expoConfig?.version ?? '1.0.0'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 48 },
  section: { marginBottom: 28 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border },
  linkText: { flex: 1, fontSize: T.M, fontWeight: '600', color: C.text },
  version: { fontSize: T.S, color: C.faint, textAlign: 'center', marginTop: 28 },
});
