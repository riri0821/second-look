import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, button, type, T } from '../components/theme';
import ChatBubble from '../components/ChatBubble';
import { quizFor } from '../data/quiz';
import { getBestStreak, setBestStreak } from '../lib/storage';
import PageMeta from '../components/PageMeta';
import { fill, useLanguage } from '../i18n';

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function QuizScreen() {
  const { t, lang } = useLanguage();
  const w = t.quiz;
  const [round, setRound] = useState(0);
  const questions = useMemo(() => shuffle(quizFor(lang)), [round, lang]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState(null); // true = said scam, false = said real
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => { getBestStreak().then(setBest); }, []);

  const finished = i >= questions.length;
  const q = questions[i];
  const answered = answer !== null;
  const correct = answered && answer === q.scam;

  function choose(saidScam) {
    if (answered) return;
    setAnswer(saidScam);
    if (saidScam === q.scam) {
      const s = streak + 1;
      setScore(score + 1);
      setStreak(s);
      if (s > best) { setBest(s); setBestStreak(s); }
    } else {
      setStreak(0);
    }
  }

  function next() {
    setAnswer(null);
    setI(i + 1);
  }

  function restart() {
    setRound(round + 1);
    setI(0);
    setScore(0);
    setStreak(0);
    setAnswer(null);
  }

  if (finished) {
    const great = score >= questions.length - 2;
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <PageMeta title="Real or scam?" description={'Real or scam? Test yourself on 12 realistic messages and learn the warning signs that give scams away.'} />
        <View style={styles.done}>
          <View style={[styles.doneIcon, { backgroundColor: great ? VERDICTS.no_red_flags.color : C.text }]}>
            <Ionicons name={great ? 'trophy' : 'school'} size={34} color="#fff" />
          </View>
          <Text style={[type.h1, { textAlign: 'center', marginTop: 20 }]}>{fill(w.outOf, { score, total: questions.length })}</Text>
          <Text style={[type.sub, { textAlign: 'center', marginTop: 10 }]}>
            {great ? w.great : w.practice}
          </Text>
          <Text style={[type.sub, { textAlign: 'center', marginTop: 6 }]}>{fill(w.bestStreak, { n: best })}</Text>
        </View>
        <View style={styles.footer}>
          <Pressable style={({ pressed }) => [button.primary, pressed && styles.pressed]} onPress={restart} accessibilityRole="button">
            <Text style={button.primaryText}>{w.playAgain}</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [button.secondary, { marginTop: 12 }, pressed && styles.pressed]} onPress={() => router.back()} accessibilityRole="button">
            <Text style={button.secondaryText}>{w.backToLessons}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const v = correct ? VERDICTS.no_red_flags : VERDICTS.danger;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <PageMeta title="Real or scam?" description={'Real or scam? Test yourself on 12 realistic messages and learn the warning signs that give scams away.'} />
      <View style={styles.topRow}>
        <Text style={styles.count}>{fill(w.messageOf, { n: i + 1, total: questions.length })}</Text>
        <View style={styles.streak}>
          <Ionicons name="flame" size={18} color={streak > 0 ? VERDICTS.suspicious.color : C.faint} />
          <Text style={styles.streakText}>{fill(w.inARow, { n: streak })}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={type.h2} accessibilityRole="header">{w.question}</Text>
        <View style={{ marginTop: 20 }}>
          <ChatBubble from={q.from} parts={q.parts} highlight={answered} />
        </View>

        {answered && (
          <View style={[styles.feedback, { borderColor: v.color, backgroundColor: v.tint }]}>
            <View style={styles.feedbackHead}>
              <Ionicons name={correct ? 'checkmark-circle' : 'close-circle'} size={26} color={v.color} />
              <Text style={[styles.feedbackTitle, { color: v.color }]}>
                {correct ? w.correct : w.notQuite} {q.scam ? w.answerScam : w.answerReal}
              </Text>
            </View>
            <Text style={[type.body, { marginTop: 8 }]}>{q.why}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {answered ? (
          <Pressable style={({ pressed }) => [button.primary, pressed && styles.pressed]} onPress={next} accessibilityRole="button">
            <Text style={button.primaryText}>{i === questions.length - 1 ? w.seeScore : w.nextMessage}</Text>
          </Pressable>
        ) : (
          <View style={styles.choices}>
            <Pressable
              style={({ pressed }) => [button.primary, styles.choice, { backgroundColor: VERDICTS.danger.color }, pressed && styles.pressed]}
              onPress={() => choose(true)}
              accessibilityRole="button"
            >
              <Text style={button.primaryText}>{w.itsScam}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [button.primary, styles.choice, { backgroundColor: VERDICTS.no_red_flags.color }, pressed && styles.pressed]}
              onPress={() => choose(false)}
              accessibilityRole="button"
            >
              <Text style={button.primaryText}>{w.itsReal}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 },
  count: { fontSize: T.M, color: C.muted },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { fontSize: T.M, fontWeight: '600', color: C.text },
  body: { padding: 24, paddingTop: 16 },
  feedback: { marginTop: 22, borderWidth: 1.5, borderRadius: 16, padding: 16 },
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  feedbackTitle: { fontSize: T.M, fontWeight: '800', flexShrink: 1 },
  footer: { padding: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  choices: { flexDirection: 'row', gap: 12 },
  choice: { flex: 1 },
  pressed: { opacity: 0.75 },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  doneIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
