import { Icon } from '@/components/Icon';
import { MarqueeBadges } from '@/components/MarqueeRow';
import { Text as StyledText } from '@/components/Text';
import { TopTabs } from '@/components/top-tabs';
import { GROCERY_PRODUCTS, GROCERY_STORES, RESTAURANT_MENU, RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import type { GroceryProduct, MenuItem } from '@/constants/resources';
import { useTheme } from '@/hooks/useTheme';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ALL_RESTAURANTS = [...RESTAURANTS, ...RESTAURANTS2];
const ALL_GROCERIES = GROCERY_STORES;

function SearchResultItem({
  item,
  onPress,
  products
}: {
  item: (typeof ALL_RESTAURANTS)[0];
  onPress: () => void;
  products?: (MenuItem | GroceryProduct)[];
}) {
  const { colors } = useTheme();

  return (
    <View className="bg-white dark:bg-dark-surface border border-stone-200 dark:border-dark-border rounded-2xl overflow-hidden">
      <Pressable onPress={onPress} className="flex-row items-center p-3 active:bg-stone-50 dark:active:bg-dark-elevated">
        <View className="relative">
          <Image
            source={{ uri: item.src }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 12
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View className="absolute bottom-1.5 left-1.5 bg-amber-500 rounded px-1.5 py-0.5 flex-row items-center gap-0.5">
            <Icon set="ant" name="star" size={8} color="#fff" />
            <StyledText className="text-white text-[9px] font-bold">{item.rate}</StyledText>
          </View>
        </View>

        <View className="flex-1 ml-3.5">
          <StyledText className="font-bold text-[15px] text-stone-800 dark:text-dark-text" numberOfLines={1}>
            {item.name}
          </StyledText>
          <StyledText className="text-xs text-stone-500 dark:text-dark-muted mt-0.5">
            {item.deliveryTime} · от {item.minPrice} ₽
          </StyledText>
          <View className="flex-row items-center gap-1 mt-1">
            <Icon set="ant" name="field-time" size={14} color="#EA004B" />
            <StyledText className="text-xs font-semibold" style={{ color: '#EA004B' }}>
              {item.reviewsCount}
            </StyledText>
          </View>
        </View>

        <View className="w-9 h-9 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
          <Icon set="material" name="keyboard-arrow-right" size={22} color={colors.textMuted} />
        </View>
      </Pressable>

      {products && products.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12, gap: 8 }}
        >
          {products.map((product) => (
            <View key={product.id} className="items-center bg-stone-50 dark:bg-dark-elevated rounded-xl p-2" style={{ width: 90 }}>
              <Image
                source={{ uri: product.image }}
                style={{ width: 56, height: 56, borderRadius: 8 }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <StyledText className="text-[10px] text-stone-700 dark:text-dark-text font-semibold text-center mt-1" numberOfLines={2}>
                {product.name}
              </StyledText>
              <StyledText className="text-[10px] font-bold" style={{ color: '#EA004B' }}>
                {product.price} ₽
              </StyledText>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default function Search() {
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Пицца Маргарита', 'Суши бар', 'Кофейня рядом']);
  const [restaurantResults, setRestaurantResults] = useState<typeof ALL_RESTAURANTS>([]);
  const [groceryResults, setGroceryResults] = useState<typeof ALL_GROCERIES>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');

  const getRestaurantProducts = useCallback(
    (restaurantId: number) => {
      const menu = RESTAURANT_MENU[restaurantId] || [];
      if (!activeQuery) return menu.slice(0, 5);
      const lower = activeQuery.toLowerCase();
      const filtered = menu.filter(
        (m) => m.name.toLowerCase().includes(lower) || m.category.toLowerCase().includes(lower)
      );
      return filtered.length > 0 ? filtered : menu.slice(0, 5);
    },
    [activeQuery]
  );

  const getGroceryProducts = useCallback(
    (storeId: number) => {
      const products = GROCERY_PRODUCTS[storeId] || [];
      if (!activeQuery) return products.slice(0, 5);
      const lower = activeQuery.toLowerCase();
      const filtered = products.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower)
      );
      return filtered.length > 0 ? filtered : products.slice(0, 5);
    },
    [activeQuery]
  );

  const removeRecent = (index: number) => {
    setRecentSearches((prev) => prev.filter((_, i) => i !== index));
  };

  const performSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setSearchQuery(trimmed);

    setRecentSearches((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [trimmed, ...prev].slice(0, 10);
    });

    const lower = trimmed.toLowerCase();

    const rResults = ALL_RESTAURANTS.filter((r) => r.name.toLowerCase().includes(lower));
    setRestaurantResults(rResults.length > 0 ? rResults : ALL_RESTAURANTS);

    const gResults = ALL_GROCERIES.filter((g) => g.name.toLowerCase().includes(lower));
    setGroceryResults(gResults.length > 0 ? gResults : ALL_GROCERIES);

    setActiveQuery(trimmed);
    setIsSearchActive(true);
  }, []);

  const clearSearch = () => {
    Keyboard.dismiss();
    setSearchQuery('');
    setRestaurantResults([]);
    setGroceryResults([]);
    setActiveQuery('');
    setIsSearchActive(false);
  };

  const { colors, isDark } = useTheme();

  // Убрали автофокус - пользователь сам кликнет на input когда нужно

  if (isSearchActive) {
    return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-80}
      >
        <View className="flex-1 bg-slate-50 dark:bg-dark-bg">
          {isFocused ? <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} /> : null}

          <Tabs.Container
            headerContainerStyle={{ shadowColor: 'transparent', paddingTop: insets.top, backgroundColor: colors.bg }}
            renderTabBar={(props) => <TopTabs {...props} />}
            initialTabName="Рестораны"
          >
            <Tabs.Tab name="Рестораны" label="Рестораны">
              <Tabs.ScrollView>
                <View
                  className="px-4 pt-4 gap-3"
                  style={{ paddingBottom: insets.bottom + 140, paddingTop: insets.top + 10 }}
                >
                  <View className="mx-2 mt-2 flex-row items-center justify-between mb-2">
                    <Text className="font-bold text-lg text-stone-600 dark:text-dark-muted">Результаты по «{searchQuery}»</Text>
                    <TouchableOpacity onPress={clearSearch}>
                      <Text className="text-sm font-bold" style={{ color: '#EA004B' }}>
                        Сбросить
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {restaurantResults.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      onPress={() => router.push(`/restaurants/${item.id}`)}
                      products={getRestaurantProducts(item.id)}
                    />
                  ))}
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>

            <Tabs.Tab name="Продукты" label="Продукты">
              <Tabs.ScrollView>
                <View
                  className="px-4 pt-4 gap-3"
                  style={{ paddingBottom: insets.bottom + 140, paddingTop: insets.top + 10 }}
                >
                  <View className="mx-4 mt-2 flex-row items-center justify-between mb-2">
                    <Text className="font-bold text-lg text-stone-600 dark:text-dark-muted">Результаты по «{searchQuery}»</Text>
                    <TouchableOpacity onPress={clearSearch}>
                      <Text className="text-sm font-bold" style={{ color: '#EA004B' }}>
                        Сбросить
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {groceryResults.map((item) => (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      onPress={() => router.push(`/groceries/${item.id}`)}
                      products={getGroceryProducts(item.id)}
                    />
                  ))}
                </View>
              </Tabs.ScrollView>
            </Tabs.Tab>
          </Tabs.Container>

          <View
            className="absolute bottom-0 left-0 right-0 pb-2"
            style={{ paddingBottom: insets.bottom + 70, zIndex: 100 }}
          >
            <View
              className="mx-4 pl-5 bg-white dark:bg-dark-surface border border-stone-300 dark:border-dark-border flex-row items-center gap-3 rounded-full mb-1"
              style={{
                shadowColor: isDark ? 'transparent' : '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: isDark ? 0 : 8
              }}
            >
              <Icon set="feather" name="search" color={isDark ? colors.textSecondary : colors.iconMuted} />
              <View className="flex-1 justify-center">
                {searchQuery.length === 0 && (
                  <Text className="absolute" style={{ color: isDark ? colors.textSecondary : colors.placeholder }}>
                    Поиск ресторанов и кафе
                  </Text>
                )}
                <TextInput
                  ref={inputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => performSearch(searchQuery)}
                  returnKeyType="search"
                  className="py-5 leading-[17px] text-stone-800 dark:text-dark-text"
                  style={{ fontWeight: '700' }}
                />
              </View>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    if (isSearchActive) {
                      clearSearch();
                    } else {
                      clearSearch();
                    }
                  }}
                  activeOpacity={0.7}
                  className="w-8 h-8 rounded-full items-center justify-center bg-stone-200 dark:bg-dark-elevated"
                  hitSlop={8}
                >
                  <Icon set="feather" name="x" size={16} color={colors.iconMuted} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => performSearch(searchQuery)}
                activeOpacity={0.7}
                disabled={searchQuery.trim().length === 0}
                className="w-10 h-10 rounded-full items-center justify-center mr-2"
                style={{ backgroundColor: searchQuery.trim().length > 0 ? '#EA004B' : colors.switchTrackOff }}
              >
                <Icon set="feather" name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-dark-bg">
      {isFocused ? <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> : null}

      <View
        style={{
          borderBottomLeftRadius: 56,
          borderBottomRightRadius: 56,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.6 : 0.45,
          shadowRadius: 10,
          elevation: 20
        }}
      >
        <LinearGradient
          colors={isDark ? ['#EA004B', '#1e1e2e', '#1e1e2e'] : ['#EA004B', '#000', '#000']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 3.3 }}
          style={{
            paddingTop: insets.top + 24,
            paddingBottom: 16,
            overflow: 'hidden'
          }}
        >
          <Text className="font-bold text-center text-3xl mb-6 text-white">Что бы вы хотели сегодня?</Text>
          <MarqueeBadges onBadgePress={performSearch} />
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-90}
      >
        <View style={{ flexGrow: 1, paddingBottom: insets.bottom + 70 }}>
          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            {recentSearches.length > 0 && (
              <View className="mx-4 mt-8 rounded-2xl overflow-hidden">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-bold text-lg text-stone-600 dark:text-dark-muted">Недавно искали</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text className="text-sm font-semibold" style={{ color: '#EA004B' }}>
                      Очистить
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className=" gap-2">
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => performSearch(item)}
                      className={`bg-white dark:bg-dark-surface border border-stone-300 dark:border-dark-border rounded-full p-2 flex-row items-center px-4 py-3 ${
                        index < recentSearches.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''
                      }`}
                    >
                      <Icon set="feather" name="clock" size={16} color={colors.textMuted} />
                      <Text className="flex-1 ml-3 font-bold text-sm dark:text-dark-text">{item}</Text>
                      <TouchableOpacity className="ml-2" onPress={() => removeRecent(index)} hitSlop={8}>
                        <Icon set="feather" name="x" size={16} color={colors.iconMuted} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View className="pb-2">
            <View
              className="mx-4 pl-5 bg-white dark:bg-dark-surface border border-stone-300 dark:border-dark-border flex-row items-center gap-3 rounded-full mb-1"
              style={{
                shadowColor: isDark ? 'transparent' : '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: isDark ? 0 : 8
              }}
            >
              <Icon set="feather" name="search" color={isDark ? colors.textSecondary : colors.iconMuted} />
              <View className="flex-1 justify-center">
                {searchQuery.length === 0 && (
                  <Text className="absolute" style={{ color: isDark ? colors.textSecondary : colors.placeholder }}>
                    Поиск ресторанов и кафе
                  </Text>
                )}
                <TextInput
                  ref={inputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => performSearch(searchQuery)}
                  returnKeyType="search"
                  className="py-5 leading-[17px] text-stone-800 dark:text-dark-text"
                  style={{ fontWeight: '700' }}
                />
              </View>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    inputRef.current?.focus();
                  }}
                  activeOpacity={0.7}
                  className="w-8 h-8 rounded-full items-center justify-center bg-stone-200 dark:bg-dark-elevated"
                  hitSlop={8}
                >
                  <Icon set="feather" name="x" size={16} color={colors.iconMuted} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => performSearch(searchQuery)}
                activeOpacity={0.7}
                disabled={searchQuery.trim().length === 0}
                className="w-10 h-10 rounded-full items-center justify-center mr-2"
                style={{ backgroundColor: searchQuery.trim().length > 0 ? '#EA004B' : colors.switchTrackOff }}
              >
                <Icon set="feather" name="arrow-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
