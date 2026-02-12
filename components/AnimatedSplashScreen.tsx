import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { Text } from './Text';
import { Image } from 'expo-image';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(15);
  const taglineOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  // Три точки загрузки
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    // 1. Логотип плавно появляется и пружинит (0-700ms)
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // 2. Название появляется снизу (500ms)
    textOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    textTranslateY.value = withDelay(500, withSpring(0, { damping: 14 }));

    // 3. Подпись (800ms)
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));

    // 4. Анимация точек загрузки (1000ms+)
    const dotAnimation = (delay: number) =>
      withDelay(
        1000,
        withRepeat(
          withSequence(
            withDelay(delay, withTiming(1, { duration: 400 })),
            withTiming(0.3, { duration: 400 })
          ),
          -1
        )
      );

    dot1Opacity.value = dotAnimation(0);
    dot2Opacity.value = dotAnimation(150);
    dot3Opacity.value = dotAnimation(300);

    // 5. Экран исчезает (2200ms)
    screenOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }]
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value
  }));

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1Opacity.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2Opacity.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3Opacity.value }));

  return (
    <Animated.View className="flex-1 bg-white items-center justify-center" style={screenStyle}>
      {/* Логотип */}
      <Animated.View style={logoStyle}>
        <Image
          style={{ height: 80, width: 130 }}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={require('@/assets/images/matsal-logo.svg')}
        />
      </Animated.View>

      {/* Название */}
      <Animated.View className="items-center mt-3" style={textStyle}>
        <Text className="text-4xl font-bold text-black">Matsal</Text>
      </Animated.View>

      {/* Подпись */}
      <Animated.View style={taglineStyle}>
        <Text className="text-base text-stone-400 font-semibold mt-1">Доставка еды</Text>
      </Animated.View>

      {/* Точки загрузки */}
      <View className="absolute bottom-20 flex-row gap-2">
        <Animated.View className="w-2 h-2 rounded-full" style={[{ backgroundColor: '#EA004B' }, dot1Style]} />
        <Animated.View className="w-2 h-2 rounded-full" style={[{ backgroundColor: '#EA004B' }, dot2Style]} />
        <Animated.View className="w-2 h-2 rounded-full" style={[{ backgroundColor: '#EA004B' }, dot3Style]} />
      </View>
    </Animated.View>
  );
}