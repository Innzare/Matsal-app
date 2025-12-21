import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ROUTES, Route } from '@/constants/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { Text } from './Text';

const NavItem = ({
  route,
  isActive,
  onPress,
  special,
  paddingBottom
}: {
  route: Route;
  isActive: boolean;
  onPress: () => void;
  special?: boolean;
  paddingBottom?: number;
}) => {
  const animation = useSharedValue(1);
  const [cartCount, setCartCount] = useState(18);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(animation.value, { duration: 200, easing: Easing.inOut(Easing.linear) }) }]
  }));

  // const cartCountFormatted = () => {
  //   return cartCount > 9 ? '9+' : cartCount;
  // };

  const IconComponent = route.icon.component;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        animation.value = 0.85;
      }}
      onPressOut={() => {
        animation.value = 1;
      }}
      className={`relative flex-1 items-center border justify-center rounded-full gap-1 h-[50px] ${isActive ? 'border border-stone-300 bg-stone-50' : 'bg-white border-transparent'}`}
    >
      <Animated.View style={animatedStyle}>
        {IconComponent ? (
          <IconComponent color={isActive ? 'red' : '#3d3d3d'} />
        ) : (
          <Icon
            set={route.icon.set}
            name={route.icon.name}
            size={route.icon.size}
            color={isActive ? 'red' : '#3d3d3d'}
          />
        )}
      </Animated.View>

      {/* <Icon set={route.icon.set} name={route.icon.name} size={route.icon.size} color={isActive ? 'red' : '#3d3d3d'} /> */}

      {route.path === '/carts' && (
        <View className="aspect-square h-[20px] bg-red-500 absolute top-1 right-3 z-10 rounded-full justify-center items-center">
          <Text className="text-white font-bold text-xs">{cartCount}</Text>
        </View>
      )}

      {/* <Text className={`text-center font-bold text-xs ${isActive ? 'text-red-600' : 'text-stone-700'}`}>
        {route.name}
      </Text> */}
    </Pressable>
  );
};

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: insets.bottom - 3
      }}
      className="absolute bottom-0 left-0 px-4 flex-row gap-2"
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.95)', 'transparent']}
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

      <View className="flex-1 w-[100%] max-w-[59px] h-[59px] bg-white border border-stone-200 p-1 rounded-full">
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
        />
      </View>

      <View className="flex-1 w-full bg-white border border-stone-200 flex-row justify-between p-1 rounded-full">
        {ROUTES.map((route, index) => {
          return (
            <NavItem
              key={route.path}
              route={route}
              isActive={pathname === route.path}
              onPress={() => router.push(route.path)}
              special={index === 2}
              paddingBottom={insets.bottom}
            />
          );
        })}
      </View>

      <View className="flex-1 w-[100%] max-w-[59px] h-[59px] bg-white border border-stone-200 p-1 rounded-full">
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
        />
      </View>
    </View>
  );
}
