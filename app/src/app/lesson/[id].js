import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { C, button, type, T } from '../../components/theme';
import ChatBubble from '../../components/ChatBubble';
import { getLesson } from '../../data/lessons';
import { markLessonDone } from '../../lib/storage';
import PageMeta from '../../components/PageMeta';

// One card at a time with big Back / Next buttons. No sideways swiping.
export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const lesson = getLesson(id);
  const [i, setI] = useState(0);

  if (!lesson) return null;
  const card = lesson.cards[i];
  const last = i === lesson.cards.length - 1;

  async function next() {
    if (!last) return setI(i + 1);
    await markLessonDone(lesson.id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <PageMeta title={lesson.title} description={`${lesson.summary} A ${lesson.minutes}-minute lesson from Second Look on how to spot scams.`} />
      <Stack.Screen options={{ title: lesson.title }} />

      <View style={styles.progress}>
        {lesson.cards.map((_, n) => (
          <View key={n} style={[styles.seg, n <= i && styles.segOn]} />
        ))}
      </View>
      <Text style={styles.step}>{i + 1} of {lesson.cards.length}</Text>

      <ScrollView contentContainerStyle={styles.body} key={i}>
        <Text style={type.h2}>{card.title}</Text>
        {card.kind === 'text' && <Text style={[type.body, { marginTop: 14 }]}>{card.body}</Text>}
        {card.kind === 'example' && (
          <>
            <View style={{ marginTop: 20 }}>
              <ChatBubble from={card.from} parts={card.parts} />
            </View>
            <Text style={[type.body, { marginTop: 20 }]}>{card.caption}</Text>
          </>
        )}
      </ScrollView>

      <View style={styles.nav}>
        {i > 0 && (
          <Pressable style={({ pressed }) => [button.secondary, styles.navBtn, pressed && styles.pressed]} onPress={() => setI(i - 1)}>
            <Text style={button.secondaryText}>Back</Text>
          </Pressable>
        )}
        <Pressable style={({ pressed }) => [button.primary, styles.navBtn, pressed && styles.pressed]} onPress={next}>
          <Text style={button.primaryText}>{last ? 'Finish lesson' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: 24, paddingTop: 8 },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.border },
  segOn: { backgroundColor: C.text },
  step: { fontSize: T.S, color: C.muted, paddingHorizontal: 24, marginTop: 10 },
  body: { padding: 24, paddingTop: 20 },
  nav: { flexDirection: 'row', gap: 12, padding: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  navBtn: { flex: 1 },
  pressed: { opacity: 0.7 },
});
