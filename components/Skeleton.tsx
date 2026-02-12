import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'pulse' | 'shimmer' | 'wave';
  colors?: string[];
  duration?: number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
  variant = 'shimmer',
  colors = ['#E0E0E0', '#F5F5F5', '#E0E0E0'],
  duration = 1500,
  className
}: SkeletonProps) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(-1);

  useEffect(() => {
    if (variant === 'pulse') {
      // 🔄 ПУЛЬСАЦИЯ
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else if (variant === 'shimmer' || variant === 'wave') {
      // ✨ SHIMMER/WAVE
      translateX.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    }
  }, [variant, duration]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value * 300 // ширина градиента
      }
    ]
  }));

  if (variant === 'pulse') {
    return (
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius,
            backgroundColor: colors[0]
          },
          pulseStyle,
          style
        ]}
        className={className}
      />
    );
  }

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors[0],
          overflow: 'hidden'
        },
        style
      ]}
      className={className}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { width: 300 }]}
        />
      </Animated.View>
    </View>
  );
}
