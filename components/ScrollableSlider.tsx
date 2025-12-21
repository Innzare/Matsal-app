import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useDerivedValue,
  withTiming,
  withRepeat,
  scrollTo,
  Easing
} from 'react-native-reanimated';

const BADGES = ['React', 'TypeScript', 'Reanimated', 'Expo', 'Mapbox', 'Zustand', 'UI', 'Mobile'];

export function AutoScrollBadges() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1000, {
        duration: 30000,
        easing: Easing.linear
      }),
      -1,
      false
    );
  }, []);

  // 🔥 ВАЖНО: scrollTo В WORKLET
  useDerivedValue(() => {
    scrollTo(scrollRef, x.value, 0, false);
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {BADGES.concat(BADGES).map((item, i) => (
        <Text key={i} style={styles.badge}>
          {item}
        </Text>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#222',
    color: '#fff',
    marginRight: 12,
    fontSize: 14
  }
});
