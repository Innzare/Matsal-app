import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { useTheme } from '@/hooks/useTheme';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GroceryStoreItemProps {
  data: any;
  variant?: 'compact' | 'list';
}

export default function GroceryStoreItem({ data, variant = 'compact' }: GroceryStoreItemProps) {
  const { colors, isDark } = useTheme();
  const animation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(animation.value, { duration: 200, easing: Easing.inOut(Easing.linear) }) }]
  }));

  const {
    src: imageSrc = '',
    name = '',
    deliveryTime = '',
    minPrice = '',
    id = ''
  } = data;

  const router = useRouter();
  const { favoriteGroceries, toggleGroceryFavorite } = useFavoritesStore();
  const isFavourite = favoriteGroceries.includes(data.id);

  const onFavouritePress = () => {
    toggleGroceryFavorite(data.id);
  };

  const onStorePress = () => {
    setTimeout(() => {
      router.push(`/groceries/${id}`);
    }, 0);
  };

  if (variant === 'list') {
    return (
      <AnimatedPressable
        onPressIn={() => { animation.value = 0.98; }}
        onPressOut={() => { animation.value = 1; }}
        onPress={onStorePress}
        className="flex-row items-center px-5 py-3 bg-white dark:bg-dark-surface"
        style={[animatedStyle]}
      >
        {/* Лого магазина */}
        <View className="relative">
          <Image
            source={{ uri: imageSrc }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isDark ? colors.border : '#e7e5e4'
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          {/* Сердечко */}
          <Pressable
            className="absolute -top-1 -right-1 w-7 h-7 items-center justify-center bg-white dark:bg-dark-surface rounded-full"
            style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}
            onPress={onFavouritePress}
          >
            <Icon set="ion" name="heart" size={16} color={isFavourite ? 'red' : (isDark ? colors.textMuted : '#d4d4d4')} />
          </Pressable>
          {/* Бейдж Featured */}
          <View className="absolute bottom-1.5 left-1.5 bg-green-600 rounded px-1.5 py-0.5">
            <Text className="text-white text-[9px] font-bold">Featured</Text>
          </View>
        </View>

        {/* Инфо */}
        <View className="flex-1 ml-3.5">
          <Text className="font-bold text-[15px] text-stone-800 dark:text-dark-text" numberOfLines={1}>{name}</Text>
          <Text className="text-xs text-stone-500 dark:text-dark-muted mt-0.5">{deliveryTime} · от {minPrice} ₽</Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Icon set="material" name="local-shipping" size={14} color="#16a34a" />
            <Text className="text-xs font-semibold" style={{ color: '#16a34a' }}>Бесплатно</Text>
          </View>
        </View>

        {/* Стрелка */}
        <View className="w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
          <Icon set="material" name="keyboard-arrow-right" size={22} color={colors.iconMuted} />
        </View>
      </AnimatedPressable>
    );
  }

  // variant === 'compact'
  return (
    <AnimatedPressable
      onPressIn={() => { animation.value = 0.95; }}
      onPressOut={() => { animation.value = 1; }}
      onPress={onStorePress}
      className="items-center"
      style={[animatedStyle, { width: 110 }]}
    >
      <View className="relative">
        <Image
          source={{ uri: imageSrc }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDark ? colors.border : '#e7e5e4'
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        {/* Сердечко */}
        <Pressable
          className="absolute -top-1 -right-1 w-6 h-6 items-center justify-center bg-white dark:bg-dark-surface rounded-full"
          style={{ shadowColor: '#000', shadowOpacity: isDark ? 0.3 : 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 }}
          onPress={onFavouritePress}
        >
          <Icon set="ion" name="heart" size={14} color={isFavourite ? 'red' : (isDark ? colors.textMuted : '#d4d4d4')} />
        </Pressable>
      </View>

      <Text className="font-bold text-xs text-stone-800 dark:text-dark-text text-center mt-2" numberOfLines={2}>{name}</Text>
      <Text className="text-[11px] text-stone-400 dark:text-dark-muted text-center mt-0.5">{deliveryTime}</Text>
    </AnimatedPressable>
  );
}