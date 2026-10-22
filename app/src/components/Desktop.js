import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, T } from './theme';

// Building blocks for the desktop web layout: a light gray page with white cards.
export const CANVAS = '#F6F6F7';
const PAGE_MAX = 1200;

export function DesktopPage({ title, intro, actions, children, scrollRef }) {
  return (
    <ScrollView ref={scrollRef} style={styles.canvas} contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} accessibilityRole="header">{title}</Text>
          {intro ? <Text style={styles.intro}>{intro}</Text> : null}
        </View>
        {actions}
      </View>
      {children}
    </ScrollView>
  );
}

export function Card({ title, right, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {(title || right) && (
        <View style={styles.cardHead}>
          {title ? <Text style={styles.cardTitle} accessibilityRole="header">{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: CANVAS },
  page: { width: '100%', maxWidth: PAGE_MAX, alignSelf: 'center', paddingHorizontal: 48, paddingTop: 40, paddingBottom: 64 },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: 24, marginBottom: 28 },
  title: { fontSize: T.L, fontWeight: '800', color: C.text, letterSpacing: -0.6 },
  intro: { fontSize: T.M, color: C.muted, marginTop: 6, lineHeight: 26, maxWidth: 720 },
  card: { backgroundColor: C.bg, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 28 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: T.M, fontWeight: '800', color: C.text },
});
