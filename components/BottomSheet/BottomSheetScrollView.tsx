import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  AnimatedScrollViewProps,
  clamp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import BackDrop from './Backdrop';

interface Props extends AnimatedScrollViewProps {
  snapTo: number[];
  backgroundColor: string;
  backDropColor: string;
  ref: any;
}

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

export default function BottomSheetScrollView({
  snapTo,
  children,
  backgroundColor,
  backDropColor,
  ref,
  ...rest
}: Props) {
  const scrollRef = React.useRef<Animated.ScrollView>(null);

  const inset = useSafeAreaInsets();
  const { height } = Dimensions.get('screen');

  const snapsSorted = snapTo.sort((a, b) => a - b);
  const minSnap = Math.floor(snapsSorted[0]);
  const maxSnap = Math.floor(snapsSorted[snapsSorted.length - 1]);

  console.log('minSnap', minSnap);

  const percentage = minSnap / 100;
  const maxPercentage = maxSnap / 100;
  const closeHeight = height;
  const openHeight = height - height * percentage;
  const maxHeight = height - height * maxPercentage;
  const topAnimation = useSharedValue(closeHeight);
  const context = useSharedValue(0);
  const scrollBegin = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const isPanActive = useSharedValue(true);
  const [enableScroll, setEnableScroll] = useState(false);
  const [isActiveForPullToRequest, setIsActiveForPullToRequest] = useState(false);

  console.log('height', height);

  const scrollToY = (offset: number) => {
    scrollRef.current?.scrollTo({ y: offset, animated: false });
  };

  const expand = useCallback(() => {
    'worklet';
    topAnimation.value = withTiming(openHeight);
  }, [openHeight, topAnimation]);

  const close = useCallback(() => {
    'worklet';
    topAnimation.value = withTiming(closeHeight);
  }, [closeHeight, topAnimation]);

  useImperativeHandle(
    ref,
    () => ({
      expand,
      close
    }),
    [expand, close]
  );

  const animationStyle = useAnimatedStyle(() => {
    const top = topAnimation.value;
    return {
      top
    };
  });

  const pan = Gesture.Pan().onBegin(() => {
    context.value = topAnimation.value;
  });
  // .onUpdate((event) => {
  //   console.log('event.translationY', event.translationY);

  //   if (event.translationY > 0) {
  //     topAnimation.value = openHeight;
  //   } else {
  //     topAnimation.value = context.value + event.translationY;
  //   }
  // })
  // .onEnd(() => {
  //   if (topAnimation.value > openHeight + 350) {
  //     topAnimation.value = closeHeight;
  //   } else {
  //     topAnimation.value = withTiming(openHeight, { duration: 150 });
  //   }
  // });

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      scrollBegin.value = event.contentOffset.y;
    },
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const panScroll = Gesture.Pan()
    .onBegin(() => {
      context.value = topAnimation.value;
    })
    .onUpdate((event) => {
      // console.log('scrollY.value', scrollY.value);
      // console.log('openHeight', openHeight);
      // console.log('maxHeight', maxHeight);

      if (topAnimation.value > maxHeight) {
        scheduleOnRN(scrollToY, 0);
      }

      // if (topAnimation.value <= maxHeight) {
      //   scheduleOnRN(setEnableScroll, true);
      // } else if (topAnimation.value >= openHeight) {
      //   scheduleOnRN(setEnableScroll, false);
      // }

      // topAnimation.value = context.value + event.translationY;
      // topAnimation.value = context.value + event.translationY;
      if (scrollY.value <= 0) {
        topAnimation.value = clamp(context.value + event.translationY, maxHeight, openHeight);
      }
      console.log('scrollY.value', scrollY.value);

      // topAnimation.value = clamp(context.value + event.translationY, openHeight, maxHeight);

      // switch (true) {
      // case event.translationY > -185:
      //   scheduleOnRN(setEnableScroll, false);

      //   break;

      // case event.translationY <= -185:
      //   topAnimation.value = maxHeight;
      //   scheduleOnRN(setEnableScroll, true);

      //   break;

      // case event.translationY > 0:
      //   topAnimation.value = openHeight;
      //   scheduleOnRN(setIsActiveForPullToRequest, true);

      //   break;

      // case event.translationY > -180 && event.translationY < 1:
      //   topAnimation.value = context.value + event.translationY;

      //   break;

      // case event.translationY < 170 && scrollY.value >= 0:
      //   scheduleOnRN(setEnableScroll, false);
      //   scheduleOnRN(setIsActiveForPullToRequest, false);
      //   topAnimation.value = context.value + event.translationY;

      //   break;

      //   default:
      //     // scheduleOnRN(setEnableScroll, true);
      //     break;
      // }

      // if (event.translationY > 0 && scrollY.value <= 0) {
      //   topAnimation.value = openHeight;
      //   scheduleOnRN(setIsActiveForPullToRequest, true);
      // } else if (event.translationY < 170 && scrollY.value >= 0) {
      //   scheduleOnRN(setEnableScroll, false);
      //   scheduleOnRN(setIsActiveForPullToRequest, false);
      //   topAnimation.value = context.value + event.translationY;
      //   // topAnimation.value = Math.max(context.value + event.translationY - scrollBegin.value, openHeight);
      // } else {
      //   // scheduleOnRN(setEnableScroll, true);
      // }
    })
    .onEnd((event) => {
      const velocity = event.velocityY;

      if (topAnimation.value > maxHeight) {
        scheduleOnRN(scrollToY, 0);
      }

      if (scrollY.value <= 0) {
        topAnimation.value = withDecay({
          velocity,
          clamp: [maxHeight, openHeight],
          deceleration: 0.995
        });
      }
    });

  const scrollViewGesture = Gesture.Native();

  return (
    <>
      <BackDrop
        topAnimation={topAnimation}
        backDropColor={backDropColor}
        closeHeight={closeHeight}
        openHeight={openHeight}
        close={close}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.container,
            animationStyle,
            {
              backgroundColor: backgroundColor,
              paddingBottom: inset.bottom
            }
          ]}
        >
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <GestureDetector gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
            <Animated.ScrollView
              {...rest}
              ref={scrollRef}
              // scrollEnabled={enableScroll}
              bounces={isActiveForPullToRequest}
              scrollEventThrottle={16}
              onScroll={onScroll}
            >
              {children}
            </Animated.ScrollView>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  lineContainer: {
    marginVertical: 10,
    alignItems: 'center'
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 20
  }
});
