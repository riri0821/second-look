import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { C, VERDICTS, button, type, T } from '../../components/theme';
import ResultCard from '../../components/ResultCard';
import ResultActions from '../../components/ResultActions';
import { ResultSkeleton } from '../../components/Skeleton';
import Landing from '../../components/Landing';
import { checkMessage } from '../../lib/api';
import { addHistory, getHistory } from '../../lib/storage';
import { timeAgo } from '../../lib/time';
import PageMeta from '../../components/PageMeta';
import { useLanguage } from '../../i18n';
import { useWide } from '../../lib/layout';

// One link and nothing else, like "bit.ly/3xK9" or "https://bdo-login.top".
const isJustALink = s => /^(https?:\/\/)?[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(s.trim());

// The message box starts at about 3 lines and grows with the text, up to a limit.
const INPUT_MIN = 110;
const INPUT_MAX = 280;

export default function CheckScreen() {
  const { t, lang, toggle } = useLanguage();
  const wide = useWide();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState([]);
  const [inputHeight, setInputHeight] = useState(INPUT_MIN);
  const scrollRef = useRef(null);

  useFocusEffect(useCallback(() => { getHistory().then(h => setRecent(h.slice(0, 5))); }, []));

  // The free server sleeps when idle, so the first check can be slow. Say so.
  useEffect(() => {
    if (!loading) return setSlow(false);
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  async function paste() {
    const clip = await Clipboard.getStringAsync();
    if (!clip) return;
    setText(clip);
    setResult(null);
    // A pasted link is checked right away; a longer message waits for Check it.
    if (isJustALink(clip)) check(clip);
  }

  function startOver() {
    setText('');
    setInputHeight(INPUT_MIN);
    setResult(null);
    setError('');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  async function check(input = text) {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await checkMessage(input, lang);
      setResult(data);
      await addHistory(input, data);
      setRecent((await getHistory()).slice(0, 5));
      if (!wide) setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      setError(t.check.error);
    } finally {
      setLoading(false);
    }
  }

  const canCheck = text.trim() && !loading;

  // The message box, its buttons and any status notes.
  const inputArea = (
    <>
      <TextInput
        style={[styles.input, { height: wide ? Math.max(inputHeight, 200) : inputHeight }]}
        onContentSizeChange={e => setInputHeight(Math.min(INPUT_MAX, Math.max(INPUT_MIN, e.nativeEvent.contentSize.height + 2)))}
        scrollEnabled={inputHeight >= INPUT_MAX}
        multiline
        placeholder={t.check.placeholder}
        placeholderTextColor={C.faint}
        value={text}
        onChangeText={v => { setText(v); setResult(null); }}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={t.check.inputLabel}
      />
      <View style={styles.row}>
        <Pressable style={({ pressed }) => [button.secondary, styles.half, pressed && styles.pressed]} onPress={text ? startOver : paste} accessibilityRole="button">
          <View style={styles.btnInner}>
            <Ionicons name={text ? 'close' : 'clipboard-outline'} size={20} color={C.text} />
            <Text style={button.secondaryText}>{text ? t.check.clear : t.check.paste}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [button.primary, styles.half, !canCheck && !loading && styles.disabled, pressed && styles.pressed]}
          disabled={!canCheck}
          onPress={() => check()}
          accessibilityRole="button"
        >
          <Text style={button.primaryText}>{loading ? t.check.checking : t.check.checkIt}</Text>
        </Pressable>
      </View>
      {slow && <Text style={styles.note}>{t.check.slow}</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!text && !result && (
        <Pressable onPress={() => setText(t.check.example)} hitSlop={8} style={styles.exampleLink} accessibilityRole="button">
          <Text style={styles.exampleText}>{t.check.tryExample}</Text>
        </Pressable>
      )}
    </>
  );

  const resultArea = result && (
    <>
      <ResultCard result={result} />
      <ResultActions result={result} />
      <Pressable style={({ pressed }) => [button.secondary, { marginTop: 14 }, pressed && styles.pressed]} onPress={startOver} accessibilityRole="button">
        <Text style={button.secondaryText}>{t.check.checkAnother}</Text>
      </Pressable>
    </>
  );

  const recentRows = recent.map(e => {
    const v = VERDICTS[e.result.verdict];
    return (
      <Pressable
        key={e.id}
        style={({ pressed, hovered }) => [styles.recentRow, wide && styles.recentRowWide, wide && hovered && styles.rowHover, pressed && styles.pressed]}
        onPress={() => router.push(`/result/${e.id}`)}
        accessibilityRole="button"
      >
        <View style={[styles.recentIcon, { backgroundColor: v.color }]}>
          <Ionicons name={v.icon} size={16} color="#fff" />
        </View>
        <View style={wide ? styles.recentWideMain : { flex: 1 }}>
          <Text style={[styles.recentVerdict, { color: v.color }, wide && styles.recentVerdictWide]}>{t.verdicts[e.result.verdict].label}</Text>
          <Text style={[styles.recentText, wide && styles.recentTextWide]} numberOfLines={1}>{e.text}</Text>
        </View>
        <Text style={styles.recentTime}>{timeAgo(e.at, t.time)}</Text>
      </Pressable>
    );
  });

  const meta = <PageMeta title="Check a message" description={'Paste a suspicious text, email or link and Second Look tells you in plain words whether it looks like a scam, and why.'} />;

  if (wide) {
    return (
      <View style={{ flex: 1 }}>
        {meta}
        <Landing
          scrollRef={scrollRef}
          checker={inputArea}
          result={loading ? <ResultSkeleton /> : result ? resultArea : null}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {meta}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brand} accessibilityRole="header">Second Look</Text>
            <View style={styles.headerRight}>
              <Pressable style={styles.aboutBtn} hitSlop={8} onPress={toggle} accessibilityRole="button" accessibilityLabel={`Language: ${t.languageName}. Switch to ${t.switchTo}`}>
                <Ionicons name="globe-outline" size={22} color={C.text} />
                <Text style={styles.aboutText}>{t.switchTo}</Text>
              </Pressable>
              <Link href="/about" asChild>
                <Pressable style={styles.aboutBtn} hitSlop={8} accessibilityRole="button" accessibilityLabel={t.about.title}>
                  <Ionicons name="information-circle-outline" size={22} color={C.text} />
                  <Text style={styles.aboutText}>{t.check.about}</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          <Text style={type.h1} accessibilityRole="header">{t.check.title}</Text>
          <Text style={[type.sub, styles.intro]}>{t.check.intro}</Text>
          {inputArea}
          {loading && <View style={{ marginTop: 28 }}><ResultSkeleton /></View>}
          {result && <View style={{ marginTop: 28 }}>{resultArea}</View>}

          {!result && recent.length > 0 && (
            <View style={styles.recent}>
              <View style={styles.recentHead}>
                <Text style={type.h2} accessibilityRole="header">{t.check.recent}</Text>
                <Link href="/history" style={styles.seeAll}>{t.check.seeAll}</Link>
              </View>
              {recentRows.slice(0, 3)}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { padding: 24, paddingTop: 12, paddingBottom: 40 },
  columns: { flexDirection: 'row', alignItems: 'flex-start', gap: 24 },
  column: { flex: 1, minWidth: 0 },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 48, paddingHorizontal: 24, minHeight: 320 },
  emptyTitle: { fontSize: T.M, fontWeight: '700', color: C.text, textAlign: 'center' },
  emptyText: { fontSize: T.M, color: C.muted, textAlign: 'center', lineHeight: 24, maxWidth: 380 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  brand: { fontSize: T.M, fontWeight: '800', color: C.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  aboutBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6 },
  aboutText: { fontSize: T.M, fontWeight: '600', color: C.text },
  intro: { marginTop: 8, marginBottom: 22 },
  input: {
    backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 16, fontSize: T.M, lineHeight: 26, color: C.text, textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 14 },
  half: { flex: 1 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  disabled: { opacity: 0.25 },
  pressed: { opacity: 0.7 },
  note: { ...type.sub, fontSize: T.S, textAlign: 'center', marginTop: 12 },
  error: { ...type.body, fontSize: T.M, color: VERDICTS.danger.color, marginTop: 14 },
  exampleLink: { marginTop: 20, alignSelf: 'center' },
  exampleText: { fontSize: T.M, fontWeight: '600', color: C.text, textDecorationLine: 'underline', textAlign: 'center' },
  recent: { marginTop: 40 },
  recentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  seeAll: { fontSize: T.M, fontWeight: '600', color: C.text, textDecorationLine: 'underline' },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  recentRowWide: { paddingHorizontal: 8 },
  rowHover: { backgroundColor: '#FAFAFA' },
  recentIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  recentWideMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 24 },
  recentVerdict: { fontSize: T.M, fontWeight: '700' },
  recentVerdictWide: { width: 220 },
  recentText: { fontSize: T.M, color: C.muted, marginTop: 2 },
  recentTextWide: { flex: 1, marginTop: 0 },
  recentTime: { fontSize: T.S, color: C.faint },
});
