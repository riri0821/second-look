import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './theme';
import { useLanguage } from '../i18n';

// The website's top bar on computer screens: logo on the left, page links and language on the right.
export default function SiteHeader({ state, navigation, descriptors }) {
  const { t, toggle } = useLanguage();
  return (
    <View style={styles.bar} accessibilityRole="navigation">
      <View style={styles.inner}>
        <Pressable onPress={() => navigation.navigate('index')} style={styles.brandRow} accessibilityRole="link" accessibilityLabel="Second Look">
          <View style={styles.logo}>
            <Ionicons name="eye" size={18} color="#fff" />
          </View>
          <Text style={styles.brand}>Second Look</Text>
        </Pressable>

        <View style={styles.links}>
          {state.routes.map((route, i) => {
            const active = state.index === i;
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={({ hovered }) => [styles.link, hovered && styles.linkHover]}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.linkText, active && styles.linkActive]}>{descriptors[route.key].options.title}</Text>
              </Pressable>
            );
          })}
          <Pressable onPress={() => router.push('/about')} style={({ hovered }) => [styles.link, hovered && styles.linkHover]} accessibilityRole="link">
            <Text style={styles.linkText}>{t.site.privacy}</Text>
          </Pressable>
          <Pressable
            onPress={toggle}
            style={({ hovered }) => [styles.lang, hovered && styles.linkHover]}
            accessibilityRole="button"
            accessibilityLabel={`Language: ${t.languageName}. Switch to ${t.switchTo}`}
          >
            <Ionicons name="globe-outline" size={18} color={C.text} />
            <Text style={styles.langText}>{t.switchTo}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  inner: {
    width: '100%', maxWidth: 1200, alignSelf: 'center', height: 72, paddingHorizontal: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 32, height: 32, borderRadius: 9, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: T.M, fontWeight: '800', color: C.text },
  links: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  link: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  linkHover: { backgroundColor: '#F1F1F2' },
  linkText: { fontSize: T.M, fontWeight: '600', color: C.muted },
  linkActive: { color: C.text },
  lang: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  langText: { fontSize: T.M, fontWeight: '600', color: C.text },
});
