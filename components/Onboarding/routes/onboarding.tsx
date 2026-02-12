// import { ChevronDown, Mail, UserRound } from "lucide-react-native";
import { useCallback, useRef, useState } from 'react';
import { Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingSlide } from '../components/lib/types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Carousel from '../components/carousel';
import { scheduleOnRN } from 'react-native-worklets';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';

// superlist-onboarding-flow-animation 🔽

export const SLIDES: OnboardingSlide[] = [
  {
    bgColor: '#F97316',
    duration: 3000,
    title: 'Найдите ваше любимое заведение рядом с вами',
    icon: { set: 'materialCom', name: 'map-search-outline' }
  },
  {
    bgColor: '#0891B2',
    duration: 3000,
    title: 'Выберите любимые блюда из множества вариантов',
    icon: { set: 'materialCom', name: 'food-variant' }
  },
  {
    bgColor: '#EA004B',
    duration: 3000,
    title: 'Сделайте заказ и наслаждайтесь быстрой доставкой',
    icon: { set: 'materialCom', name: 'moped-outline' }
  }
];

// Distance in pixels to translate carousel upward when fully expanded
// Reveals sign-in buttons below carousel
const TOP_CAROUSEL_OFFSET = 180;
// Minimum swipe distance (in pixels) to trigger expand/collapse transition
// Prevents accidental toggles from small finger movements
const SWIPE_UP_THRESHOLD = 20;

