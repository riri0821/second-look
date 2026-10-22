import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, T } from './theme';
import { useLanguage } from '../i18n';

// The footer at the bottom of every website page.
export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <View style={styles.band}>
      <View style={styles.wrap}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="eye" size={14} color="#fff" />
          </View>
          <Text style={styles.name}>Second Look</Text>
        </View>
        <Text style={styles.text}>{t.site.footer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border },
  wrap: {
    width: '100%', maxWidth: 1200, alignSelf: 'center', paddingHorizontal: 48, paddingTop: 36, paddingBottom: 48,
    flexDirection: 'row', alignItems: 'flex-start', gap: 48,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 24, height: 24, borderRadius: 7, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: T.M, fontWeight: '800', color: C.text },
  text: { flex: 1, fontSize: T.S, lineHeight: 22, color: C.muted },
});
