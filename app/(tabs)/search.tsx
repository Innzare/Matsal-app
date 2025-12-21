import Categories from '@/components/Categories';
import { Icon } from '@/components/Icon';
import { AutoScrollBadges } from '@/components/ScrollableSlider';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ITEMS = ['Пицца', 'Суши', 'Бургеры', 'Вок', 'Десерты', 'Кофе', 'Салаты', 'Напитки'];
const groceries = [
  'Фрукты и овощи',
  'Молочные продукты',
  'Мясо и рыба',
  'Хлебобулочные изделия',
  'Замороженные продукты',
  'Напитки'
];
const restaurants = [
  'Итальянская кухня',
  'Японская кухня',
  'Американская кухня',
  'Китайская кухня',
  'Фастфуд',
  'Вегетарианская кухня'
];

export default function Search() {
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isFocused]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {isFocused ? <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" /> : null}

      <View className="border-b border-stone-300 pb-2">
        <View className="mx-4 pl-3 bg-stone-50 border border-stone-300 flex-row items-center gap-3 rounded-full mb-1">
          <Icon set="feather" name="search" />
          <TextInput
            ref={inputRef}
            placeholderTextColor="#777"
            placeholder="Поиск ресторанов и кафе"
            // value={searchQuery}
            // onChangeText={onSearchQueryChange}
            className="flex-1 py-4 leading-[17px]"
          />
        </View>
      </View>

      <ScrollView className="flex-1 bg-slate-50 py-6" contentContainerStyle={{ flexGrow: 1 }}>
        {/* <AutoScrollBadges></AutoScrollBadges> */}

        <Categories isTitleVisible={false}></Categories>

        <View className="px-6 mt-6">
          <Text className="font-bold text-2xl">Часто ищут:</Text>
        </View>

        <View className="flex-row gap-2 flex-wrap px-6 mt-3">
          {ITEMS.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              className="px-4 py-1 bg-white rounded-full border border-stone-300"
            >
              <Text className="text-xs font-bold">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 mt-8">
          <Text className="font-bold text-2xl">Популярные заведения:</Text>
        </View>

        <View className="flex-row gap-2 flex-wrap px-6 mt-3">
          {restaurants.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              className="px-4 py-1 bg-white rounded-full border border-stone-300"
            >
              <Text className="text-xs font-bold">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 mt-8">
          <Text className="font-bold text-2xl">Продукты:</Text>
        </View>

        <View className="flex-row gap-2 flex-wrap px-6 mt-3">
          {groceries.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              className="px-4 py-1 bg-white rounded-full border border-stone-300"
            >
              <Text className="text-xs font-bold">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
