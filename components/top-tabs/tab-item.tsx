import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import Reanimated, { interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

// threads-home-header-tabs-animation 🔽

type Props = {
  index: number;
  tabName: string;
  indexDecimal: SharedValue<number>;
  onPress: () => void;
};

export const TabItem: FC<Props> = ({ index, tabName, indexDecimal, onPress }) => {
  const rTextStyle = useAnimatedStyle(() => {
    // Three-point color interpolation creates smooth transitions between tabs
    // Range [index-1, index, index+1] ensures current tab is white, others are gray
    // This creates a "spotlight" effect as indexDecimal moves between tab indices
    const color = interpolateColor(
      indexDecimal.value,
      [index - 1, index, index + 1], // Input range: previous tab, current tab, next tab
      ['#aaa', '#000', '#aaa'] // Output colors: inactive gray, active white, inactive gray
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9} // Subtle press feedback without competing with color animation
      onPress={onPress}
      className="flex-1 items-center justify-center" // flex-1 ensures equal width distribution
    >
      <Reanimated.Text className="text-base font-semibold" style={rTextStyle}>
        {tabName}
      </Reanimated.Text>
    </TouchableOpacity>
  );
};

// threads-home-header-tabs-animation 🔼
