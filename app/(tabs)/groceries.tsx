import { Icon } from '@/components/Icon';
import GroceryStoreItem from '@/components/GroceryStoreItem';
import { Text } from '@/components/Text';
import { GROCERY_PAGE_CATEGORIES, GROCERY_PRODUCTS, GROCERY_STORES } from '@/constants/resources';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useAddressesStore } from '@/store/useAddressesStore';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import Addresses from '@/components/GlobalModal/Addresses';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  LinearTransition,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { GroceryProduct } from '@/constants/resources';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;

// === Промо-слайдер ===
const PROMO_SLIDES = [
  {
    id: '1',
    title: 'Сезонные фрукты',
    subtitle: 'Свежие фрукты и овощи со скидкой',
    bgColor: '#16a34a',
    icon: { set: 'materialCom', name: 'fruit-watermelon' }
  },
  {
    id: '2',
    title: 'Бесплатная доставка',
    subtitle: 'На первый заказ от 500 ₽',
    bgColor: '#0d9488',
    icon: { set: 'materialCom', name: 'truck-delivery-outline' }
  },
  {
    id: '3',
    title: 'Скидки до 30%',
    subtitle: 'На молочные продукты',
    bgColor: '#059669',
    icon: { set: 'materialCom', name: 'sale' }
  }
];

