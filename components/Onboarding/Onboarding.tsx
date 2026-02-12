import React, { useRef, useState } from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

// 🎨 ДАННЫЕ СЛАЙДОВ
const SLIDES = [
  {
    id: '1',
    title: 'Быстрая доставка',
    description: 'Доставим вашу еду в течение 30-40 минут прямо к вашей двери',
    icon: 'rocket',
    iconSet: 'feather',
    gradient: ['#FF6B6B', '#FF8E8E']
  },
  {
    id: '2',
    title: 'Огромный выбор',
    description: 'Сотни ресторанов и тысячи блюд на любой вкус',
    icon: 'fast-food',
    iconSet: 'ion',
    gradient: ['#4ECDC4', '#44A08D']
  },
  {
    id: '3',
    title: 'Надёжная оплата',
    description: 'Безопасная оплата картой или наличными при получении',
    icon: 'credit-card',
    iconSet: 'feather',
    gradient: ['#F093FB', '#F5576C']
  },
  {
    id: '4',
    title: 'Готовы начать?',
    description: 'Создайте аккаунт и получите скидку 20% на первый заказ!',
    icon: 'gift',
    iconSet: 'feather',
    gradient: ['#FA709A', '#FEE140']
  }
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  // Переход к следующему слайду
  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      onComplete();
    }
  };

  // Пропустить онбординг
  const handleSkip = () => {
    onComplete();
  };

  // Рендер одного слайда
  const renderSlide = ({ item, index }: { item: (typeof SLIDES)[0]; index: number }) => {
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Иконка */}
        <Animated.View style={styles.iconContainer} entering={FadeIn.delay(200).duration(600)}>
          <View style={styles.iconCircle}>
            <Icon set={item.iconSet as any} name={item.icon} size={80} color="#fff" />
          </View>
        </Animated.View>

        {/* Текст */}
        <Animated.View style={styles.textContainer} entering={SlideInRight.delay(400).duration(600)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  // Индикаторы (точки)
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          const dotAnimatedStyle = useAnimatedStyle(() => {
            const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];

            const width = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);

            const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);

            return {
              width,
              opacity
            };
          });

          return <Animated.View key={index} style={[styles.dot, dotAnimatedStyle]} />;
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Кнопка "Пропустить" */}
      {!isLastSlide && (
        <Animated.View style={styles.skipButton} entering={FadeIn.delay(800)}>
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Пропустить</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Слайды */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      {/* Нижняя панель */}
      <View style={styles.footer}>
        {renderDots()}

        {/* Кнопка "Далее" / "Начать" */}
        <TouchableOpacity style={styles.nextButton} onPress={goToNext} activeOpacity={0.8}>
          <LinearGradient
            colors={['#EA004B', '#C8003F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>{isLastSlide ? 'Начать' : 'Далее'}</Text>
            <Icon set="feather" name={isLastSlide ? 'check' : 'arrow-right'} size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  iconContainer: {
    marginBottom: 60
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  textContainer: {
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    gap: 12
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
