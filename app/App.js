import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

// Set EXPO_PUBLIC_API_URL in app/.env to point at the server (needed in tunnel mode).
// Otherwise, assume the server runs on the same computer as the Expo dev server.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3123`;

// Black and white everywhere; color is reserved for verdicts so it always means something.
const C = {
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E5E5E5',
  text: '#0A0A0A',
  muted: '#6B6B6B',
  faint: '#A3A3A3',
};

const VERDICTS = {
  danger: { label: 'Likely a scam', hint: "Don't click the link or reply.", color: '#DC2626', tint: '#FEF2F2', mark: '!' },
  suspicious: { label: 'Be careful', hint: 'Some warning signs. Check with the sender another way.', color: '#D97706', tint: '#FFFBEB', mark: '?' },
  no_red_flags: { label: 'No red flags', hint: 'Nothing suspicious found, but no check is perfect.', color: '#16A34A', tint: '#F0FDF4', mark: '✓' },
};

function severityColor(points) {
  if (points >= 30) return VERDICTS.danger.color;
  if (points >= 10) return VERDICTS.suspicious.color;
  return C.faint;
}

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  // The free server sleeps when idle; tell people why the first check is slow.
  useEffect(() => {
    if (!loading) return setSlow(false);
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, [loading]);

  async function paste() {
    const clip = await Clipboard.getStringAsync();
    if (clip) setText(clip);
  }

  function reset() {
    setText('');
    setResult(null);
    setError('');
  }

  async function check() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check failed');
      setResult(data);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      setError("Couldn't reach Second Look. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const v = result && VERDICTS[result.verdict];
  const reasons = result
    ? [...result.messageFlags, ...result.links.flatMap(l => l.flags)].sort((a, b) => b.points - a.points)
    : [];
  const canCheck = text.trim() && !loading;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}><Text style={styles.logoText}>2</Text></View>
            <Text style={styles.brand}>Second Look</Text>
          </View>

          <Text style={styles.title}>Is this a scam?</Text>
          <Text style={styles.subtitle}>Paste a text, email or link. We'll check it before you click.</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Paste the message here"
              placeholderTextColor={C.faint}
              value={text}
              onChangeText={setText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.inputBar}>
              {text ? (
                <Pressable onPress={reset} hitSlop={8}><Text style={styles.chip}>Clear</Text></Pressable>
              ) : (
                <Pressable onPress={paste} hitSlop={8}><Text style={styles.chip}>Paste</Text></Pressable>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, !canCheck && styles.buttonDisabled, pressed && styles.buttonPressed]}
            disabled={!canCheck}
            onPress={check}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check it</Text>}
          </Pressable>
          {slow && <Text style={styles.slow}>Waking up the checker… this can take up to 30 seconds.</Text>}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {result && (
            <View style={[styles.card, { borderColor: v.color }]}>
              <View style={[styles.cardTop, { backgroundColor: v.tint }]}>
                <View style={[styles.badge, { backgroundColor: v.color }]}>
                  <Text style={styles.badgeText}>{v.mark}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.verdict, { color: v.color }]}>{v.label}</Text>
                  <Text style={styles.hint}>{v.hint}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.scoreRow}>
                  <Text style={styles.label}>Risk score</Text>
                  <Text style={styles.scoreNum}>{result.score}<Text style={styles.scoreMax}>/100</Text></Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.max(result.score, 2)}%`, backgroundColor: v.color }]} />
                </View>

                <Text style={[styles.label, { marginTop: 20 }]}>
                  {reasons.length ? 'What we found' : result.links.length ? 'What we checked' : 'Note'}
                </Text>
                {reasons.length === 0 && (
                  <Text style={styles.reason}>
                    {result.links.length ? 'The link passed every check.' : 'No links found in this message. Be wary of anyone asking for money, codes or passwords.'}
                  </Text>
                )}
                {reasons.map((r, i) => (
                  <View key={i} style={styles.reasonRow}>
                    <View style={[styles.dot, { backgroundColor: severityColor(r.points) }]} />
                    <Text style={[styles.reason, { marginTop: 0 }]}>{r.reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {!result && !loading && (
            <View style={styles.tips}>
              <Text style={styles.label}>What we look for</Text>
              {['Fake look-alike websites', 'Hidden or shortened links', 'Brand-new domains', 'Urgent, pressuring language'].map(t => (
                <Text key={t} style={styles.tip}>—  {t}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { padding: 24, paddingTop: 56, paddingBottom: 48 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 36 },
  logo: { width: 28, height: 28, borderRadius: 8, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  brand: { fontSize: 17, fontWeight: '700', color: C.text, letterSpacing: -0.2 },

  title: { fontSize: 34, fontWeight: '800', color: C.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: C.muted, marginTop: 8, marginBottom: 24, lineHeight: 22 },

  inputWrap: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  input: { minHeight: 140, padding: 16, paddingBottom: 8, fontSize: 16, color: C.text, textAlignVertical: 'top', lineHeight: 22 },
  inputBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingBottom: 12 },
  chip: {
    fontSize: 13, fontWeight: '600', color: C.text, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, overflow: 'hidden',
  },

  button: { backgroundColor: C.text, borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  buttonDisabled: { opacity: 0.25 },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  slow: { color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 10 },
  error: { color: C.text, marginTop: 14, fontSize: 14, textAlign: 'center' },

  card: { marginTop: 28, borderRadius: 18, borderWidth: 1.5, overflow: 'hidden', backgroundColor: C.bg },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  badgeText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  verdict: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  hint: { fontSize: 14, color: C.muted, marginTop: 2, lineHeight: 19 },

  cardBody: { padding: 18, paddingTop: 16 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 12, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  scoreNum: { fontSize: 22, fontWeight: '800', color: C.text },
  scoreMax: { fontSize: 14, fontWeight: '600', color: C.faint },
  track: { height: 6, backgroundColor: C.surface, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },

  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 7, marginRight: 12 },
  reason: { flex: 1, fontSize: 15, color: C.text, lineHeight: 21, marginTop: 10 },

  tips: { marginTop: 36, paddingTop: 20, borderTopWidth: 1, borderTopColor: C.border },
  tip: { fontSize: 15, color: C.muted, marginTop: 10 },
});
