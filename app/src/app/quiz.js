import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, VERDICTS, button, type, T } from '../components/theme';
import ChatBubble from '../components/ChatBubble';
import { QUIZ } from '../data/quiz';
import { getBestStreak, setBestStreak } from '../lib/storage';
import PageMeta from '../components/PageMeta';

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function QuizScreen() {
  const [round, setRound] = useState(0);
  const questions = useMemo(() => shuffle(QUIZ), [round]);
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
          <Text style={[type.h1, { textAlign: 'center', marginTop: 20 }]}>{score} out of {questions.length}</Text>
          <Text style={[type.sub, { textAlign: 'center', marginTop: 10 }]}>
            {great
              ? 'Excellent. You know what to look for.'
              : 'Good practice. The lessons cover the patterns you missed.'}
          </Text>
          <Text style={[type.sub, { textAlign: 'center', marginTop: 6 }]}>Best streak: {best} in a row</Text>
        </View>
        <View style={styles.footer}>
          <Pressable style={({ pressed }) => [button.primary, pressed && styles.pressed]} onPress={restart}>
            <Text style={button.primaryText}>Play again</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [button.secondary, { marginTop: 12 }, pressed && styles.pressed]} onPress={() => router.back()}>
            <Text style={button.secondaryText}>Back to lessons</Text>
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
        <Text style={styles.count}>Message {i + 1} of {questions.length}</Text>
        <View style={styles.streak}>
          <Ionicons name="flame" size={18} color={streak > 0 ? VERDICTS.suspicious.color : C.faint} />
          <Text style={styles.streakText}>{streak} in a row</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={type.h2}>Is this message real, or a scam?</Text>
        <View style={{ marginTop: 20 }}>
          <ChatBubble from={q.from} parts={q.parts} highlight={answered} />
        </View>

        {answered && (
          <View style={[styles.feedback, { borderColor: v.color, backgroundColor: v.tint }]}>
            <View style={styles.feedbackHead}>
              <Ionicons name={correct ? 'checkmark-circle' : 'close-circle'} size={26} color={v.color} />
              <Text style={[styles.feedbackTitle, { color: v.color }]}>
                {correct ? 'Correct.' : 'Not quite.'} It's {q.scam ? 'a scam' : 'real'}.
              </Text>
            </View>
            <Text style={[type.body, { marginTop: 8 }]}>{q.why}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {answered ? (
          <Pressable style={({ pressed }) => [button.primary, pressed && styles.pressed]} onPress={next}>
            <Text style={button.primaryText}>{i === questions.length - 1 ? 'See my score' : 'Next message'}</Text>
          </Pressable>
        ) : (
          <View style={styles.choices}>
            <Pressable
              style={({ pressed }) => [button.primary, styles.choice, { backgroundColor: VERDICTS.danger.color }, pressed && styles.pressed]}
              onPress={() => choose(true)}
            >
              <Text style={button.primaryText}>It's a scam</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [button.primary, styles.choice, { backgroundColor: VERDICTS.no_red_flags.color }, pressed && styles.pressed]}
              onPress={() => choose(false)}
            >
              <Text style={button.primaryText}>It's real</Text>
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