interface IProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: IProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const insets = useSafeAreaInsets();
  const { openGlobalModal } = useGlobalModalStore();
  const { width: screenWidth } = useWindowDimensions();

  const horizontalListRef = useRef<FlatList<OnboardingSlide>>(null);

  // Continuous slide index (0.0, 0.5, 1.0, 1.5...) derived from scrollOffsetX / screenWidth
  // Enables smooth pagination width interpolation between discrete slide indices
  const animatedSlideIndex = useSharedValue(0);
  // Horizontal scroll offset in pixels, drives slide card animations (rotate/translateY)
  // Updated via scrollHandler on every scroll event (throttled to 16ms)
  const scrollOffsetX = useSharedValue(0);
  // Prevents auto-advance and progress animations during user interaction
  // Set to true on drag start, false on drag end
  const isDragging = useSharedValue(false);
  // Vertical translation for swipe-up gesture: 0 = collapsed, -TOP_CAROUSEL_OFFSET = expanded
  // Negative values move carousel upward, revealing content below
  const translateY = useSharedValue(0);
  // Stores translateY value at gesture start, used to calculate relative movement
  // Critical for pan gesture: accumulates translation from gesture start, not absolute position
  const gestureStartY = useSharedValue(0);

  // Scroll handler: updates shared values for scroll-driven animations
  // Runs on UI thread (worklet), enabling 60fps animations without JS bridge overhead
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      // Disable auto-advance when user starts dragging
      isDragging.set(true);
    },
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      // Update scroll position for slide card animations (rotate/translateY)
      scrollOffsetX.set(offsetX);
      // Calculate continuous slide index for smooth pagination width interpolation
      // Example: offsetX = 150px, screenWidth = 375px → animatedSlideIndex = 0.4
      animatedSlideIndex.set(offsetX / screenWidth);
    },
    onEndDrag: () => {
      // Re-enable auto-advance and resume progress animations
      isDragging.set(false);
    }
  });

  const handleScrollToIndex = useCallback((index: number) => {
    horizontalListRef.current?.scrollToIndex({
      index,
      animated: true
    });
  }, []);

  // Single tap gesture: advances to next slide when carousel is collapsed
  // maxDuration: 250ms ensures quick taps register, longer presses ignored
  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      // Only advance if carousel is fully collapsed (translateY >= 0)
      if (translateY.get() < 0) return;
      // scheduleOnRN(handleScrollToIndex, currentSlideIndex + 1);
      isDragging.set(false);
    });

  // Pan gesture: handles vertical swipe-up/down to expand/collapse carousel
  // Uses damping factor (÷4) for smoother, more controlled feel
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Store starting position to calculate relative movement
      // Critical: gestureStartY captures translateY at gesture start, not absolute 0
      gestureStartY.set(translateY.get());
      isDragging.set(true);
    })
    .onUpdate((e) => {
      // Prevent overscroll: block upward swipe when already at max expansion
      if (translateY.get() <= -TOP_CAROUSEL_OFFSET && e.translationY < 0) {
        return;
      }

      // Calculate new position: start position + gesture delta with damping
      // Damping factor (÷4): reduces sensitivity, creates smoother drag feel
      // e.translationY: positive = swipe down, negative = swipe up
      const proposed = gestureStartY.get() + e.translationY / 4;
      // Clamp between bounds: 0 (collapsed) to -TOP_CAROUSEL_OFFSET (expanded)
      const clamped = Math.min(0, Math.max(proposed, -TOP_CAROUSEL_OFFSET));
      translateY.set(clamped);
    })
    .onEnd((e) => {
      const currentY = translateY.get();

      // Determine if carousel is currently expanded (negative translateY)
      const isExpanded = currentY < 0;
      isDragging.set(false);

      // Check if user swiped up enough to trigger transition
      // Compares absolute values: if moved up by threshold, expand
      const isTopThresholdReached = Math.abs(gestureStartY.get()) - Math.abs(currentY) > SWIPE_UP_THRESHOLD;

      // Check if user swiped down enough to trigger collapse
      const isBottomThresholdReached = Math.abs(currentY) - Math.abs(gestureStartY.get()) > SWIPE_UP_THRESHOLD;

      // Determine target position based on swipe direction and threshold
      // If swiped up past threshold: expand (go to 0 or stay at -TOP_CAROUSEL_OFFSET)
      const expandedPositionMap = isTopThresholdReached ? 0 : -TOP_CAROUSEL_OFFSET;
      // If swiped down past threshold: collapse (go to -TOP_CAROUSEL_OFFSET or stay at 0)
      const collapsedPositionMap = isBottomThresholdReached ? -TOP_CAROUSEL_OFFSET : 0;

      const target = isExpanded ? expandedPositionMap : collapsedPositionMap;

      // Animate to target with spring physics for natural feel
      translateY.set(
        withSpring(target, {}, (finished) => {
          // Re-enable interactions only when fully collapsed
          if (finished && target === 0) {
            isDragging.set(false);
          }
        })
      );
    });

  // Fade in sign-in buttons block as carousel expands upward
  // Input: translateY from 0 (collapsed) to -TOP_CAROUSEL_OFFSET (expanded)
  // Output: opacity from 0 (hidden) to 1 (visible)
  const rButtonsBlockStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateY.get(), [0, -TOP_CAROUSEL_OFFSET], [0, 1], Extrapolation.CLAMP)
    };
  });

  // "Sign Up / Sign In" button: slides up 40px as carousel expands
  // Creates staggered reveal effect with "Continue with email" button
  const rSignUpStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(translateY.get(), [0, -TOP_CAROUSEL_OFFSET], [0, -40], Extrapolation.CLAMP)
        }
      ]
    };
  });

  // "Continue with email" button: slides down from 40px offset to 0 as carousel expands
  // Starts below final position, creating upward slide-in animation
  const rContinueWithEmailStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(translateY.get(), [0, -TOP_CAROUSEL_OFFSET], [40, 0], Extrapolation.CLAMP)
        }
      ]
    };
  });

  // Gradient overlay: fades in as carousel expands to add depth/darkening effect
  // Helps separate carousel from sign-in buttons below
  const rGradientStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateY.get(), [0, -TOP_CAROUSEL_OFFSET], [0, 1], Extrapolation.CLAMP)
    };
  });

  // Collapse carousel when user taps chevron down button
  // Smoothly animates translateY back to 0 (collapsed position)
  const slideBottomHandler = () => {
    isDragging.set(false);
    translateY.set(
      withTiming(0, {
        duration: 300
      })
    );
  };

  const onSignInPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.AUTH);
    onComplete();
  };

  const onSignUpPress = () => {
    if (translateY.value === -TOP_CAROUSEL_OFFSET) {
      onComplete();
    } else {
      isDragging.set(!isDragging.value);

      translateY.set(
        withTiming(isDragging.value ? 0 : -TOP_CAROUSEL_OFFSET, {
          duration: 300
        })
      );
    }
  };

  return (
    <GestureDetector gesture={Gesture.Race(panGesture, singleTap)}>
      <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom + 10 }}>
        <Animated.View className="mt-auto z-[999999] relative" style={[rButtonsBlockStyle]}>
          <Pressable className="self-center mb-3 p-3" onPress={slideBottomHandler}>
            <Icon set="feather" name="chevron-down" size={26} color="grey" />
          </Pressable>

          <Text className="text-stone-700 text-center text-4xl font-bold">Добро пожаловать!</Text>
          <Text className="text-stone-500 text-center mt-3">Создайте или Войдите в свой аккаунт</Text>
          {/* <Text className="text-slate-400 text-center">Вы можете пропустить этот шаг</Text>
          <Text className="text-slate-400 text-center">но для заказа необходима регистрация</Text> */}

          <TouchableOpacity
            onPress={onSignInPress}
            activeOpacity={0.8}
            style={{ borderCurve: 'continuous', backgroundColor: '#EA004B' }}
            className="flex-row h-[50px] items-center justify-center gap-2 rounded-full mx-7 mt-8"
          >
            <Icon set="feather" name="user" size={22} color="#fff" />
            <Text className="text-white font-bold text-base">Вход / Регистрация</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableWithoutFeedback onPress={() => {}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSignUpPress}
            disabled={isDragging.value}
            style={{ borderCurve: 'continuous' }}
            className="h-[50px] items-center justify-center rounded-full mx-7 mt-4 bg-stone-200 overflow-hidden"
          >
            <Animated.View className="flex-row items-center gap-2 pt-0" style={rSignUpStyle}>
              <Icon set="feather" name="user" size={24} color="#78716c" />
              <Text className="text-stone-600 font-semibold">Пропустить или войти в профиль</Text>
            </Animated.View>

            <Animated.View className="flex-row items-center gap-2 -mt-[27]" style={rContinueWithEmailStyle}>
              <Icon set="feather" name="arrow-up-right" size={24} color="#78716c" />
              <Text className="text-stone-600 font-semibold">Пропустить этот шаг</Text>
            </Animated.View>
          </TouchableOpacity>
        </TouchableWithoutFeedback>

        <Carousel
          SLIDES={SLIDES}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          animatedSlideIndex={animatedSlideIndex}
          horizontalListRef={horizontalListRef}
          scrollHandler={scrollHandler}
          translateY={translateY}
          scrollOffsetX={scrollOffsetX}
          isDragging={isDragging}
          topCarouselOffset={TOP_CAROUSEL_OFFSET}
        />

        <Animated.View className="absolute inset-0 pointer-events-none" style={rGradientStyle}>
          <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={{ width: '100%', height: '60%' }} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

// superlist-onboarding-flow-animation-end 🔼
