import { Text } from '@/components/Text';
import React from 'react';
import { Image, View } from 'react-native';

export default function PromoSlide(props: any) {
  const { ...rest } = props;

  return (
    <View className="flex-row p-4 bg-red-400 rounded-3xl items-center" {...rest}>
      <View className="flex-1">
        <Text className="text-white font-bold text-2xl mb-4">Бесплатная доставка!!!</Text>
        <Text className="text-stone-200 font-bold">на первый заказ!</Text>
      </View>

      <Image
        className="w-[200px] h-[200px] object-cover"
        source={{
          uri: 'https://images.deliveryhero.io/image/foodpanda/web-acquisition/ys/rlp-nc-banner-logo.webp'
        }}
      ></Image>
    </View>
  );
}
