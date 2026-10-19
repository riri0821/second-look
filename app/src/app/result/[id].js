import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { C, type, T } from '../../components/theme';
import ResultCard from '../../components/ResultCard';
import { Bone, ResultSkeleton } from '../../components/Skeleton';
import { getHistoryEntry } from '../../lib/storage';
import PageMeta from '../../components/PageMeta';

export default function SavedResultScreen() {
  const { id } = useLocalSearchParams();
  const [entry, setEntry] = useState(undefined);
  useEffect(() => { getHistoryEntry(id).then(setEntry); }, [id]);

  if (entry === undefined) {
    return (
      <View style={styles.container}>
        <PageMeta title="Saved check" description={'A message you checked earlier with Second Look, with the verdict and the reasons behind it.'} />
        <Bone width="50%" height={16} />
        <Bone height={80} radius={16} style={{ marginTop: 10, marginBottom: 20 }} />
        <ResultSkeleton />
      </View>
    );
  }
  if (entry === null) {
    return <Text style={[type.body, { padding: 24 }]}>This check was deleted.</Text>;
  }

  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={styles.container}>
      <PageMeta title="Saved check" description={'A message you checked earlier with Second Look, with the verdict and the reasons behind it.'} />
      <Text style={type.label}>
        Checked {new Date(entry.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
      </Text>
      <View style={styles.message}>
        <Text style={styles.messageText}>{entry.text}</Text>
      </View>
      <ResultCard result={entry.result} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 40 },
  message: { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 20 },
  messageText: { fontSize: T.M, lineHeight: 24, color: C.text, wordBreak: 'break-word' },
});
