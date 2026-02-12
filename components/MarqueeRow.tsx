import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/Text';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface BadgeItem {
  emoji: string;
  label: string;
}

interface MarqueeRowProps {
  title: string;
  items: BadgeItem[];
  speed?: number;
  reverse?: boolean;
  onBadgePress?: (label: string) => void;
}

function MarqueeRow({ title, items, speed = 20000, reverse = false, onBadgePress }: MarqueeRowProps) {
  const [contentWidth, setContentWidth] = useState(0);
  const translateX = useSharedValue(0);
  const savedOffset = useSharedValue(0);
  const widthRef = useSharedValue(0);

  const startAutoScroll = useCallback(
    (fromValue: number, w: number) => {
      'worklet';
      if (w <= 0) return;

      // Move one full width in the original direction
      // The modulo in animatedStyle handles visual wrapping
      const target = reverse ? fromValue + w : fromValue - w;

      translateX.value = withRepeat(
        withTiming(target, {
          duration: speed,
          easing: Easing.linear
        }),
        -1,
        false
      );
    },
    [reverse, speed]
  );

  const onLayout = (e: any) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0 && contentWidth === 0) {
      setContentWidth(width);
      widthRef.value = width;
      const startPos = reverse ? -width : 0;
      translateX.value = startPos;
      translateX.value = withRepeat(
        withTiming(reverse ? 0 : -width, {
          duration: speed,
          easing: Easing.linear
        }),
        -1,
        false
      );
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      cancelAnimation(translateX);
      savedOffset.value = translateX.value;
    })
    .onUpdate((e) => {
      translateX.value = savedOffset.value + e.translationX;
    })
    .onEnd(() => {
      const w = widthRef.value;
      if (w > 0) {
        startAutoScroll(translateX.value, w);
      }
    })
    .activeOffsetX([-10, 10]);

  const animatedStyle = useAnimatedStyle(() => {
    const w = widthRef.value;
    if (w <= 0) return { transform: [{ translateX: translateX.value }] };
    let x = translateX.value % w;
    if (x > 0) x -= w;
    return { transform: [{ translateX: x }] };
  });

  const renderBadge = (item: BadgeItem, prefix: string, i: number) => (
    <TouchableOpacity
      key={`${prefix}-${i}`}
      className="px-4 py-2.5 rounded-full mr-2 flex-row items-center gap-1.5 bg-white/20 border border-white/30"
      onPress={() => onBadgePress?.(item.label)}
      activeOpacity={0.7}
    >
      <Text className="text-sm">{item.emoji}</Text>
      <Text className="text-xs font-bold text-white">{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="gap-1.5">
      <Text className="text-stone-100 text-[10px] font-bold uppercase tracking-wider px-4">{title}</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{ overflow: 'hidden' }} className="mb-2">
          <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
            {['a', 'b', 'c'].map((prefix, ci) => (
              <View key={prefix} style={{ flexDirection: 'row' }} onLayout={ci === 0 ? onLayout : undefined}>
                {items.map((item, i) => renderBadge(item, prefix, i))}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const POPULAR: BadgeItem[] = [
  { emoji: '🍕', label: 'Пицца' },
  { emoji: '🍣', label: 'Суши' },
  { emoji: '🍔', label: 'Бургеры' },
  { emoji: '🌯', label: 'Шаурма' },
  { emoji: '☕', label: 'Кофе' },
  { emoji: '🍱', label: 'Роллы' },
  { emoji: '🥗', label: 'Салаты' },
  { emoji: '🍰', label: 'Десерты' }
];

const FAST_FOOD: BadgeItem[] = [
  { emoji: '🍟', label: 'Картошка фри' },
  { emoji: '🌭', label: 'Хот-доги' },
  { emoji: '🍔', label: 'Чизбургер' },
  { emoji: '🌮', label: 'Тако' },
  { emoji: '🍗', label: 'Наггетсы' },
  { emoji: '🥤', label: 'Напитки' },
  { emoji: '🍕', label: 'Пепперони' }
];

const OFTEN_ORDERED: BadgeItem[] = [
  { emoji: '🥐', label: 'Выпечка' },
  { emoji: '🍝', label: 'Паста' },
  { emoji: '🥩', label: 'Стейки' },
  { emoji: '🍜', label: 'Рамен' },
  { emoji: '🥙', label: 'Фалафель' },
  { emoji: '🍛', label: 'Карри' },
  { emoji: '🍦', label: 'Мороженое' }
];

const GROCERIES: BadgeItem[] = [
  { emoji: '🥑', label: 'Фрукты' },
  { emoji: '🥛', label: 'Молочное' },
  { emoji: '🍞', label: 'Хлеб' },
  { emoji: '🥚', label: 'Яйца' },
  { emoji: '🧀', label: 'Сыры' },
  { emoji: '🥩', label: 'Мясо' },
  { emoji: '🐟', label: 'Рыба' },
  { emoji: '🍫', label: 'Сладости' }
];

export function MarqueeBadges({ onBadgePress }: { onBadgePress?: (label: string) => void }) {
  return (
    <View className="gap-4">
      <MarqueeRow title="Популярное" items={POPULAR} speed={35000} onBadgePress={onBadgePress} />
      {/* <MarqueeRow title="Часто заказывают" items={OFTEN_ORDERED} speed={28000} reverse onBadgePress={onBadgePress} /> */}
      <MarqueeRow title="Фастфуд" items={FAST_FOOD} speed={30000} reverse onBadgePress={onBadgePress} />
      <MarqueeRow title="Продукты" items={GROCERIES} speed={26000} onBadgePress={onBadgePress} />
    </View>
  );
}
