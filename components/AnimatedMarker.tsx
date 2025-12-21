import { View, StyleSheet } from 'react-native';
import React from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function AnimatedMarker({ isMapMoving }: { isMapMoving: any }) {
  const markerAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: '-135deg' },
        { translateY: withTiming(isMapMoving.value ? 10 : 0, { duration: 200 }) },
        { translateX: withTiming(isMapMoving.value ? 10 : 0, { duration: 200 }) }
      ],
      borderTopLeftRadius: withTiming(isMapMoving.value ? '50%' : 0, { duration: 200 })
    };
  });

  const markerLineAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMapMoving.value ? 1 : 0, { duration: 200 })
    };
  });

  const markerShadowAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMapMoving.value ? 0 : 0.4, { duration: 200 })
    };
  });

  return (
    <View style={styles.pinContainer} className="items-center relative">
      <Animated.View
        style={[
          {
            // iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.85,
            shadowRadius: 6,

            // Android
            elevation: 8,

            borderRadius: '50%'
          },
          markerAnimatedStyles
        ]}
        className="justify-center items-center w-[30px] h-[30px] bg-red-600 rounded-full z-10"
      >
        <View className="w-[18px] h-[18px] border-2 border-white rounded-full"></View>
      </Animated.View>

      <Animated.View
        style={[markerLineAnimatedStyles]}
        className="w-[2px] h-[20px] bg-red-600 -mt-4 mb-1 rounded-full"
      ></Animated.View>

      <Animated.View
        style={[markerShadowAnimatedStyles]}
        className="w-[25px] h-[7px] bg-stone-800 rounded-[50%] opacity-40"
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -40 }],
    zIndex: 200
  }
});
