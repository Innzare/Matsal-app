import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ROUTES, Route } from '@/constants/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { Text } from './Text';

const NavItem = ({
  route,
  name = '',
  isActive,
  onPress,
  special,
  paddingBottom,
  colors
}: {
  route: Route;
  name?: string;
  isActive: boolean;
  onPress: () => void;
  special?: boolean;
  paddingBottom?: number;
  colors: ReturnType<typeof useTheme>['colors'];
}) => {
  const animation = useSharedValue(1);
  const { carts } = useCartStore();
  const cartCount = Object.keys(carts).length;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(animation.value, { duration: 200, easing: Easing.inOut(Easing.linear) }) }]
  }));

  const IconComponent = route.icon.component;
  const inactiveColor = colors.text;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        animation.value = 0.85;
      }}
      onPressOut={() => {
        animation.value = 1;
      }}
      className={`relative flex-1 items-center border justify-center rounded-full gap-1 h-[50px] ${isActive ? 'border border-stone-300 dark:border-[#4a4a64] bg-stone-50 dark:bg-[#2e2e44]' : 'bg-white dark:bg-dark-elevated border-transparent'}`}
    >
      <Animated.View style={animatedStyle}>
        {IconComponent ? (
          <IconComponent color={isActive ? 'red' : inactiveColor} />
        ) : (
          <Icon
            set={route.icon.set}
            name={route.icon.name}
            size={route.icon.size}
            color={isActive ? 'red' : inactiveColor}
          />
        )}
      </Animated.View>

      {route.path === '/carts' && cartCount > 0 && (
        <View className="aspect-square h-[20px] bg-red-500 absolute top-1 right-3 z-10 rounded-full justify-center items-center">
          <Text className="text-white font-bold text-xs">{cartCount > 9 ? '9+' : cartCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View
      style={{
        paddingBottom: insets.bottom - 3
      }}
      className="absolute bottom-0 left-0 px-4 flex-row gap-2"
    >
      <LinearGradient
        colors={[isDark ? 'rgba(18, 18, 32, 0.95)' : 'rgba(0, 0, 0, 0.95)', 'transparent']}
        start={{ x: 0.5, y: 1.09 }}
        end={{ x: 0.5, y: 0 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '160%'
        }}
      />

      <View
        className="flex-1 w-[100%] max-w-[59px] h-[59px] bg-white dark:bg-dark-elevated border border-stone-200 dark:border-[#3a3a54] p-1 rounded-full"
        style={isDark ? { shadowColor: '#8080ff', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 } : undefined}
      >
        <NavItem
          route={{
            name: 'Корзина',
            path: '/search',
            icon: {
              size: 23,
              set: 'feather',
              name: 'search'
            }
          }}
          isActive={pathname === '/search'}
          onPress={() => router.push('/search')}
          paddingBottom={insets.bottom}
          colors={colors}

        />
      </View>

      <View
        className="flex-1 w-full bg-white dark:bg-dark-elevated border border-stone-200 dark:border-[#3a3a54] flex-row justify-between p-1 rounded-full"
        style={isDark ? { shadowColor: '#8080ff', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 } : undefined}
      >
        {ROUTES.map((route, index) => {
          return (
            <NavItem
              key={route.path}
              name={route.name}
              route={route}
              isActive={pathname === route.path}
              onPress={() => router.push(route.path)}
              special={index === 2}
              paddingBottom={insets.bottom}
              colors={colors}
    
            />
          );
        })}
      </View>

      <View
        className="flex-1 w-[100%] max-w-[59px] h-[59px] bg-white dark:bg-dark-elevated border border-stone-200 dark:border-[#3a3a54] p-1 rounded-full"
        style={isDark ? { shadowColor: '#8080ff', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 } : undefined}
      >
        <NavItem
          route={{
            name: 'Профиль',
            path: '/profile',
            icon: {
              size: 25,
              set: 'feather',
              name: 'user'
            }
          }}
          isActive={pathname === '/profile'}
          onPress={() => router.push('/profile')}
          paddingBottom={insets.bottom}
          colors={colors}

        />
      </View>
    </View>
  );
}
