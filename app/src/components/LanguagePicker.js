import { Pressable, StyleSheet, Text, View } from 'react-native';
import { C, T } from './theme';
import { LANGUAGES, useLanguage } from '../i18n';
import { STRINGS } from '../i18n/strings';

// Two big buttons, English and Filipino. The chosen one is filled black.
export default function LanguagePicker() {
  const { lang, setLang } = useLanguage();
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {LANGUAGES.map(code => {
        const on = code === lang;
        return (
          <Pressable
            key={code}
            style={[styles.option, on && styles.on]}
            onPress={() => setLang(code)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
          >
            <Text style={[styles.text, on && styles.textOn]}>{STRINGS[code].languageName}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  option: { flex: 1, minHeight: 52, borderRadius: 12, borderWidth: 1.5, borderColor: C.text, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: C.text },
  text: { fontSize: T.M, fontWeight: '700', color: C.text },
  textOn: { color: '#fff' },
});
