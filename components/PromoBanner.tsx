import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

type PromoSlide = {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  icon: { set: string; name: string };
};

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: '1',
    title: 'Бесплатная доставка',
    subtitle: 'На первый заказ от 500 ₽',
    bgColor: '#EA004B',
    icon: { set: 'materialCom', name: 'truck-delivery-outline' }
  },
  {
    id: '2',
    title: 'Скидка 20%',
    subtitle: 'На все блюда по выходным',
    bgColor: '#F97316',
    icon: { set: 'materialCom', name: 'sale' }
  },
  {
    id: '3',
    title: 'Кэшбэк 10%',
    subtitle: 'Баллами за каждый заказ',
    bgColor: '#0891B2',
    icon: { set: 'materialCom', name: 'cash-multiple' }
  }
];

const AUTO_SCROLL_INTERVAL = 4000;
const HORIZONTAL_PADDING = 24;
const SLIDE_GAP = 12;
const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 20;

function AnimatedDot({
  index,
  scrollX,
  snapInterval
}: {
  index: number;
  scrollX: SharedValue<number>;
  snapInterval: number;
}) {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * snapInterval, index * snapInterval, (index + 1) * snapInterval];

    const width = interpolate(scrollX.value, inputRange, [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE], Extrapolation.CLAMP);

    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);

    return { width, opacity };
  });

  return (
    <Animated.View
      style={[
        {
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: '#EA004B',
          marginHorizontal: 3
        },
        rStyle
      ]}
    />
  );
}

export default function PromoBanner() {
  const { width: screenWidth } = useWindowDimensions();
  const SLIDE_WIDTH = screenWidth - HORIZONTAL_PADDING * 2;
  const SNAP_INTERVAL = SLIDE_WIDTH + SLIDE_GAP;
  const scrollX = useSharedValue(0);
  const activeIndexRef = useRef(0);
  const flatListRef = useRef<FlatList<PromoSlide>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    }
  });

  const startAutoScroll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % PROMO_SLIDES.length;
      activeIndexRef.current = next;
      flatListRef.current?.scrollToOffset({ offset: next * SNAP_INTERVAL, animated: true });
    }, AUTO_SCROLL_INTERVAL);
  }, [SNAP_INTERVAL]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoScroll]);

  const onScrollBeginDrag = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const onScrollEndDrag = () => {
    startAutoScroll();
  };

  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    activeIndexRef.current = Math.round(offsetX / SNAP_INTERVAL);
  };

  const renderSlide = ({ item }: { item: PromoSlide }) => (
    <Pressable
      style={{
        width: SLIDE_WIDTH,
        height: 130,
        borderRadius: 20,
        backgroundColor: item.bgColor,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderCurve: 'continuous',
        overflow: 'hidden'
      }}
    >
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text className="text-white text-xl font-bold mb-1">{item.title}</Text>
        <Text className="text-white/70 text-sm">{item.subtitle}</Text>
      </View>

      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon set={item.icon.set} name={item.icon.name} size={32} color="rgba(255,255,255,0.9)" />
      </View>
    </Pressable>
  );

  return (
    <View className="mb-2">
      <Animated.FlatList
        ref={flatListRef as any}
        data={PROMO_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING, gap: SLIDE_GAP }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />

      <View className="flex-row justify-center items-center mt-3">
        {PROMO_SLIDES.map((_, i) => (
          <AnimatedDot key={i} index={i} scrollX={scrollX} snapInterval={SNAP_INTERVAL} />
        ))}
      </View>
    </View>
  );
}