import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import Reanimated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

// threads-home-header-tabs-animation 🔽

type Props = {
  index: number;
  tabName: string;
  indexDecimal: SharedValue<number>;
  isDark?: boolean;
  onPress: () => void;
};

export const TabItem: FC<Props> = ({ index, tabName, indexDecimal, isDark, onPress }) => {
  const rTextStyle = useAnimatedStyle(() => {
    const activeColor = isDark ? '#e4e4e7' : '#000';
    const inactiveColor = isDark ? '#71717a' : '#aaa';
    const color = interpolateColor(
      indexDecimal.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, inactiveColor]
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9} // Subtle press feedback without competing with color animation
      onPress={onPress}
      className="flex-1 items-center justify-center py-4" // flex-1 ensures equal width distribution
    >
      <Reanimated.Text className="text-base font-semibold" style={rTextStyle}>
        {tabName}
      </Reanimated.Text>
    </TouchableOpacity>
  );
};

// threads-home-header-tabs-animation 🔼
