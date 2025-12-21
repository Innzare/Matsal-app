import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuItemContent({ item }: any) {
  const [itemsCount, setItemsCount] = useState(1);

  const insets = useSafeAreaInsets();

  const onChangeItemsCountPress = (action: string) => {
    switch (action) {
      case 'add':
        setItemsCount((prev) => prev + 1);
        break;

      case 'reduce':
        setItemsCount((prev) => prev - 1);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <BottomSheetScrollView>
        <View className="px-6 pb-4 relative flex-1 h-[100%]">
          <View className="flex-row justify-between gap-2">
            <View className="flex-1">
              <Text className="text-3xl font-bold mb-4">{item.name}</Text>
              <Text className="text-sm mb-4">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat enim sit est magni quidem nemo dicta
              </Text>
              <Text className="text-emerald-700 font-bold">{item.price}</Text>
            </View>

            <Image source={{ uri: item.image }} className="flex-1 aspect-square rounded-xl mb-6" resizeMode="cover" />
          </View>

          <View className="gap-4">
            {Array(20)
              .fill(null)
              .map((i, x) => {
                return <View className="p-3 bg-stone-300 rounded-lg" key={x}></View>;
              })}
          </View>
        </View>
      </BottomSheetScrollView>

      <View
        className="flex-row items-center px-6 pt-2 border-t border-stone-200"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <TouchableOpacity
            disabled={itemsCount <= 1}
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 w-[35px] h-[35px] justify-center items-center"
            onPress={() => onChangeItemsCountPress('reduce')}
            style={{ opacity: itemsCount <= 1 ? 0.3 : 1 }}
          >
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>

          <Text className="font-bold">{itemsCount}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 w-[35px] h-[35px] justify-center items-center"
            onPress={() => onChangeItemsCountPress('add')}
          >
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="px-6 flex-row justify-center right-0 left-0 bottom-0 bg-red-700 items-center py-4 rounded-full gap-4"
        >
          <Text className="text-white font-bold">Добавить в корзину</Text>
          <Icon set="feather" name="shopping-cart" size={21} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
