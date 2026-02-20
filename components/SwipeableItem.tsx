import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Icon } from './Icon';
import Animated, { Easing, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

const ACTION_WIDTH = 60;

export function SwipeRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const ref = useRef<any>(null);
  const { colors, isDark } = useTheme();

  return (
    <Swipeable
      ref={ref}
      childrenContainerStyle={{
        backgroundColor: 'white',
        overflow: 'hidden',
        padding: isDark ? 0 : 12,
        borderRadius: 8,
        borderWidth: isDark ? 0 : 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 18
      }}
      renderRightActions={() => (
        <RectButton style={[styles.action, styles.delete]} onPress={onDelete}>
          <Icon set="feather" name="trash-2" size={23} color="#fff" />
        </RectButton>
      )}
      animationOptions={{
        duration: 200, // ⬅️ плавный возврат
        easing: Easing.linear
      }}
      rightThreshold={8}
      dragOffsetFromRightEdge={3}
      overshootRight={false}
      overshootFriction={12}
      friction={2.5}
    >
      <TouchableWithoutFeedback onPress={() => ref.current?.close()}>{children}</TouchableWithoutFeedback>
    </Swipeable>
  );
}
// bg-white border border-stone-200 p-3 rounded-xl
const styles = StyleSheet.create({
  action: {
    width: 60, // ⬅️ РОВНО как threshold
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    marginLeft: -4,
    paddingLeft: 4,
    transform: [{ translateX: -21 }]
  },
  delete: {
    backgroundColor: '#F44336'
  },
  text: {
    color: '#fff',
    fontWeight: '600'
  }
});
