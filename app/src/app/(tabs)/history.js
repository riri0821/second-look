import { useCallback, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, button, type, T } from '../../components/theme';
import { RowSkeleton } from '../../components/Skeleton';
import { clearHistory, getHistory, removeHistory } from '../../lib/storage';
import { timeAgo } from '../../lib/time';
import PageMeta from '../../components/PageMeta';

// RN Alert buttons don't work on web, so fall back to the browser's confirm there.
function confirm(title, message, onYes) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onYes },
  ]);
}

const PAGE_SIZE = 10;

export default function HistoryScreen() {
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);
  const load = useCallback(() => { getHistory().then(setItems); }, []);
  useFocusEffect(load);

  const pages = items ? Math.max(1, Math.ceil(items.length / PAGE_SIZE)) : 1;
  const current = Math.min(page, pages - 1); // stay valid after deleting the last item on a page
  const shown = items ? items.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE) : [];
  function goTo(p) {
    setPage(p);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageMeta title="History" description={'Your past message checks, saved only on this phone. Look at a result again or delete it anytime.'} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={type.h1}>History</Text>
        <View style={styles.privacy}>
          <Ionicons name="lock-closed" size={16} color={C.muted} />
          <Text style={styles.privacyText}>Saved only on this phone. We never keep your messages.</Text>
        </View>

        {items === null ? (
          [0, 1, 2, 3].map(n => <RowSkeleton key={n} />)
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={40} color={C.faint} />
            <Text style={[type.body, { textAlign: 'center', marginTop: 12 }]}>Nothing here yet.</Text>
            <Text style={[type.sub, { textAlign: 'center', marginTop: 6 }]}>Messages you check will show up here so you can look at them again.</Text>
            <Pressable style={({ pressed }) => [button.primary, { marginTop: 24, alignSelf: 'stretch' }, pressed && styles.pressed]} onPress={() => router.navigate('/')}>
              <Text style={button.primaryText}>Check a message</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {shown.map(e => {
              const v = VERDICTS[e.result.verdict];
              return (
                <View key={e.id} style={styles.row}>
                  <Pressable style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]} onPress={() => router.push(`/result/${e.id}`)}>
                    <View style={[styles.icon, { backgroundColor: v.color }]}>
                      <Ionicons name={v.icon} size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.rowTop}>
                        <Text style={[styles.verdict, { color: v.color }]}>{v.label}</Text>
                        <Text style={styles.time}>{timeAgo(e.at)}</Text>
                      </View>
                      <Text style={styles.text} numberOfLines={2}>{e.text}</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    hitSlop={10}
                    style={styles.delete}
                    accessibilityLabel="Delete this check"
                    onPress={() => confirm('Delete this check?', 'It will be removed from this phone.', async () => { await removeHistory(e.id); load(); })}
                  >
                    <Ionicons name="trash-outline" size={22} color={C.muted} />
                  </Pressable>
                </View>
              );
            })}

            {pages > 1 && (
              <View style={styles.pager}>
                <Pressable
                  style={({ pressed }) => [button.secondary, styles.pageBtn, current === 0 && styles.disabled, pressed && styles.pressed]}
                  disabled={current === 0}
                  onPress={() => goTo(current - 1)}
                  accessibilityLabel="Previous page"
                >
                  <Ionicons name="chevron-back" size={20} color={C.text} />
                  <Text style={button.secondaryText}>Newer</Text>
                </Pressable>
                <Text style={styles.pageText}>Page {current + 1} of {pages}</Text>
                <Pressable
                  style={({ pressed }) => [button.secondary, styles.pageBtn, current === pages - 1 && styles.disabled, pressed && styles.pressed]}
                  disabled={current === pages - 1}
                  onPress={() => goTo(current + 1)}
                  accessibilityLabel="Next page"
                >
                  <Text style={button.secondaryText}>Older</Text>
                  <Ionicons name="chevron-forward" size={20} color={C.text} />
                </Pressable>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [button.secondary, { marginTop: 28 }, pressed && styles.pressed]}
              onPress={() => confirm('Delete all history?', 'Every saved check will be removed from this phone.', async () => { await clearHistory(); setPage(0); load(); })}
            >
              <Text style={button.secondaryText}>Delete all history</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { padding: 24, paddingTop: 52, paddingBottom: 40 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.25 },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 20 },
  pageBtn: { flexDirection: 'row', gap: 4, paddingHorizontal: 14 },
  pageText: { fontSize: T.S, color: C.muted, textAlign: 'center', flexShrink: 1 },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 8 },
  privacyText: { fontSize: T.S, color: C.muted, flex: 1 },
  empty: { alignItems: 'center', marginTop: 56 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.border },
  rowMain: { flex: 1, flexDirection: 'row', gap: 14, paddingVertical: 16 },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  verdict: { fontSize: T.M, fontWeight: '700' },
  time: { fontSize: T.S, color: C.faint },
  text: { fontSize: T.M, color: C.muted, marginTop: 3, lineHeight: 22, wordBreak: 'break-word' },
  delete: { paddingLeft: 14, paddingVertical: 16 },
});
