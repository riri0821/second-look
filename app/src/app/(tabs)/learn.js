import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, type, T } from '../../components/theme';
import { lessonsFor } from '../../data/lessons';
import { getLessonsDone } from '../../lib/storage';
import PageMeta from '../../components/PageMeta';
import { DesktopPage } from '../../components/Desktop';
import { fill, useLanguage } from '../../i18n';
import { PAGE_MAX, useWide } from '../../lib/layout';

export default function LearnScreen() {
  const { t, lang } = useLanguage();
  const wide = useWide();
  const lessons = lessonsFor(lang);
  const [done, setDone] = useState([]);

  useFocusEffect(useCallback(() => {
    getLessonsDone().then(setDone);
  }, []));

  if (wide) {
    return (
      <View style={{ flex: 1 }}>
        <PageMeta title="Spot the scam" description={'Short, plain-English lessons on spotting scam texts, fake websites and phishing links, plus a quiz to test yourself.'} />
        <DesktopPage title={t.learn.title} intro={t.learn.intro}>
          <Pressable
            style={({ hovered }) => [styles.quizWide, hovered && styles.cardHover]}
            onPress={() => router.push('/quiz')}
            accessibilityRole="button"
            accessibilityLabel={`${t.learn.quizTitle} ${t.learn.quizSub}`}
          >
            <View style={styles.quizIcon}>
              <Ionicons name="help-circle-outline" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quizTitle}>{t.learn.quizTitle}</Text>
              <Text style={styles.quizSub}>{t.learn.quizSub}</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={C.text} />
          </Pressable>

          <View style={{ marginTop: 40 }}>
            <View style={styles.lessonsHead}>
              <Text style={styles.lessonsTitle} accessibilityRole="header">{t.learn.lessons}</Text>
              <Text style={styles.progress}>{fill(t.learn.done, { done: done.length, total: lessons.length })}</Text>
            </View>
            <View style={styles.grid}>
              {lessons.map((l, i) => {
                const isDone = done.includes(l.id);
                return (
                  <Pressable
                    key={l.id}
                    style={({ hovered }) => [styles.tile, hovered && styles.cardHover]}
                    onPress={() => router.push(`/lesson/${l.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`${i + 1}. ${l.title}${isDone ? `, ${t.learn.completed}` : ''}`}
                  >
                    <View style={styles.tileTop}>
                      <View style={[styles.lessonIcon, isDone && { backgroundColor: VERDICTS.no_red_flags.color, borderColor: VERDICTS.no_red_flags.color }]}>
                        <Ionicons name={isDone ? 'checkmark' : l.icon} size={22} color={isDone ? '#fff' : C.text} />
                      </View>
                      <Text style={styles.lessonMeta}>{fill(t.learn.minRead, { n: l.minutes })}</Text>
                    </View>
                    <Text style={[styles.lessonTitle, { marginTop: 16 }]}>{l.title}</Text>
                    <Text style={styles.lessonSub}>{l.summary}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </DesktopPage>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageMeta title="Spot the scam" description={'Short, plain-English lessons on spotting scam texts, fake websites and phishing links, plus a quiz to test yourself.'} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.h1} accessibilityRole="header">{t.learn.title}</Text>
        <Text style={[type.sub, { marginTop: 8 }]}>{t.learn.intro}</Text>

        <Pressable
          style={({ pressed }) => [styles.quiz, pressed && styles.pressed]}
          onPress={() => router.push('/quiz')}
          accessibilityRole="button"
          accessibilityLabel={`${t.learn.quizTitle} ${t.learn.quizSub}`}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.quizTitle}>{t.learn.quizTitle}</Text>
            <Text style={styles.quizSub}>{t.learn.quizSub}</Text>
          </View>
          <Ionicons name="arrow-forward" size={26} color={C.text} />
        </Pressable>

        <View style={styles.progressRow}>
          <Text style={type.h2} accessibilityRole="header">{t.learn.lessons}</Text>
          <Text style={styles.progress}>{fill(t.learn.done, { done: done.length, total: lessons.length })}</Text>
        </View>

        <View>
        {lessons.map((l, i) => {
          const isDone = done.includes(l.id);
          return (
            <Pressable
              key={l.id}
              style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}
              onPress={() => router.push(`/lesson/${l.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${i + 1}. ${l.title}${isDone ? `, ${t.learn.completed}` : ''}`}
            >
              <View style={[styles.lessonIcon, isDone && { backgroundColor: VERDICTS.no_red_flags.color, borderColor: VERDICTS.no_red_flags.color }]}>
                <Ionicons name={isDone ? 'checkmark' : l.icon} size={22} color={isDone ? '#fff' : C.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{l.title}</Text>
                <Text style={styles.lessonSub}>{l.summary}</Text>
                <Text style={styles.lessonMeta}>{fill(t.learn.minRead, { n: l.minutes })}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={C.faint} />
            </Pressable>
          );
        })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { padding: 24, paddingTop: 52, paddingBottom: 40 },
  lessonsHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
  lessonsTitle: { fontSize: T.M, fontWeight: '800', color: C.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  tile: { width: '31.8%', flexGrow: 1, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 20 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHover: { borderColor: C.text },
  quizWide: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: C.bg, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 24 },
  quizIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.7 },
  // Light, see-through gray card with a thin dark border.
  quiz: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 24, padding: 20,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#3A3A3A', backgroundColor: 'rgba(10, 10, 10, 0.04)',
  },
  quizTitle: { fontSize: T.M, fontWeight: '800', color: C.text },
  quizSub: { fontSize: T.M, color: C.text, marginTop: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 36, marginBottom: 4 },
  progress: { fontSize: T.M, color: C.muted },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: C.border },
  lessonIcon: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  lessonTitle: { fontSize: T.M, fontWeight: '700', color: C.text },
  lessonSub: { fontSize: T.M, color: C.muted, marginTop: 3, lineHeight: 22 },
  lessonMeta: { fontSize: T.S, color: C.faint, marginTop: 6 },
});
