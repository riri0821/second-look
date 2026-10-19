import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, T, type } from './theme';

function severityColor(points) {
  if (points >= 30) return VERDICTS.danger.color;
  if (points >= 10) return VERDICTS.suspicious.color;
  return C.faint;
}

export default function ResultCard({ result }) {
  const v = VERDICTS[result.verdict];
  const reasons = [...result.messageFlags, ...result.links.flatMap(l => l.flags)].sort((a, b) => b.points - a.points);

  return (
    <View style={[styles.card, { borderColor: v.color }]}>
      <View style={[styles.top, { backgroundColor: v.tint }]}>
        <View style={[styles.badge, { backgroundColor: v.color }]}>
          <Ionicons name={v.icon} size={24} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.verdict, { color: v.color }]}>{v.label}</Text>
          <Text style={styles.hint}>{v.hint}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.scoreRow}>
          <Text style={type.label}>Risk score</Text>
          <Text style={styles.scoreNum}>{result.score}<Text style={styles.scoreMax}>/100</Text></Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(result.score, 2)}%`, backgroundColor: v.color }]} />
        </View>

        <Text style={[type.label, { marginTop: 20 }]}>
          {reasons.length ? 'Why' : result.links.length ? 'What we checked' : 'Note'}
        </Text>
        {reasons.length === 0 && (
          <Text style={styles.plain}>
            {result.links.length
              ? 'The link passed every check.'
              : 'No links found in this message. Be wary of anyone asking for money, codes or passwords.'}
          </Text>
        )}
        {reasons.map((r, i) => (
          <View key={i} style={styles.reasonRow}>
            <View style={[styles.dot, { backgroundColor: severityColor(r.points) }]} />
            <Text style={styles.reason}>{r.reason}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1.5, overflow: 'hidden', backgroundColor: C.bg },
  top: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  verdict: { fontSize: T.L, fontWeight: '800', letterSpacing: -0.4 },
  hint: { fontSize: T.M, color: C.muted, marginTop: 2, lineHeight: 22 },
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
});
