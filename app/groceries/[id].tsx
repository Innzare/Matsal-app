import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { GROCERY_CATEGORIES, GROCERY_PRODUCTS, GROCERY_STORES, type GroceryProduct } from '@/constants/resources';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CATEGORY_CARD_SIZE = (SCREEN_WIDTH - 48 - 36) / 4;
const PRODUCT_CARD_WIDTH = (SCREEN_WIDTH - 48 - 20) / 2.5;

// === Карточка товара (горизонтальный скролл) ===
function ProductCard({ product, onPress, onQuickAdd }: { product: GroceryProduct; onPress: () => void; onQuickAdd?: () => void }) {
  const { colors, isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-dark-surface rounded-xl border border-stone-200 dark:border-dark-border overflow-hidden"
      style={{ width: PRODUCT_CARD_WIDTH }}
    >
      <View className="relative" style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
        <Image
          source={{ uri: product.image }}
          style={{ width: '100%', height: 130 }}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <TouchableOpacity
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-dark-surface items-center justify-center"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3
          }}
          activeOpacity={0.7}
          onPress={(e) => {
            e.stopPropagation();
            onQuickAdd?.();
          }}
        >
          <Icon set="feather" name="plus" size={18} color={isDark ? colors.text : '#333'} />
        </TouchableOpacity>
      </View>
      <View className="px-2.5 py-2">
        <Text className="font-bold text-[15px] text-stone-800 dark:text-dark-text">{product.price} ₽</Text>
        <Text className="text-xs text-stone-600 dark:text-dark-muted mt-0.5" numberOfLines={2}>
          {product.name} {product.weight}
        </Text>
      </View>
    </Pressable>
  );
}

