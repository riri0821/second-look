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
import { Card, DesktopPage } from '../../components/Desktop';
import { fill, useLanguage } from '../../i18n';
import { useWide } from '../../lib/layout';

// RN Alert buttons don't work on web, so fall back to the browser's confirm there.
function confirm(title, message, words, onYes) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: words.cancel, style: 'cancel' },
    { text: words.delete, style: 'destructive', onPress: onYes },
  ]);
}

const PAGE_SIZE = 10;

export default function HistoryScreen() {
  const { t } = useLanguage();
  const wide = useWide();
  const h = t.history;
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

  if (wide) {
    const pager = pages > 1 && (
      <View style={styles.pagerWide}>
        <Text style={styles.pageText}>{fill(h.pageOf, { n: current + 1, total: pages })}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[[current - 1, current === 0, 'chevron-back', h.newer], [current + 1, current === pages - 1, 'chevron-forward', h.older]].map(([to, off, icon, label]) => (
            <Pressable key={label} disabled={off} onPress={() => goTo(to)} style={({ hovered }) => [styles.pageBtnWide, off && styles.disabled, hovered && !off && styles.rowHover]} accessibilityRole="button" accessibilityLabel={label}>
              {icon === 'chevron-back' && <Ionicons name={icon} size={18} color={C.text} />}
              <Text style={styles.pageBtnText}>{label}</Text>
              {icon === 'chevron-forward' && <Ionicons name={icon} size={18} color={C.text} />}
            </Pressable>
          ))}
        </View>
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        <PageMeta title="History" description={'Your past message checks, saved only on this phone. Look at a result again or delete it anytime.'} />
        <DesktopPage
          scrollRef={scrollRef}
          title={h.title}
          intro={h.privacy}
          actions={items?.length ? (
            <Pressable
              style={({ hovered }) => [styles.clearWide, hovered && styles.rowHover]}
              onPress={() => confirm(h.deleteAllTitle, h.deleteAllBody, h, async () => { await clearHistory(); setPage(0); load(); })}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={18} color={C.text} />
              <Text style={styles.pageBtnText}>{h.deleteAll}</Text>
            </Pressable>
          ) : null}
        >
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {items === null ? (
              <View style={{ padding: 24 }}>{[0, 1, 2, 3].map(n => <RowSkeleton key={n} />)}</View>
            ) : items.length === 0 ? (
              <View style={styles.emptyWide}>
                <Ionicons name="time-outline" size={40} color={C.faint} />
                <Text style={[type.body, { textAlign: 'center' }]}>{h.empty}</Text>
                <Text style={[type.sub, { textAlign: 'center' }]}>{h.emptySub}</Text>
                <Pressable style={({ pressed }) => [button.primary, { marginTop: 12, paddingHorizontal: 28 }, pressed && styles.pressed]} onPress={() => router.navigate('/')} accessibilityRole="button">
                  <Text style={button.primaryText}>{h.checkAMessage}</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={[styles.tr, styles.th]}>
                  <Text style={[styles.thText, styles.colResult]}>{h.colResult}</Text>
                  <Text style={[styles.thText, styles.colMessage]}>{h.colMessage}</Text>
                  <Text style={[styles.thText, styles.colTime]}>{h.colChecked}</Text>
                  <View style={styles.colAction} />
                </View>
                {shown.map(e => {
                  const v = VERDICTS[e.result.verdict];
                  return (
                    <View key={e.id} style={[styles.tr, { paddingVertical: 0, paddingRight: 24 }]}>
                    <Pressable onPress={() => router.push(`/result/${e.id}`)} style={({ hovered }) => [styles.trMain, hovered && styles.rowHover]} accessibilityRole="button">
                      <View style={[styles.colResult, styles.resultCell]}>
                        <View style={[styles.icon, { backgroundColor: v.color, marginTop: 0, width: 28, height: 28 }]}>
                          <Ionicons name={v.icon} size={15} color="#fff" />
                        </View>
                        <Text style={[styles.verdict, { color: v.color }]} numberOfLines={1}>{t.verdicts[e.result.verdict].label}</Text>
                      </View>
                      <Text style={[styles.cellText, styles.colMessage]} numberOfLines={1}>{e.text}</Text>
                      <Text style={[styles.time, styles.colTime]}>{timeAgo(e.at, t.time)}</Text>
                    </Pressable>
                      <Pressable
                        hitSlop={8}
                        style={({ hovered }) => [styles.colAction, styles.trash, hovered && { backgroundColor: C.border }]}
                        accessibilityRole="button"
                        accessibilityLabel={h.deleteLabel}
                        onPress={() => confirm(h.deleteOne, h.deleteOneBody, h, async () => { await removeHistory(e.id); load(); })}
                      >
                        <Ionicons name="trash-outline" size={18} color={C.muted} />
                      </Pressable>
                    </View>
                  );
                })}
              </>
            )}
          </Card>
          {pager}
        </DesktopPage>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageMeta title="History" description={'Your past message checks, saved only on this phone. Look at a result again or delete it anytime.'} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={type.h1} accessibilityRole="header">{h.title}</Text>
        <View style={styles.privacy}>
          <Ionicons name="lock-closed" size={16} color={C.muted} />
          <Text style={styles.privacyText}>{h.privacy}</Text>
        </View>

        {items === null ? (
          [0, 1, 2, 3].map(n => <RowSkeleton key={n} />)
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={40} color={C.faint} />
            <Text style={[type.body, { textAlign: 'center', marginTop: 12 }]}>{h.empty}</Text>
            <Text style={[type.sub, { textAlign: 'center', marginTop: 6 }]}>{h.emptySub}</Text>
            <Pressable style={({ pressed }) => [button.primary, { marginTop: 24, alignSelf: 'stretch' }, pressed && styles.pressed]} onPress={() => router.navigate('/')} accessibilityRole="button">
              <Text style={button.primaryText}>{h.checkAMessage}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {shown.map(e => {
              const v = VERDICTS[e.result.verdict];
              return (
                <View key={e.id} style={styles.row}>
                  <Pressable style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]} onPress={() => router.push(`/result/${e.id}`)} accessibilityRole="button">
                    <View style={[styles.icon, { backgroundColor: v.color }]}>
                      <Ionicons name={v.icon} size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.rowTop}>
                        <Text style={[styles.verdict, { color: v.color }]}>{t.verdicts[e.result.verdict].label}</Text>
                        <Text style={styles.time}>{timeAgo(e.at, t.time)}</Text>
                      </View>
                      <Text style={styles.text} numberOfLines={2}>{e.text}</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    hitSlop={10}
                    style={styles.delete}
                    accessibilityRole="button"
                    accessibilityLabel={h.deleteLabel}
                    onPress={() => confirm(h.deleteOne, h.deleteOneBody, h, async () => { await removeHistory(e.id); load(); })}
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
                  accessibilityRole="button"
                  accessibilityLabel={h.newer}
                >
                  <Ionicons name="chevron-back" size={20} color={C.text} />
                  <Text style={button.secondaryText}>{h.newer}</Text>
                </Pressable>
                <Text style={styles.pageText}>{fill(h.pageOf, { n: current + 1, total: pages })}</Text>
                <Pressable
                  style={({ pressed }) => [button.secondary, styles.pageBtn, current === pages - 1 && styles.disabled, pressed && styles.pressed]}
                  disabled={current === pages - 1}
                  onPress={() => goTo(current + 1)}
                  accessibilityRole="button"
                  accessibilityLabel={h.older}
                >
                  <Text style={button.secondaryText}>{h.older}</Text>
                  <Ionicons name="chevron-forward" size={20} color={C.text} />
                </Pressable>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [button.secondary, { marginTop: 28 }, pressed && styles.pressed]}
              accessibilityRole="button"
              onPress={() => confirm(h.deleteAllTitle, h.deleteAllBody, h, async () => { await clearHistory(); setPage(0); load(); })}
            >
              <Text style={button.secondaryText}>{h.deleteAll}</Text>
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
  tr: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  trMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 20, paddingLeft: 24, marginLeft: -24, paddingVertical: 16 },
  th: { backgroundColor: '#FAFAFA', paddingVertical: 12 },
  thText: { fontSize: T.S, fontWeight: '700', color: C.muted },
  colResult: { width: 230 },
  resultCell: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  colMessage: { flex: 1, minWidth: 0 },
  colTime: { width: 130, textAlign: 'right' },
  colAction: { width: 36, alignItems: 'center' },
  trash: { padding: 8, borderRadius: 8 },
  cellText: { fontSize: T.M, color: C.text },
  rowHover: { backgroundColor: '#FAFAFA' },
  emptyWide: { alignItems: 'center', gap: 8, paddingVertical: 64, paddingHorizontal: 24 },
  pagerWide: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  pageBtnWide: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg },
  pageBtnText: { fontSize: T.M, fontWeight: '600', color: C.text },
  clearWide: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg },
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
