import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, T, type } from './theme';
import { useLanguage } from '../i18n';

function severityColor(points) {
  if (points >= 30) return VERDICTS.danger.color;
  if (points >= 10) return VERDICTS.suspicious.color;
  return C.faint;
}

export default function ResultCard({ result }) {
  const { t } = useLanguage();
  const v = VERDICTS[result.verdict];
  const words = t.verdicts[result.verdict];
  const reasons = [...result.messageFlags, ...result.links.flatMap(l => l.flags)].sort((a, b) => b.points - a.points);
  const steps = t.result.next[result.verdict];

  return (
    <View style={[styles.card, { borderColor: v.color }]}>
      <View style={[styles.top, { backgroundColor: v.tint }]} accessible accessibilityLabel={`${words.label}. ${words.hint}`}>
        <View style={[styles.badge, { backgroundColor: v.color }]}>
          <Ionicons name={v.icon} size={24} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.verdict, { color: v.color }]}>{words.label}</Text>
          <Text style={styles.hint}>{words.hint}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.scoreRow} accessible accessibilityLabel={`${t.result.riskScore}: ${result.score} / 100`}>
          <Text style={type.label}>{t.result.riskScore}</Text>
          <Text style={styles.scoreNum}>{result.score}<Text style={styles.scoreMax}>/100</Text></Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(result.score, 2)}%`, backgroundColor: v.color }]} />
        </View>

        <Text style={[type.label, { marginTop: 20 }]} accessibilityRole="header">
          {reasons.length ? t.result.why : result.links.length ? t.result.whatWeChecked : t.result.note}
        </Text>
        {reasons.length === 0 && (
          <Text style={styles.plain}>{result.links.length ? t.result.linkPassed : t.result.noLinks}</Text>
        )}
        {reasons.map((r, i) => (
          <View key={i} style={styles.reasonRow}>
            <View style={[styles.dot, { backgroundColor: severityColor(r.points) }]} />
            <Text style={styles.reason}>{r.reason}</Text>
          </View>
        ))}

        {steps && (
          <View style={styles.next}>
            <Text style={styles.nextTitle} accessibilityRole="header">{t.result.nextTitle}</Text>
            {steps.map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNum} maxFontSizeMultiplier={1.2} importantForAccessibility="no">{i + 1}</Text>
                <Text style={styles.reason}>{s}</Text>
              </View>
            ))}
            {result.verdict === 'danger' && (
              <Pressable
                style={({ pressed }) => [styles.report, pressed && { opacity: 0.7 }]}
                onPress={() => Linking.openURL('tel:1326')}
                accessibilityRole="button"
              >
                <Ionicons name="call-outline" size={20} color={C.text} />
                <Text style={styles.reportText}>{t.result.reportPH}</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1.5, overflow: 'hidden', backgroundColor: C.bg },
  top: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  verdict: { fontSize: T.L, fontWeight: '800', letterSpacing: -0.4 },
  hint: { fontSize: T.M, color: C.muted, marginTop: 2, lineHeight: 24 },
  body: { padding: 18, paddingTop: 16 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  scoreNum: { fontSize: T.L, fontWeight: '800', color: C.text },
  scoreMax: { fontSize: T.S, fontWeight: '600', color: C.faint },
  track: { height: 6, backgroundColor: C.surface, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  plain: { fontSize: T.M, color: C.text, lineHeight: 24, marginTop: 10 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 7, marginRight: 12 },
  reason: { flex: 1, fontSize: T.M, color: C.text, lineHeight: 24 },
  next: { marginTop: 22, paddingTop: 18, borderTopWidth: 1, borderTopColor: C.border },
  nextTitle: { fontSize: T.M, fontWeight: '800', color: C.text },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, gap: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.text, color: '#fff', fontSize: T.S, fontWeight: '700', textAlign: 'center', lineHeight: 26, overflow: 'hidden' },
  report: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18,
    minHeight: 56, borderRadius: 14, borderWidth: 1.5, borderColor: C.text, paddingHorizontal: 16,
  },
  reportText: { fontSize: T.M, fontWeight: '700', color: C.text, flexShrink: 1, textAlign: 'center' },
});
