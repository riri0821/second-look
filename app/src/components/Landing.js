import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './theme';
import { useLanguage } from '../i18n';
import { lessonsFor } from '../data/lessons';
import SiteFooter from './SiteFooter';

const MAX = 1200;

// The website home page on computer screens. The checker sits in the top section,
// so people can use it right away; the sections below explain what Second Look is.
export default function Landing({ checker, result, scrollRef }) {
  const { t, lang } = useLanguage();
  const s = t.site;
  const lessons = lessonsFor(lang).slice(0, 3);

  return (
    <ScrollView ref={scrollRef} style={styles.page} keyboardShouldPersistTaps="handled">
      {/* Hero with the checker */}
      <View style={styles.heroBand}>
        <View style={[styles.wrap, styles.hero]}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle} accessibilityRole="header">{s.heroTitle}</Text>
            <Text style={styles.heroSub}>{s.heroSub}</Text>
            <View style={styles.badges}>
              {s.badges.map(b => (
                <View key={b} style={styles.badge}>
                  <Ionicons name="checkmark" size={16} color={C.text} />
                  <Text style={styles.badgeText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.checker}>{checker}</View>
        </View>
        {result && <View style={[styles.wrap, styles.result]}>{result}</View>}
      </View>

      {/* How it works */}
      <View style={[styles.wrap, styles.section]}>
        <Text style={styles.sectionTitle} accessibilityRole="header">{s.howTitle}</Text>
        <View style={styles.steps}>
          {s.steps.map(step => (
            <View key={step.title} style={styles.step}>
              <View style={styles.stepIcon}>
                <Ionicons name={step.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.body}>{step.body}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lessons */}
      <View style={styles.greyBand}>
        <View style={[styles.wrap, styles.section]}>
          <View style={styles.sectionHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle} accessibilityRole="header">{s.learnTitle}</Text>
              <Text style={[styles.body, { marginTop: 8 }]}>{s.learnSub}</Text>
            </View>
            <Pressable onPress={() => router.navigate('/learn')} style={({ hovered }) => [styles.outlineBtn, hovered && styles.hover]} accessibilityRole="link">
              <Text style={styles.outlineText}>{s.allLessons}</Text>
              <Ionicons name="arrow-forward" size={18} color={C.text} />
            </Pressable>
          </View>
          <View style={styles.tiles}>
            {lessons.map(l => (
              <Pressable key={l.id} onPress={() => router.push(`/lesson/${l.id}`)} style={({ hovered }) => [styles.tile, hovered && styles.tileHover]} accessibilityRole="link">
                <View style={styles.tileIcon}>
                  <Ionicons name={l.icon} size={22} color={C.text} />
                </View>
                <Text style={styles.stepTitle}>{l.title}</Text>
                <Text style={styles.body}>{l.summary}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Privacy promise */}
      <View style={styles.darkBand}>
        <View style={[styles.wrap, styles.privacy]}>
          <Ionicons name="lock-closed" size={32} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: '#fff' }]} accessibilityRole="header">{s.privacyTitle}</Text>
            <Text style={[styles.body, { color: '#D4D4D4', marginTop: 8 }]}>{s.privacyBody}</Text>
          </View>
          <Pressable onPress={() => router.push('/about')} style={({ hovered }) => [styles.lightBtn, hovered && { opacity: 0.85 }]} accessibilityRole="link">
            <Text style={styles.lightBtnText}>{s.readPolicy}</Text>
          </Pressable>
        </View>
      </View>

      <SiteFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },
  wrap: { width: '100%', maxWidth: MAX, alignSelf: 'center', paddingHorizontal: 48 },

  heroBand: { paddingTop: 72, paddingBottom: 72, borderBottomWidth: 1, borderBottomColor: C.border },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 64 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: T.L, lineHeight: 36, fontWeight: '800', color: C.text, letterSpacing: -0.6 },
  heroSub: { fontSize: T.M, lineHeight: 28, color: C.muted, marginTop: 18, maxWidth: 520 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: C.border },
  badgeText: { fontSize: T.S, fontWeight: '600', color: C.text },
  checker: { flex: 1, backgroundColor: C.bg, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 28,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } },
  result: { marginTop: 40, maxWidth: 820 },

  section: { paddingTop: 88, paddingBottom: 88 },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', gap: 24, marginBottom: 32 },
  sectionTitle: { fontSize: T.L, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  body: { fontSize: T.M, lineHeight: 27, color: C.muted },

  steps: { flexDirection: 'row', gap: 32, marginTop: 36 },
  step: { flex: 1 },
  stepIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontSize: T.M, fontWeight: '800', color: C.text, marginTop: 20, marginBottom: 6 },

  greyBand: { backgroundColor: '#F6F6F7' },
  tiles: { flexDirection: 'row', gap: 20 },
  tile: { flex: 1, backgroundColor: C.bg, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 28, gap: 6 },
  tileHover: { borderColor: C.text },
  tileIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.text, backgroundColor: C.bg },
  outlineText: { fontSize: T.M, fontWeight: '700', color: C.text },
  hover: { backgroundColor: '#F1F1F2' },

  darkBand: { backgroundColor: C.text },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 28, paddingTop: 64, paddingBottom: 64 },
  lightBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, backgroundColor: '#fff' },
  lightBtnText: { fontSize: T.M, fontWeight: '700', color: C.text },

});
