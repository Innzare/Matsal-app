import { Icon } from '@/components/Icon';
import GroceryStoreItem from '@/components/GroceryStoreItem';
import { Text } from '@/components/Text';
import { GROCERY_PAGE_CATEGORIES, GROCERY_STORES } from '@/constants/resources';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

export default function GroceryStores() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { colors, isDark } = useTheme();

  const [activeFilterId, setActiveFilterId] = useState<number | null>(
    categoryId ? Number(categoryId) : null
  );

  const activeCategory = useMemo(
    () => GROCERY_PAGE_CATEGORIES.find((c) => c.id === activeFilterId),
    [activeFilterId]
  );

  const filteredStores = useMemo(() => {
    if (!activeFilterId) return GROCERY_STORES;
    return GROCERY_STORES.filter((s) => s.categoryId === activeFilterId);
  }, [activeFilterId]);

  const title = activeCategory?.name || 'Все магазины';

  return (
    <View className="flex-1 bg-white dark:bg-dark-bg">
      {isFocused ? (
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? 'light-content' : 'dark-content'} />
      ) : null}

      {/* Хедер */}
      <View
        className="bg-white dark:bg-dark-surface border-b border-stone-100 dark:border-dark-border"
        style={{ paddingTop: insets.top }}
      >
        <View className="h-[50px] flex-row items-center px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
            activeOpacity={0.7}
          >
            <Icon set="feather" name="arrow-left" size={24} color={isDark ? colors.text : '#333'} />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-stone-800 dark:text-dark-text flex-1 text-center mr-10" numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Фильтры-чипсы */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveFilterId(null)}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: activeFilterId === null
                ? (isDark ? '#16a34a' : '#1c1917')
                : (isDark ? colors.elevated : '#f5f5f4')
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: activeFilterId === null ? '#fff' : (isDark ? colors.textMuted : '#57534e') }}
            >
              Все
            </Text>
          </TouchableOpacity>

          {GROCERY_PAGE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => setActiveFilterId(activeFilterId === cat.id ? null : cat.id)}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: activeFilterId === cat.id
                  ? (isDark ? '#16a34a' : '#1c1917')
                  : (isDark ? colors.elevated : '#f5f5f4')
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: activeFilterId === cat.id ? '#fff' : (isDark ? colors.textMuted : '#57534e') }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Список магазинов */}
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        renderItem={({ item }) => <GroceryStoreItem data={item} variant="list" />}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Icon set="feather" name="shopping-bag" size={48} color={isDark ? colors.border : '#d4d4d4'} />
            <Text className="text-stone-400 dark:text-dark-muted mt-4 text-base">Магазины не найдены</Text>
          </View>
        }
      />
    </View>
  );
}