// === Модалка товара (контент для BottomSheet) ===
function ProductDetailContent({
  product,
  products,
  storeId,
  storeName
}: {
  product: GroceryProduct;
  products: GroceryProduct[];
  storeId: string;
  storeName: string;
}) {
  const [itemsCount, setItemsCount] = useState(1);
  const { addItem, setActiveRestaurant } = useCartStore();
  const { closeGlobalBottomSheet } = useBottomSheetStore();
  const { openGlobalModal } = useGlobalModalStore();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);
  const totalPrice = product.price * itemsCount;

  const handleAddToCart = () => {
    addItem(storeId, storeName, {
      id: String(product.id),
      name: `${product.name} ${product.weight}`,
      price: product.price,
      image: product.image,
      quantity: itemsCount,
      modifiers: []
    });
    closeGlobalBottomSheet();
    setActiveRestaurant(storeId);
    openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-white dark:bg-dark-bg" showsVerticalScrollIndicator={false}>
        {/* Изображение */}
        <View className="items-center justify-center py-6" style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: SCREEN_WIDTH - 80, height: 250 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>

        {/* Инфо */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-lg font-bold text-stone-800 dark:text-dark-text flex-1 mr-3">
              {product.name} {product.weight}
            </Text>
            <Text className="text-lg font-bold" style={{ color: '#16a34a' }}>
              {product.price} ₽
            </Text>
          </View>
          <Text className="text-sm text-stone-400 dark:text-dark-muted">{product.category}</Text>
        </View>

        {/* Похожие товары */}
        {similar.length > 0 && (
          <View className="mt-6 pb-10">
            <Text className="font-bold text-base text-stone-800 dark:text-dark-text px-5 mb-3">Похожие товары</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              renderItem={({ item }) => (
                <Pressable className="rounded-xl border border-stone-200 dark:border-dark-border overflow-hidden" style={{ width: 140 }}>
                  <View style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: '100%', height: 100 }}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                    />
                    <View
                      className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-white dark:bg-dark-surface items-center justify-center"
                      style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}
                    >
                      <Icon set="feather" name="plus" size={14} color={isDark ? colors.text : '#333'} />
                    </View>
                  </View>
                  <View className="p-2">
                    <Text className="font-bold text-sm dark:text-dark-text">{item.price} ₽</Text>
                    <Text className="text-xs text-stone-500 dark:text-dark-muted mt-0.5" numberOfLines={2}>
                      {item.name} {item.weight}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Нижняя панель: счётчик + кнопка */}
      <View
        className="flex-row items-center px-5 pt-3 border-t border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 4 }}
      >
        <View className="flex-row items-center gap-3 mr-4">
          <TouchableOpacity
            disabled={itemsCount <= 1}
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 dark:border-dark-border bg-stone-100 dark:bg-dark-elevated w-14 h-9 justify-center items-center"
            onPress={() => setItemsCount((prev) => prev - 1)}
            style={{ opacity: itemsCount <= 1 ? 0.4 : 1 }}
          >
            <Icon set="feather" name="minus" size={18} color={isDark ? colors.text : '#57534e'} />
          </TouchableOpacity>
          <Text className="font-bold text-lg w-5 text-center dark:text-dark-text">{itemsCount}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 dark:border-dark-border bg-stone-100 dark:bg-dark-elevated w-14 h-9 justify-center items-center"
            onPress={() => setItemsCount((prev) => prev + 1)}
          >
            <Icon set="feather" name="plus" size={18} color={isDark ? colors.text : '#57534e'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleAddToCart}
          className="flex-1 flex-row justify-center items-center py-3.5 rounded-full gap-2"
          style={{ backgroundColor: '#16a34a' }}
        >
          <Text className="text-white font-bold text-base">В корзину</Text>
          <Text className="text-white/70 font-bold text-base">{totalPrice} ₽</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// === Главный компонент ===
export default function GroceryStore() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const isFocused = useIsFocused();
  const { colors, isDark } = useTheme();

  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { carts, addItem, setActiveRestaurant } = useCartStore();
  const { openGlobalModal } = useGlobalModalStore();
  const { favoriteGroceries, toggleGroceryFavorite } = useFavoritesStore();
  const isFavorite = favoriteGroceries.includes(Number(id));

  const storeId = String(id);
  const store = GROCERY_STORES.find((s) => s.id === Number(id));
  const products = GROCERY_PRODUCTS[Number(id)] || [];

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Группируем товары по категориям
  const productsByCategory = useMemo(() => {
    const map: Record<string, GroceryProduct[]> = {};
    for (const p of products) {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    }
    return map;
  }, [products]);

  const categoryNames = useMemo(() => Object.keys(productsByCategory), [productsByCategory]);

  // Фильтр поиска
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const headerOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 80], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const quickAddToCart = (product: GroceryProduct) => {
    addItem(storeId, store?.name || '', {
      id: String(product.id),
      name: `${product.name} ${product.weight}`,
      price: product.price,
      image: product.image,
      modifiers: []
    });
  };

  const openProductDetail = (product: GroceryProduct) => {
    openGlobalBottomSheet({
      content: <ProductDetailContent product={product} products={products} storeId={String(id)} storeName={store?.name || ''} />,
      snaps: ['85%'],
      isBackgroundScalable: true,
      isIndicatorVisible: true
    });
  };

  if (!store) {
    return (
      <View className="flex-1 bg-white dark:bg-dark-bg items-center justify-center">
        <Text className="dark:text-dark-text">Магазин не найден</Text>
      </View>
    );
  }

  const visibleCategories = showAllCategories ? GROCERY_CATEGORIES : GROCERY_CATEGORIES.slice(0, 8);

  return (
    <View className="flex-1 bg-white dark:bg-dark-bg">
      {isFocused ? <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? 'light-content' : 'dark-content'} /> : null}

      {/* Фиксированный хедер */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-20 bg-white dark:bg-dark-surface border-b border-stone-100 dark:border-dark-border"
        style={[{ paddingTop: insets.top }, headerOpacity]}
      >
        <View className="h-[50px] items-center justify-center">
          <Text className="font-bold text-base dark:text-dark-text" numberOfLines={1}>
            {store.name}
          </Text>
        </View>
      </Animated.View>

      {/* Кнопки навигации */}
      <View
        className="absolute top-0 left-0 right-0 z-30 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Icon set="feather" name="arrow-left" size={24} color={isDark ? colors.text : '#333'} />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => toggleGroceryFavorite(Number(id))}
          >
            <Icon set="ion" name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? 'red' : (isDark ? colors.text : '#333')} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center" activeOpacity={0.7}>
            <Icon set="feather" name="info" size={20} color={isDark ? colors.text : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center" activeOpacity={0.7}>
            <Icon set="feather" name="shopping-bag" size={20} color={isDark ? colors.text : '#333'} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Инфо о магазине */}
        <View className="px-5 pb-4" style={{ paddingTop: insets.top + 56 }}>
          <View className="flex-row gap-3.5 mb-3.5">
            <Image
              source={{ uri: store.src }}
              style={{ width: 140, aspectRatio: 1, borderRadius: 12, borderWidth: 1, borderColor: isDark ? colors.border : '#e7e5e4' }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <View className="flex-1">
              <Text className="font-bold text-xl text-stone-900 dark:text-dark-text mb-1">{store.name}</Text>

              <View className="flex-row items-center gap-1 mt-0.5">
                <Icon set="material" name="local-shipping" size={14} color="#16a34a" />
                <Text className="text-xs font-semibold" style={{ color: '#16a34a' }}>
                  Бесплатная доставка
                </Text>
                <Text className="text-xs text-stone-400 dark:text-dark-muted ml-1">· от {store.minPrice} ₽</Text>
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-2">
                  <Icon set="materialCom" name="clock-fast" size={16} color={isDark ? colors.textMuted : '#666'} />
                  <Text className="text-sm text-stone-700 dark:text-dark-text">
                    Доставка <Text className="font-bold">{store.deliveryTime}</Text>
                  </Text>
                </View>
              </View>

              {/* Бейджи */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <View className="flex-row items-center gap-1.5 border border-stone-200 dark:border-dark-border rounded-full px-3 py-1.5 h-8">
                  <Icon set="ant" name="star" size={12} color="#f59e0b" />
                  <Text className="text-xs font-semibold text-stone-700 dark:text-dark-text">{store.rate}</Text>
                </View>

                <View className="flex-row items-center gap-1.5 border border-stone-200 dark:border-dark-border rounded-full px-3 py-1.5 h-8">
                  <Text className="text-xs font-semibold text-stone-700 dark:text-dark-text">{store.reviewsCount} отзывов</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Поиск */}
        <View className="px-5 pb-4">
          <View className="flex-row items-center rounded-full px-3.5 py-3 gap-2.5 border" style={{ backgroundColor: isDark ? colors.surfaceAlt : '#f5f5f4', borderColor: isDark ? colors.border : '#e5e7eb' }}>
            <Icon set="feather" name="search" size={20} color={isDark ? colors.textMuted : '#a8a29e'} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Поиск товаров и категорий"
              placeholderTextColor={isDark ? colors.textMuted : '#555'}
              className="flex-1 text-sm leading-4 dark:text-dark-text"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Icon set="ant" name="close" size={16} color={isDark ? colors.textMuted : '#a8a29e'} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Результаты поиска */}
        {searchResults !== null ? (
          <View className="px-5">
            <Text className="font-bold text-lg mb-3 dark:text-dark-text">
              Результаты
              <Text className="text-stone-400 dark:text-dark-muted font-normal text-sm"> · {searchResults.length}</Text>
            </Text>
            {searchResults.length > 0 ? (
              <View className="flex-row flex-wrap gap-2.5">
                {searchResults.map((product) => (
                  <Pressable
                    key={product.id}
                    onPress={() => openProductDetail(product)}
                    className="rounded-xl border border-stone-200 dark:border-dark-border overflow-hidden"
                    style={{ width: (SCREEN_WIDTH - 50) / 2 }}
                  >
                    <View style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
                      <Image
                        source={{ uri: product.image }}
                        style={{ width: '100%', height: 140 }}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                      />
                      <TouchableOpacity
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-dark-surface items-center justify-center"
                        style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                        onPress={(e) => {
                          e.stopPropagation();
                          quickAddToCart(product);
                        }}
                      >
                        <Icon set="feather" name="plus" size={18} color={isDark ? colors.text : '#333'} />
                      </TouchableOpacity>
                    </View>
                    <View className="p-2.5">
                      <Text className="font-bold text-[15px] dark:text-dark-text">{product.price} ₽</Text>
                      <Text className="text-xs text-stone-600 dark:text-dark-muted mt-0.5" numberOfLines={2}>
                        {product.name} {product.weight}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="items-center py-10">
                <Icon set="feather" name="search" size={40} color={isDark ? colors.border : '#d4d4d4'} />
                <Text className="text-stone-400 dark:text-dark-muted mt-3">Ничего не найдено</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Категории — сетка 4 колонки */}
            <View className="px-5 pt-2 mb-4">
              <View className="flex-row flex-wrap gap-3">
                {visibleCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    className="items-center w-[100%] max-w-[23%]"
                    onPress={() => router.push(`/groceries/products?storeId=${id}&categoryName=${encodeURIComponent(cat.name)}`)}
                  >
                    <View
                      className="w-full rounded-2xl items-center justify-center mb-1.5"
                      style={{
                        backgroundColor: cat.backgroundColor,
                        height: CATEGORY_CARD_SIZE
                      }}
                    >
                      <Image
                        source={{ uri: cat.image }}
                        style={{ width: CATEGORY_CARD_SIZE * 0.55, height: CATEGORY_CARD_SIZE * 0.55 }}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                      />
                    </View>
                    <Text className="text-xs font-semibold text-stone-700 dark:text-dark-text text-center" numberOfLines={2}>
                      {cat.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Показать все / скрыть */}
              {GROCERY_CATEGORIES.length > 8 && (
                <TouchableOpacity
                  className="flex-row items-center justify-center gap-1.5 py-4"
                  onPress={() => setShowAllCategories(!showAllCategories)}
                  activeOpacity={0.7}
                >
                  <Icon
                    set="feather"
                    name={showAllCategories ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={isDark ? colors.textMuted : '#57534e'}
                  />
                  <Text className="text-sm font-semibold text-stone-600 dark:text-dark-muted">
                    {showAllCategories ? 'Скрыть' : 'Все категории'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Кнопка "Все товары" */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/groceries/products?storeId=${id}`)}
              className="mx-5 mt-1 mb-4 rounded-2xl overflow-hidden"
              style={{ backgroundColor: isDark ? '#1a2a24' : '#f0fdf4' }}
            >
              <View className="flex-row items-center justify-between px-4 py-3.5">
                <View className="flex-row items-center gap-3">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center"
                    style={{ backgroundColor: '#16a34a' }}
                  >
                    <Icon set="feather" name="grid" size={20} color="#fff" />
                  </View>
                  <View>
                    <Text className="font-bold text-[15px] text-stone-800 dark:text-dark-text">Все товары</Text>
                    <Text className="text-xs text-stone-500 dark:text-dark-muted mt-0.5">{products.length} товаров в каталоге</Text>
                  </View>
                </View>
                <Icon set="feather" name="chevron-right" size={20} color="#16a34a" />
              </View>
            </TouchableOpacity>

            {/* Разделитель */}
            <View className="h-2 bg-stone-100 dark:bg-dark-elevated mb-3" />

            {/* Секции товаров по категориям */}
            {categoryNames.map((categoryName) => {
              const categoryProducts = productsByCategory[categoryName];
              return (
                <View key={categoryName} className="mb-6">
                  <View className="flex-row items-center justify-between px-5 mb-3">
                    <Text className="font-bold text-lg text-stone-900 dark:text-dark-text">{categoryName}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => router.push(`/groceries/products?storeId=${id}&categoryName=${encodeURIComponent(categoryName)}`)}
                    >
                      <Text className="text-sm font-semibold" style={{ color: '#16a34a' }}>
                        Все
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={categoryProducts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                    renderItem={({ item }) => <ProductCard product={item} onPress={() => openProductDetail(item)} onQuickAdd={() => quickAddToCart(item)} />}
                  />
                </View>
              );
            })}
          </>
        )}
      </Animated.ScrollView>

      {/* Корзина-бар */}
      {(() => {
        const cart = carts[storeId];
        if (!cart || cart.items.length === 0) return null;
        const cartItemsCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        const cartTotal = cart.items.reduce((sum, i) => {
          const modTotal = i.modifiers.reduce((s, m) => s + m.price, 0);
          return sum + (i.price + modTotal) * i.quantity;
        }, 0);
        return (
          <View
            className="absolute left-0 bottom-0 right-0 px-5 pt-2 bg-white dark:bg-dark-surface border-t border-stone-200 dark:border-dark-border z-30"
            style={{ paddingBottom: insets.bottom + 10 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setActiveRestaurant(storeId);
                openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
              }}
              className="flex-row items-center justify-between h-[56px] rounded-2xl px-5"
              style={{ backgroundColor: '#16a34a', borderCurve: 'continuous' }}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white font-bold text-sm">{cartItemsCount}</Text>
                </View>
                <Text className="text-white font-bold text-base">Открыть корзину</Text>
              </View>
              <Text className="text-white font-bold text-base">{cartTotal} ₽</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </View>
  );
}
