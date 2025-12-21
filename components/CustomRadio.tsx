import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// discord-language-radio-button-animation 🔽

// Base dimensions for inactive state (unselected radio button)
const INACTIVE_RING_SIZE = 18;
const INACTIVE_RING_WIDTH = 2;
const INACTIVE_RING_COLOR = '#C7C8CE';

// Active state dimensions - maintains consistent outer dimensions
const ACTIVE_RING_SIZE = INACTIVE_RING_SIZE;
const ACTIVE_RING_COLOR = '#EA004B'; // Discord's signature brand blue
const ACTIVE_DOT_SIZE = INACTIVE_RING_SIZE * 0.45; // Inner dot scales to 45% of ring for proper visual weight
const ACTIVE_DOT_COLOR = '#F5F5F5';

// Animation timing optimized for snappy Discord-like interactions
const DURATION = 150; // Base duration for selection animations
const EASING = Easing.out(Easing.ease); // Smooth deceleration curve for polished feel

type Props = {
  selected: boolean;
};

export const CustomRadio: FC<Props> = ({ selected }) => {
  // Coordinated opacity and scale animation for active state
  // Creates a "pop-in" effect when selecting and "fade-out" when deselecting
  const rActiveStyle = useAnimatedStyle(() => {
    return {
      // Asymmetric timing: slower fade-in (2x duration) for emphasis, faster fade-out
      opacity: withTiming(selected ? 1 : 0, {
        duration: selected ? DURATION * 2 : DURATION, // Selection emphasizes with longer duration
        easing: EASING
      }),
      transform: [
        {
          // Scale interpolation: 0.5 → 1.0 creates smooth "growth" animation
          // Starting at 0.5 prevents jarring appearance from 0 scale
          scale: withTiming(selected ? 1 : 0.5, {
            duration: DURATION,
            easing: EASING
          })
        }
      ]
    };
  });

  return (
    // Container maintains consistent hitbox - inactive ring provides base structure
    <View style={styles.inactiveRing} className="items-center justify-center">
      {/* Active ring uses absoluteFill to overlay inactive ring perfectly */}
      {/* Animation style applied here affects both ring and inner dot simultaneously */}
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.activeRing, rActiveStyle]}
        className="items-center justify-center"
      >
        {/* Inner dot inherits parent's opacity/scale - no separate animation needed */}
        <Animated.View style={styles.activeDot} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Base ring structure - always visible, provides consistent dimensions
  inactiveRing: {
    width: INACTIVE_RING_SIZE,
    height: INACTIVE_RING_SIZE,
    borderRadius: INACTIVE_RING_SIZE / 2,
    borderWidth: INACTIVE_RING_WIDTH,
    borderColor: INACTIVE_RING_COLOR
  },
  // Active ring positioned to perfectly overlay inactive ring
  // Negative margins compensate for border width to align outer edges
  activeRing: {
    position: 'absolute',
    top: -INACTIVE_RING_WIDTH, // Offset by border width to align with inactive ring
    left: -INACTIVE_RING_WIDTH,
    width: ACTIVE_RING_SIZE,
    height: ACTIVE_RING_SIZE,
    borderRadius: ACTIVE_RING_SIZE / 2,
    backgroundColor: ACTIVE_RING_COLOR // Solid fill replaces border approach
  },
  // Inner dot - sized for optimal visual hierarchy within active ring
  activeDot: {
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: ACTIVE_DOT_SIZE / 2,
    backgroundColor: ACTIVE_DOT_COLOR
  }
});

// discord-language-radio-button-animation 🔼
