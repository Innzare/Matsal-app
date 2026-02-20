import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Toast, ToastType, useToastStore } from '@/store/useToastStore';
import { useTheme } from '@/hooks/useTheme';

const TOAST_CONFIG: Record<
  ToastType,
  { icon: string; color: string; bgColor: string; borderColor: string }
> = {
  success: {
    icon: 'check-circle',
    color: '#16a34a',
    bgColor: '#fff',
    borderColor: '#16a34a'
  },
  error: {
    icon: 'x-circle',
    color: '#dc2626',
    bgColor: '#fff',
    borderColor: '#dc2626'
  },
  warning: {
    icon: 'alert-triangle',
    color: '#d97706',
    bgColor: '#fff',
    borderColor: '#d97706'
  },
  info: {
    icon: 'info',
    color: '#2563eb',
    bgColor: '#fff',
    borderColor: '#2563eb'
  }
};

function ToastItem({ toast }: { toast: Toast }) {
  const { hideToast } = useToastStore();
  const { colors, isDark } = useTheme();
  const config = TOAST_CONFIG[toast.type];
  const duration = toast.duration ?? 4000;

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const progress = useSharedValue(1);
  const panY = useSharedValue(0);

  const dismiss = () => {
    'worklet';
    translateY.value = withTiming(-120, { duration: 280, easing: Easing.in(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 250 }, () => {
      scheduleOnRN(hideToast, toast.id);
    });
  };

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 220, mass: 0.8 });
    opacity.value = withTiming(1, { duration: 180 });
    progress.value = withTiming(0, { duration, easing: Easing.linear });

    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY < 0) {
        panY.value = e.translationY;
        translateY.value = e.translationY;
        opacity.value = 1 + e.translationY / 80;
      }
    })
    .onEnd((e) => {
      if (e.translationY < -40 || e.velocityY < -400) {
        dismiss();
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          containerStyle,
          {
            borderRadius: 16,
            marginHorizontal: 12,
            marginBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.22,
            shadowRadius: 20,
            elevation: 14
          }
        ]}
      >
        <View
          style={{
            backgroundColor: isDark ? colors.surface : config.bgColor,
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isDark ? colors.border : '#e8e8e8'
          }}
        >
        {/* Colored left bar */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: config.borderColor,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16
          }}
        />

        {/* Content */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 14, paddingVertical: 14, gap: 12 }}>
          {/* Icon */}
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: `${config.borderColor}18`,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon set="feather" name={config.icon as any} size={19} color={config.color} />
          </View>

          {/* Text */}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ fontWeight: '700', fontSize: 14.5, color: isDark ? colors.text : '#111', lineHeight: 19 }}>
              {toast.title}
            </Text>
            {toast.message ? (
              <Text style={{ fontSize: 13, color: isDark ? colors.textMuted : '#666', lineHeight: 18 }} numberOfLines={2}>
                {toast.message}
              </Text>
            ) : null}
          </View>

          {/* Close button */}
          <Pressable
            onPress={() => dismiss()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              width: 24,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            })}
          >
            <Icon set="feather" name="x" size={15} color={isDark ? colors.textMuted : '#999'} />
          </Pressable>
        </View>

        {/* Progress bar */}
        <Animated.View
          style={[
            progressStyle,
            {
              height: 3,
              backgroundColor: config.borderColor,
              opacity: 0.5
            }
          ]}
        />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function GlobalToast() {
  const { toasts } = useToastStore();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}