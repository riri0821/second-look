import { StyleSheet, Text, View } from 'react-native';
import { C, FLAG, T } from './theme';

// Renders a message as an incoming chat bubble. `parts` mixes plain strings with
// { text, flag } pieces, where flag is 'danger' | 'warn' | 'safe' and gets highlighted.
export default function ChatBubble({ from, parts, highlight = true }) {
  return (
    <View>
      {from ? <Text style={styles.from}>{from}</Text> : null}
      <View style={styles.bubble}>
        <Text style={styles.text}>
          {parts.map((p, i) => {
            if (typeof p === 'string') return p;
            const f = FLAG[p.flag];
            return (
              <Text
                key={i}
                style={highlight && f ? [styles.flag, { backgroundColor: f.tint, color: f.color }] : null}
              >
                {p.text}
              </Text>
            );
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  from: { fontSize: T.S, color: C.muted, marginBottom: 6, marginLeft: 4 },
  bubble: {
    backgroundColor: C.surface, borderRadius: 20, borderBottomLeftRadius: 6,
    paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'flex-start', maxWidth: '100%',
  },
  text: { fontSize: T.M, color: C.text, lineHeight: 26, wordBreak: 'break-word', overflowWrap: 'anywhere' },
  flag: { fontWeight: '700' },
});
