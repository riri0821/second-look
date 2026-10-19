import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, type, T } from '../../components/theme';
import { LESSONS } from '../../data/lessons';
import { getLessonsDone } from '../../lib/storage';
import PageMeta from '../../components/PageMeta';

export default function LearnScreen() {
  const [done, setDone] = useState([]);

  useFocusEffect(useCallback(() => {
    getLessonsDone().then(setDone);
  }, []));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <PageMeta title="Spot the scam" description={'Short, plain-English lessons on spotting scam texts, fake websites and phishing links, plus a quiz to test yourself.'} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={type.h1}>Spot the scam</Text>
        <Text style={[type.sub, { marginTop: 8 }]}>
          Short lessons on how scams work, so you can recognize one on your own.
        </Text>

        <Pressable style={({ pressed }) => [styles.quiz, pressed && styles.pressed]} onPress={() => router.push('/quiz')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizTitle}>Test your knowledge</Text>
            <Text style={styles.quizSub}>
              Can you tell a real message from a scam? Try 12 examples.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </Pressable>

        <View style={styles.progressRow}>
          <Text style={type.h2}>Lessons</Text>
          <Text style={styles.progress}>{done.length} of {LESSONS.length} done</Text>
        </View>

        {LESSONS.map((l, i) => {
          const isDone = done.includes(l.id);
          return (
            <Pressable
              key={l.id}
              style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}
              onPress={() => router.push(`/lesson/${l.id}`)}
              accessibilityLabel={`Lesson ${i + 1}: ${l.title}${isDone ? ', completed' : ''}`}
            >
              <View style={[styles.lessonIcon, isDone && { backgroundColor: VERDICTS.no_red_flags.color, borderColor: VERDICTS.no_red_flags.color }]}>
                <Ionicons name={isDone ? 'checkmark' : l.icon} size={22} color={isDone ? '#fff' : C.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{l.title}</Text>
                <Text style={styles.lessonSub}>{l.summary}</Text>
                <Text style={styles.lessonMeta}>{l.minutes} min read</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={C.faint} />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { padding: 24, paddingTop: 52, paddingBottom: 40 },
  pressed: { opacity: 0.7 },
  quiz: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.text, borderRadius: 18, padding: 20, marginTop: 24 },
  quizTitle: { fontSize: T.L, fontWeight: '800', color: '#fff' },
  quizSub: { fontSize: T.M, color: '#D4D4D4', marginTop: 4, lineHeight: 22 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 36, marginBottom: 4 },
  progress: { fontSize: T.M, color: C.muted },
  lesson: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: C.border },
  lessonIcon: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  lessonTitle: { fontSize: T.M, fontWeight: '700', color: C.text },
  lessonSub: { fontSize: T.M, color: C.muted, marginTop: 3, lineHeight: 22 },
  lessonMeta: { fontSize: T.S, color: C.faint, marginTop: 6 },
});
