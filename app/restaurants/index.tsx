import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable
} from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATEGORIES, RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import RestaurantItem from '@/components/RestaurantItem';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useTheme } from '@/hooks/useTheme';

const SORT_OPTIONS = [
  { label: 'По умолчанию', value: 'default', icon: 'menu' },
  { label: 'Рядом', value: 'nearby', icon: 'map-pin' },
  { label: 'Популярное', value: 'popular', icon: 'trending-up' },
  { label: 'Высокий рейтинг', value: 'top', icon: 'star' },
  { label: 'Быстрая доставка', value: 'fast', icon: 'zap' }
];

function SortSheetContent({
  activeSort,
  onSelect
}: {
  activeSort: string;
  onSelect: (value: string) => void;
}) {
  const { closeGlobalBottomSheet } = useBottomSheetStore();
  const { colors, isDark } = useTheme();

  return (
    <View className="px-4 pb-8">
      <Text className="text-lg font-bold mb-4 text-stone-800 dark:text-dark-text">Сортировка</Text>

      {SORT_OPTIONS.map((option, index) => {
        const isActive = activeSort === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              onSelect(option.value);
              closeGlobalBottomSheet();
            }}
            className={`flex-row items-center justify-between py-4 ${
              index < SORT_OPTIONS.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: isActive ? '#EA004B15' : (isDark ? colors.elevated : '#f3f4f6') }}
              >
                <Icon set="feather" name={option.icon as any} size={17} color={isActive ? '#EA004B' : (isDark ? colors.textSecondary : '#555')} />
              </View>
              <Text
                className="text-base"
                style={{ color: isActive ? '#EA004B' : (isDark ? colors.text : '#1c1c1e'), fontWeight: isActive ? '600' : '400' }}
              >
                {option.label}
              </Text>
            </View>

            {isActive && <Icon set="feather" name="check" size={18} color="#EA004B" />}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function RestaurantsList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { colors, isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [activeSort, setActiveSort] = useState('default');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categoryId ? Number(categoryId) : null
  );

  const allRestaurants = [...RESTAURANTS, ...RESTAURANTS2];

  const getMinDeliveryTime = (s: string) => parseInt(s.split('-')[0]) || 0;
  const getReviewsCount = (s: string) => parseInt(s.replace('+', '').replace(/\D/g, '')) || 0;

  const sorted = (() => {
    const list = allRestaurants.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
    switch (activeSort) {
      case 'top':
        return [...list].sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate));
      case 'popular':
        return [...list].sort((a, b) => getReviewsCount(b.reviewsCount) - getReviewsCount(a.reviewsCount));
      case 'fast':
        return [...list].sort((a, b) => getMinDeliveryTime(a.deliveryTime) - getMinDeliveryTime(b.deliveryTime));
      default:
        return list;
    }
  })();

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === activeSort)?.label || '';

  const onCategoryPress = (id: number | null) => {
    setActiveCategoryId(activeCategoryId === id ? null : id);
  };

  const openSortSheet = () => {
    openGlobalBottomSheet({
      content: <SortSheetContent activeSort={activeSort} onSelect={setActiveSort} />,
      snaps: ['45%'],
      isIndicatorVisible: true
    });
  };

  const pageTitle =
    activeCategoryId !== null
      ? CATEGORIES.find((c) => c.id === activeCategoryId)?.name ?? 'Рестораны'
      : 'Рестораны';

  return (
    <View className="flex-1 bg-stone-100 dark:bg-dark-bg">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View className="bg-white dark:bg-dark-surface" style={{ paddingTop: insets.top }}>
        {/* Верхняя строка: назад + заголовок */}
        <View className="flex-row items-center gap-1 px-3 pt-4 pb-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center rounded-full"
          >
            <Icon set="material" name="keyboard-arrow-left" size={26} color={isDark ? colors.text : '#1c1c1e'} />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-stone-900 dark:text-dark-text flex-1">{pageTitle}</Text>
        </View>

        {/* Поиск */}
        <View className="flex-row items-center bg-stone-100 rounded-xl mx-4 px-3 gap-2 mb-3" style={{ backgroundColor: isDark ? colors.surfaceAlt : '#f5f5f4' }}>
          <Icon set="feather" name="search" size={17} color={isDark ? colors.textMuted : '#999'} />
          <TextInput
            placeholder="Поиск ресторанов"
            placeholderTextColor={isDark ? colors.textMuted : '#aaa'}
            value={search}
            onChangeText={setSearch}
            className="flex-1 py-3 text-base leading-5 text-stone-900 dark:text-dark-text"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} className="p-1">
              <Icon set="feather" name="x" size={16} color={isDark ? colors.textMuted : '#999'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Категории + кнопка сортировки */}
        <View className="flex-row items-center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 2 }}
            style={{ flex: 1 }}
          >
            {/* Чип "Все" */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveCategoryId(null)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: activeCategoryId === null ? (isDark ? '#EA004B' : '#1c1c1e') : (isDark ? colors.surfaceAlt : '#f3f4f6'),
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: activeCategoryId === null ? '#fff' : (isDark ? colors.text : '#555') }}
              >
                Все
              </Text>
            </TouchableOpacity>

            {CATEGORIES.map((category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.7}
                  onPress={() => onCategoryPress(category.id)}
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: isActive ? (isDark ? '#EA004B' : '#1c1c1e') : (isDark ? colors.surfaceAlt : '#f3f4f6') }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: isActive ? '#fff' : (isDark ? colors.text : '#555') }}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Кнопка сортировки */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openSortSheet}
            className="flex-row items-center gap-1 mx-3 rounded-full px-3 py-2"
            style={{ flexShrink: 0, backgroundColor: isDark ? colors.surfaceAlt : '#f5f5f4' }}
          >
            <Icon set="feather" name="sliders" size={15} color={isDark ? colors.text : '#1c1c1e'} />
          </TouchableOpacity>
        </View>

        <View className="h-[1px] bg-stone-100 dark:bg-dark-border mt-3" />
      </View>

      {/* Инфо-строка */}
      <View className="flex-row items-center justify-between px-4 py-2.5">
        <Text className="text-xs text-stone-400 dark:text-dark-muted">
          {sorted.length} {sorted.length === 1 ? 'ресторан' : 'ресторанов'}
        </Text>

        {activeSort !== 'default' && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveSort('default')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs font-semibold" style={{ color: '#EA004B' }}>
              {activeSortLabel}
            </Text>
            <Icon set="feather" name="x" size={11} color="#EA004B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Список ресторанов */}
      {sorted.length > 0 ? (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
            gap: 16
          }}
          renderItem={({ item }) => <RestaurantItem data={item} block />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Icon set="feather" name="search" size={48} color={isDark ? colors.border : '#d4d4d4'} />
          <Text className="text-stone-400 dark:text-dark-muted text-center mt-4 text-lg">Ничего не найдено</Text>
          <Text className="text-stone-400 dark:text-dark-muted text-center text-sm mt-1">
            Попробуйте изменить запрос или категорию
          </Text>
        </View>
      )}
    </View>
  );
}