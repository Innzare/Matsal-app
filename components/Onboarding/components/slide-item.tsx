import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FC } from "react";
import { OnboardingSlide } from "./lib/types";
import { Icon } from "@/components/Icon";

// superlist-onboarding-flow-animation 🔽

type SlideItemProps = {
  item: OnboardingSlide;
  index: number;
  width: number;
  scrollOffsetX: SharedValue<number>;
};

export const SlideItem: FC<SlideItemProps> = ({ item, index, width, scrollOffsetX }) => {
  // Animated style for slide card transforms during horizontal scroll
  // Creates parallax-like effect: cards rotate and translate vertically as user swipes
  const rStyle = useAnimatedStyle(() => {
    // Input range: [previous slide center, current slide center, next slide center]
    // Each slide is screenWidth pixels wide, so centers are at width * index
    const inputRange = [width * (index - 1), width * index, width * (index + 1)];

    // Rotation interpolation: card tilts ±2deg when adjacent to center
    // Creates depth perception as cards rotate away from center position
    const rotate = interpolate(scrollOffsetX.get(), inputRange, [2, 0, -2], Extrapolation.CLAMP);
    // Vertical translation: card moves ±4px vertically when adjacent
    // Combined with rotation, creates 3D card stack effect
    const translateY = interpolate(scrollOffsetX.get(), inputRange, [4, 0, 4], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  }, [scrollOffsetX, index, width]);

  return (
    <Animated.View className="px-7 py-5" style={[{ width }, rStyle]}>
      <View
        className="flex-1 items-center justify-center px-8 rounded-3xl"
        style={{
          backgroundColor: item.bgColor,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 3,
          borderCurve: "continuous",
        }}
      >
        <View className="w-28 h-28 rounded-full bg-white/15 items-center justify-center mb-8">
          <Icon set={item.icon.set} name={item.icon.name} size={56} color="rgba(255,255,255,0.9)" />
        </View>

        <Text className="text-white text-3xl font-bold text-center leading-10">{item.title}</Text>
      </View>
    </Animated.View>
  );
};

// superlist-onboarding-flow-animation 🔼