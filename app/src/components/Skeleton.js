import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { C } from './theme';

// A gray placeholder block that gently pulses while content loads.
export function Bone({ width = '100%', height = 16, radius = 6, style }) {
  const pulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: C.border, opacity: pulse }, style]} />;
}

// Same shape as ResultCard, shown while a message is being checked.
export function ResultSkeleton() {
  return (
    <View style={styles.card} accessibilityLabel="Checking your message">
      <View style={styles.top}>
        <Bone width={44} height={44} radius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <Bone width="55%" height={24} />
          <Bone width="80%" height={14} />
        </View>
      </View>
      <View style={styles.body}>
        <Bone height={8} radius={4} />
        <Bone width="35%" height={16} style={{ marginTop: 24 }} />
        <Bone height={16} style={{ marginTop: 14 }} />
        <Bone width="90%" height={16} style={{ marginTop: 10 }} />
        <Bone width="70%" height={16} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

// A list row placeholder for History and Recent.
export function RowSkeleton() {
  return (
    <View style={styles.row}>
      <Bone width={36} height={36} radius={18} />
      <View style={{ flex: 1, gap: 8 }}>
        <Bone width="40%" height={16} />
        <Bone width="85%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1.5, borderColor: C.border, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, backgroundColor: C.surface },
  body: { padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
});
