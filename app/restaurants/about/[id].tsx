import React from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';

export default function AboutRestaurant() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const restarauntsList = [...RESTAURANTS, ...RESTAURANTS2];
  const restaurant = restarauntsList.find((item) => Number(item.id) === Number(id));

  // Моковые данные (потом с бэкенда)
  const info = {
    description:
      'Уютный ресторан с богатым выбором блюд. Мы готовим из свежих продуктов и доставляем заказы в кратчайшие сроки.',
    address: 'ул. Пушкина, д. 10',
    phone: '+7 (999) 123-45-67',
    schedule: [
      { day: 'Пн-Пт', time: '09:00 — 23:00' },
      { day: 'Сб', time: '10:00 — 23:00' },
      { day: 'Вс', time: '10:00 — 22:00' }
    ],
    minOrder: '500 ₽',
    deliveryPrice: 'от 100 ₽',
    deliveryTime: '35-40 мин',
    rating: 4.5,
    reviewsCount: 128
  };

  return (
    <View className="flex-1 bg-stone-100">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View
        className="bg-white flex-row items-center px-4 py-3 border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="flex-row items-center gap-1">
          <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
          <Text className="text-lg">Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Название + описание */}
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden p-5">
          <Text className="text-2xl font-bold mb-2">{restaurant?.name}</Text>
          <Text className="text-stone-500 leading-6">{info.description}</Text>
        </View>

        {/* Рейтинг + отзывы */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(`/restaurants/reviews/${id}`)}
          className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden"
        >
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-amber-50 items-center justify-center">
                <Icon set="ant" name="star" size={24} color="#f59e0b" />
              </View>
              <View>
                <Text className="text-xl font-bold">{info.rating}</Text>
                <Text className="text-stone-500 text-sm">{info.reviewsCount} отзывов</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </View>
        </TouchableOpacity>

        {/* Информация о доставке */}
        <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden">
          <View className="p-5 pb-2">
            <Text className="text-lg font-bold mb-3">Доставка</Text>
          </View>

          <View className="flex-row items-center gap-4 px-5 pb-4 border-b border-stone-100">
            <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
              <Icon set="feather" name="clock" size={20} color="#EA004B" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-stone-700">Время доставки</Text>
              <Text className="text-stone-500 text-sm">{info.deliveryTime}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 px-5 py-4 border-b border-stone-100">
            <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
              <Icon set="feather" name="truck" size={20} color="#EA004B" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-stone-700">Стоимость доставки</Text>
              <Text className="text-stone-500 text-sm">{info.deliveryPrice}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 px-5 py-4">
            <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
              <Icon set="feather" name="shopping-bag" size={20} color="#EA004B" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-stone-700">Мин. сумма заказа</Text>
              <Text className="text-stone-500 text-sm">{info.minOrder}</Text>
            </View>
          </View>
        </View>

        {/* График работы */}
        <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden">
          <View className="p-5 pb-2">
            <Text className="text-lg font-bold mb-3">Часы работы</Text>
          </View>

          {info.schedule.map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between px-5 py-3 ${
                index < info.schedule.length - 1 ? 'border-b border-stone-100' : ''
              }`}
            >
              <Text className="font-bold text-stone-600">{item.day}</Text>
              <Text className="text-stone-500">{item.time}</Text>
            </View>
          ))}
        </View>

        {/* Контакты */}
        <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Linking.openURL(`tel:${info.phone}`)}
            className="flex-row items-center justify-between p-4 border-b border-stone-100"
          >
            <View className="flex-row items-center gap-3">
              <Icon set="feather" name="phone" size={20} color="#EA004B" />
              <View>
                <Text className="font-bold text-stone-600">Позвонить</Text>
                <Text className="text-stone-500 text-sm">{info.phone}</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <Icon set="feather" name="map-pin" size={20} color="#EA004B" />
              <View>
                <Text className="font-bold text-stone-600">Адрес</Text>
                <Text className="text-stone-500 text-sm">{info.address}</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
