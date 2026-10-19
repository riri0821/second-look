import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';

// Set EXPO_PUBLIC_API_URL in app/.env to point at the server (needed in tunnel mode).
// Otherwise, assume the server runs on the same computer as the Expo dev server.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3123`;

const VERDICTS = {
  danger: { label: 'Likely a scam', color: '#C62828', bg: '#FDECEA' },
  suspicious: { label: 'Be careful', color: '#B26A00', bg: '#FFF4E0' },
  no_red_flags: { label: 'No red flags found', color: '#2E7D32', bg: '#E8F5E9' },
};

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (e) {
      setError(`Couldn't reach the Second Look server at ${API_URL}. Is it running?`);
    } finally {
      setLoading(false);
    }
  }

  const v = result && VERDICTS[result.verdict];
  const reasons = result ? [...result.messageFlags, ...result.links.flatMap(l => l.flags)] : [];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Second Look</Text>
          <Text style={styles.subtitle}>Paste a suspicious text, email or link.</Text>

          <TextInput
            style={styles.input}
            multiline
            placeholder="e.g. USPS: Your package is on hold. Confirm your address at usps-track.top/x"
            value={text}
            onChangeText={setText}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            style={[styles.button, (!text.trim() || loading) && styles.buttonDisabled]}
            disabled={!text.trim() || loading}
            onPress={check}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check it</Text>}
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {result && (
            <View style={[styles.card, { backgroundColor: v.bg, borderColor: v.color }]}>
              <Text style={[styles.verdict, { color: v.color }]}>{v.label}</Text>
              <Text style={styles.score}>Risk score: {result.score}/100</Text>
              {result.links.length === 0 && <Text style={styles.reason}>No links found in this message.</Text>}
              {reasons.map((r, i) => <Text key={i} style={styles.reason}>• {r.reason}</Text>)}
              {result.verdict === 'no_red_flags' && (
                <Text style={styles.note}>No check is perfect. If in doubt, go to the company's website yourself instead of using the link.</Text>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FB' },
  container: { padding: 20, paddingTop: 48 },
  title: { fontSize: 32, fontWeight: '800', color: '#0D1B2A' },
  subtitle: { fontSize: 16, color: '#4A5568', marginTop: 4, marginBottom: 20 },
  input: {
    minHeight: 140, backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16,
    borderWidth: 1, borderColor: '#D5DCE5', textAlignVertical: 'top',
  },
  button: { backgroundColor: '#1F5EFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 14 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  error: { color: '#C62828', marginTop: 14 },
  card: { marginTop: 20, borderRadius: 12, borderWidth: 2, padding: 16 },
  verdict: { fontSize: 24, fontWeight: '800' },
  score: { fontSize: 15, color: '#4A5568', marginTop: 2, marginBottom: 10 },
  reason: { fontSize: 15, color: '#1A202C', marginTop: 6, lineHeight: 21 },
  note: { fontSize: 13, color: '#4A5568', marginTop: 12, fontStyle: 'italic' },
});
