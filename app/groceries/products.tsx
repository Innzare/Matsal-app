import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import {
  GROCERY_CATEGORIES,
  GROCERY_PRODUCTS,
  GROCERY_STORES,
  type GroceryProduct
} from '@/constants/resources';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useCartStore } from '@/store/useCartStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (SCREEN_WIDTH - 48 - 10) / 2;

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
      <ScrollView className="flex-1 bg-white dark:bg-dark-surface" showsVerticalScrollIndicator={false}>
        <View className="items-center justify-center py-6" style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: SCREEN_WIDTH - 80, height: 250 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>

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

      <View
        className="flex-row items-center px-5 pt-3 border-t border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface"
        style={{ paddingBottom: insets.bottom + 4 }}
      >
        <View className="flex-row items-center gap-3 mr-4">
          <TouchableOpacity
            disabled={itemsCount <= 1}
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 dark:border-dark-border w-14 h-9 justify-center items-center"
            style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4', opacity: itemsCount <= 1 ? 0.4 : 1 }}
            onPress={() => setItemsCount((prev) => prev - 1)}
          >
            <Icon set="feather" name="minus" size={18} color={isDark ? colors.text : '#57534e'} />
          </TouchableOpacity>
          <Text className="font-bold text-lg w-5 text-center dark:text-dark-text">{itemsCount}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 dark:border-dark-border w-14 h-9 justify-center items-center"
            style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4' }}
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

export default function GroceryProducts() {
  const { storeId, categoryName } = useLocalSearchParams<{ storeId: string; categoryName?: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { carts, addItem, setActiveRestaurant } = useCartStore();
  const { openGlobalModal } = useGlobalModalStore();
  const { colors, isDark } = useTheme();

  const store = GROCERY_STORES.find((s) => s.id === Number(storeId));
  const allProducts = GROCERY_PRODUCTS[Number(storeId)] || [];
  const sid = String(storeId);

  const [activeCategory, setActiveCategory] = useState<string | null>(categoryName || null);

  const availableCategories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category));
    return GROCERY_CATEGORIES.filter((c) => cats.has(c.name));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return allProducts;
    return allProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory, allProducts]);

  const quickAddToCart = (product: GroceryProduct) => {
    addItem(sid, store?.name || '', {
      id: String(product.id),
      name: `${product.name} ${product.weight}`,
      price: product.price,
      image: product.image,
      modifiers: []
    });
  };

  const openProductDetail = (product: GroceryProduct) => {
    openGlobalBottomSheet({
      content: <ProductDetailContent product={product} products={allProducts} storeId={sid} storeName={store?.name || ''} />,
      snaps: ['85%'],
      isBackgroundScalable: true,
      isIndicatorVisible: true
    });
  };

  const title = activeCategory || store?.name || 'Товары';

  return (
    <View className="flex-1 bg-white dark:bg-dark-bg">
      {isFocused ? (
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? 'light-content' : 'dark-content'} />
      ) : null}

      {/* Хедер */}
      <View className="bg-white dark:bg-dark-surface border-b border-stone-100 dark:border-dark-border" style={{ paddingTop: insets.top }}>
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
            onPress={() => setActiveCategory(null)}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: activeCategory === null ? (isDark ? '#16a34a' : '#1c1917') : (isDark ? colors.surfaceAlt : '#f5f5f4')
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: activeCategory === null ? '#fff' : (isDark ? colors.text : '#57534e') }}
            >
              Все
            </Text>
          </TouchableOpacity>

          {availableCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: activeCategory === cat.name ? (isDark ? '#16a34a' : '#1c1917') : (isDark ? colors.surfaceAlt : '#f5f5f4')
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: activeCategory === cat.name ? '#fff' : (isDark ? colors.text : '#57534e') }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Сетка товаров */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 80 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openProductDetail(item)}
            className="bg-white dark:bg-dark-surface rounded-xl border border-stone-200 dark:border-dark-border overflow-hidden"
            style={{ width: PRODUCT_CARD_WIDTH }}
          >
            <View className="relative" style={{ backgroundColor: isDark ? colors.elevated : '#f8f8f8' }}>
              <Image
                source={{ uri: item.image }}
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
                  quickAddToCart(item);
                }}
              >
                <Icon set="feather" name="plus" size={18} color={isDark ? colors.text : '#333'} />
              </TouchableOpacity>
            </View>
            <View className="px-2.5 py-2">
              <Text className="font-bold text-[15px] text-stone-800 dark:text-dark-text">{item.price} ₽</Text>
              <Text className="text-xs text-stone-600 dark:text-dark-muted mt-0.5" numberOfLines={2}>
                {item.name} {item.weight}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center py-20">
            <Icon set="feather" name="package" size={48} color={isDark ? colors.border : '#d4d4d4'} />
            <Text className="text-stone-400 dark:text-dark-muted mt-4 text-base">Товары не найдены</Text>
          </View>
        }
      />

      {/* Корзина-бар */}
      {(() => {
        const cart = carts[sid];
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
                setActiveRestaurant(sid);
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
