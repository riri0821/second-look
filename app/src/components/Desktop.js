import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, T } from './theme';
import SiteFooter from './SiteFooter';

// Website pages other than the homepage (Learn, History), styled to match it:
// a white header section, a light gray content band with white cards, and the shared footer.
export const CANVAS = '#F6F6F7';
const PAGE_MAX = 1200;

export function DesktopPage({ title, intro, actions, children, scrollRef }) {
  return (
    <ScrollView ref={scrollRef} style={styles.page} contentContainerStyle={styles.fill} keyboardShouldPersistTaps="handled">
      <View style={styles.headerBand}>
        <View style={[styles.wrap, styles.header]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} accessibilityRole="header">{title}</Text>
            {intro ? <Text style={styles.intro}>{intro}</Text> : null}
          </View>
          {actions}
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.wrap}>{children}</View>
      </View>
      <SiteFooter />
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
  page: { flex: 1, backgroundColor: C.bg },
  fill: { flexGrow: 1 },
  wrap: { width: '100%', maxWidth: PAGE_MAX, alignSelf: 'center', paddingHorizontal: 48 },
  headerBand: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: 24, paddingTop: 64, paddingBottom: 48 },
  title: { fontSize: T.L, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  intro: { fontSize: T.M, color: C.muted, marginTop: 10, lineHeight: 27, maxWidth: 720 },
  body: { flexGrow: 1, backgroundColor: CANVAS, paddingTop: 48, paddingBottom: 72 },
  card: { backgroundColor: C.bg, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 28 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: T.M, fontWeight: '800', color: C.text },
});
