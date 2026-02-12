import React, { useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import RestaurantItem from '@/components/RestaurantItem';

const FILTERS = [
  { label: 'Все', value: 'all' },
  { label: 'Рядом', value: 'nearby' },
  { label: 'Популярное', value: 'popular' },
  { label: 'Высокий рейтинг', value: 'top' },
  { label: 'Быстрая доставка', value: 'fast' }
];

export default function RestaurantsList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const allRestaurants = [...RESTAURANTS, ...RESTAURANTS2];

  // Фильтрация по поиску
  const filtered = allRestaurants.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View className="flex-1 bg-stone-100">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View className="bg-white py-4 border-b border-stone-200" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center gap-3 mb-4 border-b border-stone-200 pb-3 px-4">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="flex-row gap-1">
            <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
            <Text className="text-xl">Назад</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold mb-4 px-4">Рестораны</Text>

        {/* Поиск */}
        <View className="flex-row items-center bg-slate-50 border border-stone-300 rounded-full mx-4 px-4 gap-2">
          <Icon set="feather" name="search" size={18} color="#999" />
          <TextInput
            placeholder="Поиск ресторанов"
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
            className="flex-1 py-3 text-base leading-5"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon set="feather" name="x" size={18} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        {/* Фильтры */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-4">
          <View className="flex-row gap-2">
            {FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === filter.value ? 'border-stone-900 bg-stone-900' : 'border-stone-300 bg-white'
                }`}
              >
                <Text
                  className={`text-sm font-bold ${activeFilter === filter.value ? 'text-white' : 'text-stone-600'}`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Список */}
      {filtered.length > 0 ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 20,
            gap: 16
          }}
          renderItem={({ item }) => <RestaurantItem data={item} block />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Icon set="feather" name="search" size={48} color="#d4d4d4" />
          <Text className="text-stone-400 text-center mt-4 text-lg">Ничего не найдено</Text>
          <Text className="text-stone-400 text-center text-sm mt-1">Попробуйте изменить запрос</Text>
        </View>
      )}
    </View>
  );
}