const SLIDE_H_PADDING = 20;
const SLIDE_GAP = 10;
const SLIDE_WIDTH = SCREEN_WIDTH - SLIDE_H_PADDING * 2;
const PROMO_SNAP = SLIDE_WIDTH + SLIDE_GAP;
const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 18;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function PromoDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * PROMO_SNAP, index * PROMO_SNAP, (index + 1) * PROMO_SNAP];
    const width = interpolate(scrollX.value, input, [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, input, [0.4, 1, 0.4], Extrapolation.CLAMP);
    return { width, opacity };
  });

  return (
    <Animated.View
      style={[{ height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#fff', marginHorizontal: 2.5 }, style]}
    />
  );
}

function GroceryPromoBanner() {
  const promoScrollX = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);
  const activeIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeIdx.current + 1) % PROMO_SLIDES.length;
      activeIdx.current = next;
      scrollRef.current?.scrollTo({ x: next * PROMO_SNAP, animated: true });
    }, 4000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAuto]);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={PROMO_SNAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SLIDE_H_PADDING }}
        onScroll={(e) => {
          promoScrollX.value = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onScrollEndDrag={() => startAuto()}
        onMomentumScrollEnd={(e) => {
          activeIdx.current = Math.round(e.nativeEvent.contentOffset.x / PROMO_SNAP);
        }}
      >
        {PROMO_SLIDES.map((item, idx) => (
          <Pressable
            key={item.id}
            style={{
              width: SLIDE_WIDTH,
              height: 80,
              marginRight: idx < PROMO_SLIDES.length - 1 ? SLIDE_GAP : 0,
              borderRadius: 16,
              backgroundColor: 'transparent',
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
              <Text className="text-white/70 text-sm">{item.subtitle}</Text>
            </View>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon set={item.icon.set} name={item.icon.name} size={28} color="rgba(255,255,255,0.9)" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View className="flex-row justify-center items-center mt-2.5 mb-1">
        {PROMO_SLIDES.map((_, i) => (
          <PromoDot key={i} index={i} scrollX={promoScrollX} />
        ))}
      </View>
    </View>
  );
}

const CONTENT_SECTION = {
  CATEGORIES: 'CATEGORIES',
  FAVORITE_STORES: 'FAVORITE_STORES',
  POPULAR_SHOPS: 'POPULAR_SHOPS',
  SHOPS_WITH_PRODUCTS: 'SHOPS_WITH_PRODUCTS',
  ALL_STORES: 'ALL_STORES'
};

const SECTIONS = [
  CONTENT_SECTION.CATEGORIES,
  CONTENT_SECTION.FAVORITE_STORES,
  CONTENT_SECTION.POPULAR_SHOPS,
  CONTENT_SECTION.SHOPS_WITH_PRODUCTS,
  CONTENT_SECTION.ALL_STORES
];

function ProductPreviewCard({ product }: { product: GroceryProduct }) {
  return (
    <View className="bg-white rounded-xl border border-stone-200 overflow-hidden" style={{ width: 140 }}>
      <Image
        source={{ uri: product.image }}
        style={{ width: '100%', height: 110 }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View className="p-2.5">
        <Text className="font-bold text-sm text-stone-800">{product.price} ₽</Text>
        <Text className="text-xs text-stone-600 mt-0.5" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-[11px] text-stone-400 mt-0.5">{product.weight}</Text>
      </View>
    </View>
  );
}

export default function Groceries() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();
  const flatScrollRef = useRef<FlatList<any>>(null);

  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { openGlobalModal } = useGlobalModalStore();
  const { activeOrdersCount } = useOrdersStore();
  const { unreadCount } = useNotificationsStore();
  const { getActiveAddress } = useAddressesStore();

  const rippleProgress = useSharedValue(0);
  useEffect(() => {
    if (activeOrdersCount > 0) {
      rippleProgress.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
    } else {
      rippleProgress.value = 0;
    }
  }, [activeOrdersCount]);
  const rippleStyle = useAnimatedStyle(() => ({
    opacity: 1 - rippleProgress.value,
    transform: [{ scale: 1 + rippleProgress.value * 2.5 }],
  }));
  const { favoriteGroceries } = useFavoritesStore();
  const favoriteStores = useMemo(
    () => GROCERY_STORES.filter((s) => favoriteGroceries.includes(s.id)),
    [favoriteGroceries]
  );
  const activeAddress = getActiveAddress();

  const isAndroid = Platform.OS === 'android';

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useSharedValue(0);
  const headerOffset = useSharedValue(0);
  const addressOpacity = useSharedValue(1);
  const isScrolledUp = useSharedValue(true);
  const isScrollEnd = useSharedValue(false);
  const isScrollViewMinPosition = useSharedValue(true);
  const animation = useSharedValue(1);

  const SCROLL_MAX = 250;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const prevY = scrollY.value;
      scrollY.value = Math.max(0, event.contentOffset.y);

      const diff = event.contentOffset.y - prevY;
      headerOffset.value = clamp(headerOffset.value + diff, 0, SCROLL_MAX);

      const { contentOffset, contentSize, layoutMeasurement } = event;
      const isEndReached = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
      isScrollEnd.value = isEndReached;

      if (scrollY.value <= 0 && !isScrollViewMinPosition.value) {
        isScrollViewMinPosition.value = true;
      }
      if (scrollY.value > 1 && isScrollViewMinPosition.value) {
        isScrollViewMinPosition.value = false;
      }

      if (
        scrollY.value > prevY &&
        scrollY.value > HEADER_MAX_HEIGHT &&
        isScrolledUp.value &&
        addressOpacity.value !== 0
      ) {
        isScrolledUp.value = false;
        addressOpacity.value = withTiming(0, { duration: 200 });
      } else if (scrollY.value < prevY && !isScrollEnd.value && !isScrolledUp.value && addressOpacity.value === 0) {
        isScrolledUp.value = true;
        addressOpacity.value = withTiming(1, { duration: 200 });
      }
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const onAddressPress = () => {
    openGlobalBottomSheet({
      content: <Addresses />,
      snaps: ['80%'],
      isBackgroundScalable: true,
      isIndicatorVisible: false
    });
  };

  const onCategoryPress = (id: number) => {
    router.push(`/groceries/stores?categoryId=${id}`);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      headerOffset.value,
      [120, 250],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );
    return { height };
  });

  const addressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addressOpacity.value,
    transform: [{ translateY: (1 - addressOpacity.value) * -100 }]
  }));

  const addressAnimatedStyle2 = useAnimatedStyle(() => {
    const translateY = interpolate(headerOffset.value, [120, 250], [0, -50], Extrapolation.CLAMP);
    const opacity = interpolate(headerOffset.value, [120, 150, 250], [1, 0.5, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  const searchInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - addressOpacity.value) * -55 }]
  }));

  const searchInputAnimatedStyle2 = useAnimatedStyle(() => {
    const translateY = interpolate(headerOffset.value, [120, 250], [0, -HEADER_MIN_HEIGHT / 1.5], Extrapolation.CLAMP);
    return { transform: [{ translateY }] };
  });

  const searchInputScaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(animation.value) }]
  }));

  const hiddenBlockHeight = useDerivedValue(() => {
    const h = isScrolledUp.value ? 120 : 65;
    return withTiming(h, { duration: 200 });
  });

  const hiddenBlockStyles = useAnimatedStyle(() => ({
    height: hiddenBlockHeight.value
  }));

  const scrollSpaces = useAnimatedStyle(() => ({
    transform: [{ translateY: isScrollViewMinPosition.value ? HEADER_MAX_HEIGHT : 0 }],
    paddingTop: isScrollViewMinPosition.value ? 0 : HEADER_MAX_HEIGHT,
    backgroundColor: isScrollViewMinPosition.value ? '#fff' : ''
  }));

  // === СЕКЦИИ ===

  const renderCategories = () => {
    return (
      <View className="mt-5">
        <Text className="text-xl text-stone-800 text-left font-bold mb-3 px-6">Категории</Text>
        <FlatList
          data={GROCERY_PAGE_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 4 }}
          renderItem={({ item }) => {
            const isActive = activeCategoryId === item.id;
            return (
              <Pressable
                onPress={() => onCategoryPress(item.id)}
                className="items-center gap-2 active:scale-95 transition-transform duration-150"
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    backgroundColor: item.backgroundColor || '#f3f3f3',
                    borderWidth: isActive ? 2 : 0,
                    borderColor: isActive ? '#3d3d3d' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 32, height: 32 }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </View>
                <Text className="text-[11px] font-semibold text-center" style={{ width: 90 }} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
        <View className="py-1 bg-stone-100 my-5" />
      </View>
    );
  };

  const renderFavoriteStores = () => {
    if (favoriteStores.length === 0) return null;
    return (
      <View>
        <View className="flex-row items-center justify-between px-6 mb-3">
          <Text className="text-xl text-stone-800 font-bold">Избранное</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)/favourites')}>
            <Text className="text-sm font-semibold" style={{ color: '#16a34a' }}>Все</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={favoriteStores}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}
          renderItem={({ item }) => <GroceryStoreItem data={item} variant="compact" />}
        />
        <View className="py-1 bg-stone-100 my-5" />
      </View>
    );
  };

  const renderPopularShops = () => {
    return (
      <View>
        <Text className="text-xl text-stone-800 text-left font-bold mb-3 px-6">Популярные магазины</Text>
        <FlatList
          data={GROCERY_STORES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 22, gap: 12 }}
          renderItem={({ item }) => <GroceryStoreItem data={item} variant="compact" />}
        />
        <View className="py-1 bg-stone-100 my-5" />
      </View>
    );
  };

  const renderShopsWithProducts = () => {
    const stores = GROCERY_STORES.slice(0, 3);
    return (
      <View>
        <Text className="text-xl text-stone-800 text-left font-bold mb-2 px-6">Магазины со скидками</Text>
        {stores.map((store) => {
          const products = GROCERY_PRODUCTS[store.id] || [];
          return (
            <View key={store.id} className="mb-4">
              <GroceryStoreItem data={store} variant="list" />
              {products.length > 0 && (
                <FlatList
                  data={products.slice(0, 5)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ paddingHorizontal: 22, gap: 10, paddingVertical: 8 }}
                  renderItem={({ item }) => <ProductPreviewCard product={item} />}
                />
              )}
            </View>
          );
        })}
        <View className="py-1 bg-stone-100 my-4" />
      </View>
    );
  };

  const renderAllStores = () => {
    return (
      <View>
        <Text className="text-xl text-stone-800 text-left font-bold mb-3 px-6">Все магазины</Text>

        {/* Фильтры-чипсы */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, marginBottom: 8 }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveCategoryId(null)}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: activeCategoryId === null ? '#1c1917' : '#f5f5f4'
            }}
          >
            <Text className="text-sm font-semibold" style={{ color: activeCategoryId === null ? '#fff' : '#57534e' }}>
              Все
            </Text>
          </TouchableOpacity>

          {GROCERY_PAGE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => setActiveCategoryId(activeCategoryId === cat.id ? null : cat.id)}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: activeCategoryId === cat.id ? '#1c1917' : '#f5f5f4'
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: activeCategoryId === cat.id ? '#fff' : '#57534e' }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Список магазинов */}
        {GROCERY_STORES.map((store) => (
          <GroceryStoreItem key={store.id} data={store} variant="list" />
        ))}
      </View>
    );
  };

  const renderContent = (type: string, index: number) => {
    let content = null;

    switch (type) {
      case CONTENT_SECTION.CATEGORIES:
        content = renderCategories();
        break;

      case CONTENT_SECTION.FAVORITE_STORES:
        content = renderFavoriteStores();
        break;

      case CONTENT_SECTION.POPULAR_SHOPS:
        content = renderPopularShops();
        break;

      case CONTENT_SECTION.SHOPS_WITH_PRODUCTS:
        content = renderShopsWithProducts();
        break;

      case CONTENT_SECTION.ALL_STORES:
        content = renderAllStores();
        break;

      default:
        content = <View />;
        break;
    }

    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: index === 0 ? 15 : 0,
          borderTopRightRadius: index === 0 ? 15 : 0
        }}
      >
        {content}
      </View>
    );
  };

  return (
    <View className="flex-1 relative" style={{ paddingTop: insets.top }}>
      {isFocused ? <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> : null}

      <LinearGradient
        colors={['#16a34a', '#000', '#000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.3 }}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, height: '100%' }}
      />

      <Animated.View style={[isAndroid ? headerAnimatedStyle : hiddenBlockStyles]}>
        <Animated.View
          className="px-6 mb-6 flex-row justify-between items-center gap-2"
          style={isAndroid ? addressAnimatedStyle2 : addressAnimatedStyle}
        >
          <TouchableOpacity className="flex-row items-center flex-1 gap-2" onPress={onAddressPress} activeOpacity={0.7}>
            <View className="flex-row items-center gap-2 flex-1">
              <View className="pt-0.5">
                <Icon set="feather" name="map-pin" size={24} color="white" />
              </View>
              <View>
                <Text className="font-bold text-white text-sm">{activeAddress?.streetWithHouse}</Text>
                <Text className="text-xs text-green-200">{activeAddress?.city}</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-down" color="white" />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <Pressable
              className="w-10 h-10 rounded-full justify-center items-center"
              onPress={() => openGlobalModal(GLOBAL_MODAL_CONTENT.ORDERS)}
            >
              <Icon set="ion" name="receipt-outline" size={22} color="white" />
              {activeOrdersCount > 0 && (
                <View className="absolute top-1 right-1 w-3 h-3 items-center justify-center">
                  <Animated.View
                    style={rippleStyle}
                    className="absolute w-3 h-3 rounded-full bg-orange-500"
                  />
                  <View className="w-2.5 h-2.5 rounded-full bg-orange-500 border-[1.5px] border-white" />
                </View>
              )}
            </Pressable>
            <Pressable
              className="w-10 h-10 rounded-full justify-center items-center"
              onPress={() => router.push('/notifications')}
            >
              <Icon set="ion" name="notifications-outline" size={24} color="white" />
              {unreadCount > 0 && (
                <View className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-[1.5px] border-white" />
              )}
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row gap-3 mx-4"
          style={isAndroid ? searchInputAnimatedStyle2 : searchInputAnimatedStyle}
        >
          <AnimatedPressable
            className="pl-3 py-1 bg-white flex-row items-center gap-3 rounded-full flex-1"
            layout={LinearTransition}
            onPress={() => router.push('/search')}
            onPressIn={() => {
              animation.value = 0.95;
            }}
            onPressOut={() => {
              animation.value = 1;
            }}
            style={[searchInputScaleAnimatedStyle]}
          >
            <Icon set="feather" name="search" />
            <TextInput
              pointerEvents="none"
              placeholderTextColor="#777777"
              placeholder="Поиск продуктов и магазинов"
              className="flex-1 py-3 leading-[17px]"
            />
          </AnimatedPressable>
        </Animated.View>

        <View className="mt-4" style={{ paddingTop: 8, paddingBottom: 6 }}>
          <GroceryPromoBanner />
        </View>
      </Animated.View>

      <AnimatedFlatList
        ref={flatScrollRef}
        data={SECTIONS}
        keyExtractor={(_: any, index: number) => index.toString()}
        renderItem={({ item, index }: any) => renderContent(item, index)}
        initialNumToRender={1}
        className="rounded-t-2xl relative"
        style={[
          isAndroid
            ? { transform: [{ translateY: 5 }], paddingTop: HEADER_MAX_HEIGHT, backgroundColor: 'transparent' }
            : scrollSpaces
        ]}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        contentInsetAdjustmentBehavior="never"
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        overScrollMode="never"
        contentContainerStyle={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: isAndroid ? 220 : 120
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="black"
            colors={['black']}
            progressBackgroundColor="black"
          />
        }
      />
    </View>
  );
}
