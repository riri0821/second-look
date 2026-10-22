import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T, button } from './theme';
import { useLanguage } from '../i18n';
import { reportSite, sendFeedback } from '../lib/api';

// "Was this result right?" and "Report this website as a scam", under a result.
// Each can be sent once per result; only the website address or the yes/no answer is sent.
export default function ResultActions({ result }) {
  const { t, lang } = useLanguage();
  const [feedback, setFeedback] = useState('idle'); // idle | sending | done | failed
  const [report, setReport] = useState('idle');
  const site = result.links[0]?.finalUrl;

  async function answer(correct) {
    setFeedback('sending');
    try {
      await sendFeedback(result, correct, lang);
      setFeedback('done');
    } catch {
      setFeedback('failed');
    }
  }

  async function reportIt() {
    setReport('sending');
    try {
      await reportSite(site);
      setReport('done');
    } catch {
      setReport('failed');
    }
  }

  return (
    <View style={styles.wrap}>
      {feedback === 'done' ? (
        <Note icon="checkmark-circle" text={t.result.thanksFeedback} />
      ) : (
        <View>
          <Text style={styles.question}>{t.result.wasRight}</Text>
          <View style={styles.row}>
            {[[true, t.result.yes, 'thumbs-up-outline'], [false, t.result.no, 'thumbs-down-outline']].map(([value, label, icon]) => (
              <Pressable
                key={label}
                style={({ pressed }) => [button.secondary, styles.half, (pressed || feedback === 'sending') && styles.dim]}
                disabled={feedback === 'sending'}
                onPress={() => answer(value)}
                accessibilityRole="button"
              >
                <View style={styles.inner}>
                  <Ionicons name={icon} size={20} color={C.text} />
                  <Text style={button.secondaryText}>{label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          {feedback === 'failed' && <Text style={styles.failed}>{t.result.sendFailed}</Text>}
        </View>
      )}

      {site && (report === 'done' ? (
        <Note icon="flag" text={t.result.reported} />
      ) : (
        <View>
          <Pressable
            style={({ pressed }) => [button.secondary, styles.report, (pressed || report === 'sending') && styles.dim]}
            disabled={report === 'sending'}
            onPress={reportIt}
            accessibilityRole="button"
          >
            <View style={styles.inner}>
              <Ionicons name="flag-outline" size={20} color={C.text} />
              <Text style={[button.secondaryText, styles.shrink]}>{t.result.report}</Text>
            </View>
          </Pressable>
          {report === 'failed' && <Text style={styles.failed}>{t.result.sendFailed}</Text>}
        </View>
      ))}
    </View>
  );
}

function Note({ icon, text }) {
  return (
    <View style={styles.note}>
      <Ionicons name={icon} size={20} color={C.text} />
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 18, gap: 16 },
  question: { fontSize: T.M, fontWeight: '700', color: C.text, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shrink: { flexShrink: 1, textAlign: 'center' },
  report: { paddingVertical: 10 },
  dim: { opacity: 0.6 },
  failed: { fontSize: T.S, color: C.muted, marginTop: 8 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, backgroundColor: C.surface },
  noteText: { flex: 1, fontSize: T.M, color: C.text, lineHeight: 24 },
});
