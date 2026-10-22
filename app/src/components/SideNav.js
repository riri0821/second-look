import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './theme';
import { useLanguage } from '../i18n';

const ICONS = { index: 'shield-checkmark', learn: 'book', history: 'time' };

// The left sidebar used on computer screens instead of bottom tabs.
export default function SideNav({ state, navigation, descriptors }) {
  const { t, toggle } = useLanguage();
  return (
    <View style={styles.bar} accessibilityRole="navigation">
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Ionicons name="eye" size={18} color="#fff" />
        </View>
        <Text style={styles.brand}>Second Look</Text>
      </View>

      <View style={styles.links}>
        {state.routes.map((route, i) => {
          const active = state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={({ hovered }) => [styles.link, (active || hovered) && styles.linkOn]}
              accessibilityRole="link"
              accessibilityState={{ selected: active }}
            >
              <Ionicons name={active ? ICONS[route.name] : `${ICONS[route.name]}-outline`} size={20} color={active ? C.text : C.muted} />
              <Text style={[styles.linkText, active && styles.linkTextOn]}>{descriptors[route.key].options.title}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <Pressable onPress={toggle} style={({ hovered }) => [styles.link, hovered && styles.linkOn]} accessibilityRole="button" accessibilityLabel={`Language: ${t.languageName}. Switch to ${t.switchTo}`}>
          <Ionicons name="globe-outline" size={20} color={C.muted} />
          <Text style={styles.linkText}>{t.switchTo}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/about')} style={({ hovered }) => [styles.link, hovered && styles.linkOn]} accessibilityRole="link">
          <Ionicons name="information-circle-outline" size={20} color={C.muted} />
          <Text style={styles.linkText}>{t.check.about}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { width: 248, backgroundColor: C.bg, borderRightWidth: 1, borderRightColor: C.border, paddingHorizontal: 16, paddingVertical: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10, marginBottom: 32 },
  logo: { width: 32, height: 32, borderRadius: 9, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: T.M, fontWeight: '800', color: C.text },
  links: { gap: 4, flex: 1 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10 },
  linkOn: { backgroundColor: '#F1F1F2' },
  linkText: { fontSize: T.M, fontWeight: '600', color: C.muted },
  linkTextOn: { color: C.text },
  bottom: { gap: 4, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16 },
});
