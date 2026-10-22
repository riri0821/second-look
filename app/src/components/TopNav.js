import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './theme';
import { useLanguage } from '../i18n';
import { PAGE_MAX } from '../lib/layout';

const ICONS = { index: 'shield-checkmark', learn: 'book', history: 'time' };

// The website navigation bar, used instead of bottom tabs on computer screens.
export default function TopNav({ state, navigation, descriptors }) {
  const { t, toggle } = useLanguage();
  return (
    <View style={styles.bar} accessibilityRole="navigation">
      <View style={styles.inner}>
        <Text style={styles.brand}>Second Look</Text>

        <View style={styles.links}>
          {state.routes.map((route, i) => {
            const active = state.index === i;
            const title = descriptors[route.key].options.title;
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={({ hovered }) => [styles.link, active && styles.linkActive, hovered && !active && styles.linkHover]}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
              >
                <Ionicons name={active ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={20} color={active ? C.text : C.muted} />
                <Text style={[styles.linkText, active && styles.linkTextActive]}>{title}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.right}>
          <Pressable onPress={toggle} style={styles.tool} accessibilityRole="button" accessibilityLabel={`Language: ${t.languageName}. Switch to ${t.switchTo}`}>
            <Ionicons name="globe-outline" size={20} color={C.text} />
            <Text style={styles.toolText}>{t.switchTo}</Text>
          </Pressable>
          <Link href="/about" asChild>
            <Pressable style={styles.tool} accessibilityRole="link">
              <Ionicons name="information-circle-outline" size={20} color={C.text} />
              <Text style={styles.toolText}>{t.check.about}</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  inner: {
    width: '100%', maxWidth: PAGE_MAX, alignSelf: 'center', height: 68, paddingHorizontal: 40,
    flexDirection: 'row', alignItems: 'center', gap: 40,
  },
  brand: { fontSize: T.M, fontWeight: '800', color: C.text },
  links: { flexDirection: 'row', gap: 6, flex: 1 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  linkHover: { backgroundColor: C.surface },
  linkActive: { backgroundColor: C.surface },
  linkText: { fontSize: T.M, fontWeight: '600', color: C.muted },
  linkTextActive: { color: C.text },
  right: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  tool: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  toolText: { fontSize: T.M, fontWeight: '600', color: C.text },
});
