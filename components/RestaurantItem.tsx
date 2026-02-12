import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RestaurantItem(props: any) {
  const { data, block = false } = props;
  const animation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(animation.value, { duration: 200, easing: Easing.inOut(Easing.linear) }) }]
  }));

  const {
    src: imageSrc = '',
    name = '',
    deliveryTime = '',
    minPrice = '',
    rate = '',
    reviewsCount = '',
    id = ''
  } = data;

  const router = useRouter();
  const { favoriteRestaurants, toggleFavorite } = useFavoritesStore();
  const isFavourite = favoriteRestaurants.includes(data.id);

  const onFavouritePress = () => {
    toggleFavorite(data.id);
  };

  const onRestaurantPress = () => {
    setTimeout(() => {
      router.push(`/restaurants/${id}`);
    }, 0);
  };

  return (
    <AnimatedPressable
      onPressIn={() => {
        animation.value = 0.95;
      }}
      onPressOut={() => {
        animation.value = 1;
      }}
      className="relative overflow-hidden"
      onPress={onRestaurantPress}
      style={[animatedStyle]}
    >
      <Image
        style={{
          borderRadius: 10,
          width: block ? '100%' : 290,
          height: block ? 190 : 150
        }}
        transition={500}
        cachePolicy="memory-disk"
        source={{ uri: imageSrc }}
        contentFit="cover"
      />

      <Pressable
        className="absolute top-3 right-3 w-8 h-8 active:scale-90 transition-transform duration-150 items-center justify-center pt-0.5 bg-white rounded-full"
        onPress={onFavouritePress}
      >
        <Icon set="ion" name="heart" size={18} color={isFavourite ? 'red' : '#aaa'} />
      </Pressable>

      <View className="p-2 absolute bottom-[58px] left-3 bg-white rounded-lg">
        <Icon set="ion" name="logo-slack" size={21} color="#EA004B" />
      </View>

      <View className="px-1 pt-2">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold">{name}</Text>

          <View className="flex-row items-center gap-1">
            <Icon set="ant" name="star" size={14} color="#f59e0b" />

            <Text className="font-bold text-sm">{rate}</Text>
            <Text className="text-sm ml-1">{reviewsCount}</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-0.5">
          <View className="items-center flex-row gap-1 ">
            <Icon set="ant" name="field-time" size={16} color="#777" />

            <Text className="text-sm text-stone-600">{deliveryTime}</Text>
          </View>

          <Text className="mx-1 text-stone-500">/</Text>

          <View className="flex-row items-center">
            <Text className="text-sm text-stone-600">от {minPrice}</Text>

            <Icon set="material" name="currency-ruble" size={14} color="#777" />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
