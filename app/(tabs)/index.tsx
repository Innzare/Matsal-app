import AllRestaurantsList from '@/components/AllRestaurantsList';
import Cart from '@/components/Cart';
import Categories from '@/components/Categories';
import { Icon } from '@/components/Icon';
import PopularBrands from '@/components/PopularBrands';
import RestaurantsListPreview from '@/components/RestaurantsListPreview';
import { Text } from '@/components/Text';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { CATEGORIES, POPULAR_BRANDS, RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  Layout,
  LinearTransition,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleTabs from '@/components/Tabs/Tabs';
import { Tabs } from 'react-native-collapsible-tab-view';
import Food from '@/components/Food';
import Addresses from '@/components/GlobalModal/Addresses';
import { TopTabs } from '@/components/top-tabs';
import { useAddressesStore } from '@/store/useAddressesStore';
import { Skeleton } from '@/components/Skeleton';
import PromoBanner from '@/components/PromoBanner';

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
// const ADDRESS_HIDE_Y = 120;

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTabsFlatList = Animated.createAnimatedComponent(Tabs.FlatList);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FOOD_TYPE = {
  FOOD: 'FOOD',
  GROCERIES: 'GROCERIES'
};

export default function SearchScreen() {
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const flatScrollRef = useRef<FlatList<any>>(null);
  // const pagerRef = useRef(null);
  // const [index, setIndex] = useState(0);
  // const [pageHeights, setPageHeights] = useState<any>({});

  // const handleLayout = (page: any, event: any) => {
  //   const height = event.nativeEvent.layout.height;
  //   setPageHeights((prev) => ({ ...prev, [page]: height }));
  // };

  const { openGlobalModal } = useGlobalModalStore();
  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { activeOrdersCount } = useOrdersStore();
  const { unreadCount } = useNotificationsStore();

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
  const { getActiveAddress } = useAddressesStore();
  const activeAddress = getActiveAddress();

  const isAndroid = Platform.OS === 'android';

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [foodType, setFoodType] = useState(FOOD_TYPE.FOOD);

  const addressOpacity = useSharedValue(1);

  // const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const isScrollViewMinPosition = useSharedValue(true);
  // const [isScrolledUp, setIsScrolledUp] = useState(false);
  const isScrolledUp = useSharedValue(true);
  // const [isScrollEnd, setIsScrollEnd] = useState(false);
  const isScrollEnd = useSharedValue(false);
  // const isAnimating = useSharedValue(false);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const scrollToY = (offset: number) => {
    flatScrollRef.current?.scrollToOffset({ offset, animated: true });
  };

  const headerOffset = useSharedValue(0);
  const showFoodTypeChangeButtonValue = useSharedValue(false);

  // const SCROLL_MIN = 0;
  const SCROLL_MAX = 250;

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const prevY = scrollY.value;

      // scrollY.value = Math.max(SCROLL_MIN, Math.min(event.contentOffset.y, SCROLL_MAX));

      scrollY.value = Math.max(0, event.contentOffset.y);

      const diff = event.contentOffset.y - prevY;

      // аккумулируем дельту в headerOffset (следует за пальцем)
      headerOffset.value = clamp(headerOffset.value + diff, 0, SCROLL_MAX);

      // console.log('scrollY.value', scrollY.value);

      const { contentOffset, contentSize, layoutMeasurement } = event;
      const isEndReached = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;

      if (isEndReached) {
        isScrollEnd.value = true;
      } else {
        isScrollEnd.value = false;
      }

      // console.log('scrollY.value', scrollY.value);

      if (scrollY.value <= 0 && !isScrollViewMinPosition.value) {
        isScrollViewMinPosition.value = true;
        // console.log('IS MIN POS');
      }

      if (scrollY.value > 1 && isScrollViewMinPosition.value) {
        isScrollViewMinPosition.value = false;
        // console.log('IS NOT MIN POS');
      }

      // if (scrollY.value === 0) {
      //   isScrollViewMinPosition.value = true;
      // } else {
      //   isScrollViewMinPosition.value = false;
      // }

      if (scrollY.value > HEADER_MAX_HEIGHT) {
        showFoodTypeChangeButtonValue.value = true;
      } else {
        showFoodTypeChangeButtonValue.value = false;
      }

      // Добавляем проверку на анимацию и порог изменения
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
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const onNotificationsPress = () => {
    router.push('/notifications');
  };

  const onAddressPress = () => {
    // openGlobalModal(GLOBAL_MODAL_CONTENT.ADDRESSES, true);
    openGlobalBottomSheet({
      content: <Addresses />,
      snaps: ['80%'],
      isBackgroundScalable: true,
      isIndicatorVisible: false
    });
  };

  const onFoodTypeChange = (type: string) => {
    setFoodType(type);
    scrollToY(0);
  };

  const onCategoryPress = (categoryId: number) => {
    setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
  };

  const onSearchQueryChange = (value: string) => {
    setSearchQuery(value);
  };

  // const hiddenHeight = useSharedValue(HEADER_MAX_HEIGHT);
  // useAnimatedReaction(
  //   () => scrollY.value,
  //   (y, prevY) => {
  //     if (prevY === null) return;
  //     const config = { duration: 200 };

  //     if (y > prevY && y > HEADER_MAX_HEIGHT && addressOpacity.value !== 0) {
  //       addressOpacity.value = withTiming(0, config);
  //       isScrolledUp.value = false;
  //     } else if (y < prevY && !isScrollEnd.value && addressOpacity.value !== 1) {
  //       isScrolledUp.value = true;
  //       addressOpacity.value = withTiming(1, config);
  //     }
  //   }
  // );

  // const headerHeight = useAnimatedStyle(() => {
  //   const height = interpolate(scrollY.value, [0, HEADER_MAX_HEIGHT], [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT], {
  //     extrapolateLeft: Extrapolation.CLAMP,
  //     extrapolateRight: Extrapolation.CLAMP
  //   });

  //   return { height };
  // });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      headerOffset.value,
      [120, 250],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );

    return { height };
  });

  // const citySilhouteeStyle = useAnimatedStyle(() => {
  //   const opacity = interpolate(scrollY.value, [1, 0], [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT], Extrapolation.CLAMP);

  //   const scale = interpolate(scrollY.value, [1, 1], [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT], Extrapolation.CLAMP);

  //   return { opacity };
  // });

  const addressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: addressOpacity.value,
    transform: [{ translateY: (1 - addressOpacity.value) * -100 }]
  }));

  const addressAnimatedStyle2 = useAnimatedStyle(() => {
    const translateY = interpolate(headerOffset.value, [120, 250], [0, -50], Extrapolation.CLAMP);

    const opacity = interpolate(headerOffset.value, [120, 150, 250], [1, 0.5, 0], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }],
      opacity
    };
  });

  const searchInputAnimatedStyle2 = useAnimatedStyle(() => {
    const translateY = interpolate(headerOffset.value, [120, 250], [0, -HEADER_MIN_HEIGHT / 1.5], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }]
    };
  });

  const animation = useSharedValue(1);

  const searchInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - addressOpacity.value) * -55
      }
    ]
  }));

  const searchInputScaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(animation.value)
      }
    ]
    // width: '100%'
    // flexGrow: showFoodTypeChangeButtonValue.value ? 0 : 1,
    // flexShrink: showFoodTypeChangeButtonValue.value ? 1 : 0,
    // flexBasis: showFoodTypeChangeButtonValue.value ? 'auto' : '100%',
    // flex: showFoodTypeChangeButtonValue.value ? 1 : 0
  }));

  const foodTypeSwitchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(showFoodTypeChangeButtonValue.value ? 1 : 0)
      }
    ],

    display: showFoodTypeChangeButtonValue.value ? 'flex' : 'none'
  }));

  // const scrollSpaceOffset = useSharedValue(0);
  // useAnimatedReaction(
  //   () => isScrolledUp.value,
  //   (state) => {
  //     // const target = state.scrolledUp ? 50 : 0;
  //     // const target = state.enabled ? HEADER_MAX_HEIGHT : 0;

  //     // if (scrollY.value > ADDRESS_HIDE_Y) {
  //     //   scrollSpaceOffset.value = withTiming(HEADER_MIN_HEIGHT, {
  //     //     duration: 200
  //     //   });
  //     // }

  //     const hiddenBlockHeightValue = isScrolledUp.value ? 120 : 70;

  //     hiddenBlockHeight.value = withTiming(hiddenBlockHeightValue, {
  //       duration: 200
  //     });

  //     // scrollSpaceOffset.value = withTiming(target, {
  //     //   duration: scrollY.value > HEADER_MAX_HEIGHT ? 200 : 0
  //     // });
  //   }
  // );

  const hiddenBlockHeight = useDerivedValue(() => {
    const hiddenBlockHeightValue = isScrolledUp.value ? 120 : 65;

    return withTiming(hiddenBlockHeightValue, {
      duration: 200
    });
  });

  const hiddenBlockStyles = useAnimatedStyle(() => ({
    height: hiddenBlockHeight.value
  }));

  const scrollSpaces = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: isScrollViewMinPosition.value ? HEADER_MAX_HEIGHT : 0
      }
    ],
    paddingTop: isScrollViewMinPosition.value ? 0 : HEADER_MAX_HEIGHT,
    backgroundColor: isScrollViewMinPosition.value ? '#fff' : ''
  }));

  // const androidScrollSpaces = useAnimatedStyle(() => ({
  //   paddingTop: isAndroid ? HEADER_MAX_HEIGHT : isScrollViewMinPosition.value ? 0 : HEADER_MAX_HEIGHT,
  //   backgroundColor: isAndroid ? 'transparent' : isScrollViewMinPosition.value ? '#fff' : ''
  // }));

  // const androidScrollViewTranslate = useAnimatedStyle(() => {
  //   const translateY = 0;

  //   return { transform: [{ translateY }] };
  // });

  const CONTENT_SECTION = {
    FOOD_TYPE: 'FOOD_TYPE',
    PROMO_BANNER: 'PROMO_BANNER',
    CATEGORIES: 'CATEGORIES',
    ORDER_AGAIN: 'ORDER_AGAIN',
    POPULAR_BRANDS: 'POPULAR_BRANDS',
    NEAR: 'NEAR',
    OFTEN_ORDER: 'OFTEN_ORDER',
    ALL_RESTAURANTS: 'ALL_RESTAURANTS'
  };

  const data =
    foodType === FOOD_TYPE.FOOD
      ? [
          CONTENT_SECTION.FOOD_TYPE,
          CONTENT_SECTION.CATEGORIES,
          CONTENT_SECTION.PROMO_BANNER,
          CONTENT_SECTION.ORDER_AGAIN,
          CONTENT_SECTION.POPULAR_BRANDS,
          CONTENT_SECTION.NEAR,
          CONTENT_SECTION.OFTEN_ORDER,
          CONTENT_SECTION.ALL_RESTAURANTS
        ]
      : ['Продукты'];

  const renderFoodTypeSection = () => {
    return (
      <View className="flex-row bg-white rounded-t-2xl">
        <TouchableOpacity
          onPress={() => onFoodTypeChange(FOOD_TYPE.FOOD)}
          activeOpacity={0.7}
          className="flex-1 flex-row gap-3 items-center justify-center py-4 border-b-2"
          style={{
            // backgroundColor: foodType === FOOD_TYPE.FOOD ? '#ea004b12' : 'transparent'
            borderColor: foodType === FOOD_TYPE.FOOD ? '#EA004B' : '#ddd'
          }}
        >
          <Icon set="ion" name="fast-food-outline" size={26} color={foodType === FOOD_TYPE.FOOD ? '#EA004B' : '#666'} />
          <Text
            className="text-sm font-bold pt-0.5"
            style={{
              color: foodType === FOOD_TYPE.FOOD ? '#EA004B' : '#666'
            }}
          >
            Еда
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFoodTypeChange(FOOD_TYPE.GROCERIES)}
          activeOpacity={0.7}
          className="flex-1 flex-row gap-3 items-center justify-center py-4 border-b-2"
          style={{
            // backgroundColor: foodType === FOOD_TYPE.GROCERIES ? '#ea004b12' : 'transparent'
            borderColor: foodType === FOOD_TYPE.GROCERIES ? '#EA004B' : '#ddd'
          }}
        >
          <Icon
            set="material"
            name="storefront"
            size={24}
            color={foodType === FOOD_TYPE.GROCERIES ? '#EA004B' : '#666'}
          />
          <Text
            className="text-sm font-bold pt-0.5"
            style={{
              color: foodType === FOOD_TYPE.GROCERIES ? '#EA004B' : '#444'
            }}
          >
            Продукты
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFlatListHeader = () => {
    return <View style={{ height: 120 }}></View>;
  };

  const renderCategoriesSection = () => {
    return (
      <View className="mt-5">
        <Categories activeCategoryId={activeCategoryId} onCategorySelect={onCategoryPress} />
        <View className="py-1 bg-stone-100 my-6" />
      </View>
    );
  };

  const renderOrderVariantSection = (type: string) => {
    switch (type) {
      case CONTENT_SECTION.ORDER_AGAIN:
        return (
          <>
            <RestaurantsListPreview list={RESTAURANTS2} title="Закажите еще раз" />
            <View className="py-1 bg-stone-100 my-8" />
          </>
        );

      case CONTENT_SECTION.POPULAR_BRANDS:
        return (
          <>
            <PopularBrands list={POPULAR_BRANDS} title="Популярные бренды" />
            <View className="py-1 bg-stone-100 my-8" />
          </>
        );

      case CONTENT_SECTION.NEAR:
        return (
          <>
            <RestaurantsListPreview list={RESTAURANTS} title="Рядом с вами" />
            <View className="py-1 bg-stone-100 my-8" />
          </>
        );

      case CONTENT_SECTION.OFTEN_ORDER:
        return (
          <>
            <RestaurantsListPreview list={RESTAURANTS2} title="Часто заказывают" />
            <View className="py-1 bg-stone-100 my-8" />
          </>
        );

      case CONTENT_SECTION.ALL_RESTAURANTS:
        return (
          <>
            <AllRestaurantsList list={[...RESTAURANTS, ...RESTAURANTS2]} title="Все рестораны" />
          </>
        );

      default:
        return <View></View>;
    }
  };

  const renderContent = (type: string, index: number) => {
    // if (index === 0) {
    //   renderFoodTypeSection();
    // }

    if (foodType === FOOD_TYPE.GROCERIES) {
      return (
        <View className="px-6">
          <Text>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus deleniti laudantium quaerat nam
            dolorem aliquam a suscipit possimus optio unde repellendus dolorum adipisci ipsam, quidem iusto aliquid fuga
            deserunt fugiat! Facere aperiam tempore perferendis fugiat, illum voluptates esse sit corrupti, expedita
            enim dolor. Ad, iste rem vero voluptatum neque soluta aliquam corrupti quae velit quidem temporibus. Saepe
            doloribus enim omnis. Reprehenderit maxime modi, harum dicta ea doloremque nobis repellendus doloribus
            ipsam, totam voluptate voluptatum quasi porro, dolores repudiandae suscipit beatae qui pariatur at eligendi.
            Eum, quod. Placeat expedita aliquid quo. Vitae distinctio autem saepe similique, aperiam impedit. Sit
            tempore nesciunt exercitationem expedita, ea laboriosam laborum soluta labore adipisci esse a architecto,
            voluptates voluptate quidem optio quasi alias eius est beatae! Reprehenderit dolorum saepe vero tenetur
            nesciunt natus autem optio minus esse officiis fuga corrupti vitae minima nulla at beatae molestiae, eveniet
            quasi?
          </Text>
        </View>
      );
    }

    let content = null;

    // switch (type) {
    //   // case CONTENT_SECTION.FOOD_TYPE:
    //   //   return renderFoodTypeSection();

    //   case CONTENT_SECTION.CATEGORIES:
    //     return renderCategoriesSection();

    //   case CONTENT_SECTION.ORDER_AGAIN:
    //     return activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.ORDER_AGAIN);

    //   case CONTENT_SECTION.POPULAR_BRANDS:
    //     return activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.POPULAR_BRANDS);

    //   case CONTENT_SECTION.NEAR:
    //     return activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.NEAR);

    //   case CONTENT_SECTION.OFTEN_ORDER:
    //     return activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.OFTEN_ORDER);

    //   case CONTENT_SECTION.ALL_RESTAURANTS:
    //     return renderOrderVariantSection(CONTENT_SECTION.ALL_RESTAURANTS);

    //   default:
    //     return <View></View>;
    // }

    switch (type) {
      // case CONTENT_SECTION.FOOD_TYPE:
      //   return renderFoodTypeSection();

      case CONTENT_SECTION.PROMO_BANNER:
        content = <PromoBanner />;
        break;

      case CONTENT_SECTION.CATEGORIES:
        content = renderCategoriesSection();
        break;

      case CONTENT_SECTION.ORDER_AGAIN:
        content = activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.ORDER_AGAIN);
        break;

      case CONTENT_SECTION.POPULAR_BRANDS:
        content = activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.POPULAR_BRANDS);
        break;

      case CONTENT_SECTION.NEAR:
        content = activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.NEAR);
        break;

      case CONTENT_SECTION.OFTEN_ORDER:
        content = activeCategoryId === null && renderOrderVariantSection(CONTENT_SECTION.OFTEN_ORDER);
        break;

      case CONTENT_SECTION.ALL_RESTAURANTS:
        content = renderOrderVariantSection(CONTENT_SECTION.ALL_RESTAURANTS);
        break;

      default:
        content = <View></View>;
        break;
    }

    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: index === 1 ? 15 : 0,
          borderTopRightRadius: index === 1 ? 15 : 0
        }}
      >
        {content}
      </View>
    );
  };

  return (
    <View
      className="flex-1 relative"
      style={{
        // backgroundColor: '#EA004B',
        paddingTop: insets.top
      }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <LinearGradient
        colors={['#EA004B', '#000', '#000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.3 }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%'
        }}
      />

      <Animated.View style={[isAndroid ? headerAnimatedStyle : hiddenBlockStyles]}>
        <Animated.View
          className="px-6 mb-6 flex-row justify-between items-center gap-2"
          style={isAndroid ? addressAnimatedStyle2 : addressAnimatedStyle}
        >
          <TouchableOpacity className="flex-row items-center flex-1 gap-2" onPress={onAddressPress} activeOpacity={0.7}>
            <View className="flex-row items-center gap-2 flex-1">
              <View className="pt-0.5s">
                <Icon set="feather" name="map-pin" size={24} color="white" />
              </View>

              <View>
                <Text className="font-bold text-white text-sm">{activeAddress?.streetWithHouse}</Text>
                <Text className="text-xs text-stone-200">{activeAddress?.city}</Text>
              </View>
            </View>

            <Icon set="material" name="keyboard-arrow-down" color="white"></Icon>
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
            <Pressable className="w-10 h-10 rounded-full justify-center items-center" onPress={onNotificationsPress}>
              <Icon set="ion" name="notifications-outline" size={24} color="white" />
              {unreadCount > 0 && (
                <View className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-[1.5px] border-white" />
              )}
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row gap-3 mx-4"
          style={isAndroid ? searchInputAnimatedStyle2 : [searchInputAnimatedStyle]}
        >
          <AnimatedPressable
            className="pl-3 py-1 bg-white flex-row items-center gap-3 rounded-full flex-1"
            layout={LinearTransition}
            onPress={() => {
              router.push('/search');
            }}
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
              placeholder="Поиск ресторанов и кафе"
              value={searchQuery}
              onChangeText={onSearchQueryChange}
              className="flex-1 py-3 leading-[17px]"
            />
          </AnimatedPressable>

          {/* <AnimatedTouchableOpacity
            layout={LinearTransition}
            style={[foodTypeSwitchAnimatedStyle]}
            activeOpacity={0.7}
            onPress={() => onFoodTypeChange(foodType === FOOD_TYPE.FOOD ? FOOD_TYPE.GROCERIES : FOOD_TYPE.FOOD)}
            className="border border-white justify-center items-center w-[45px] h-[45px] rounded-full"
          >
            <Icon
              set={foodType === FOOD_TYPE.FOOD ? 'material' : 'ion'}
              name={foodType === FOOD_TYPE.FOOD ? 'storefront' : 'fast-food-outline'}
              size={22}
              color="#fff"
            />

            <View className="absolute right-0 bottom-0">
              <Icon name="change-circle" set="material" size={20} color="#fff" />
            </View>
          </AnimatedTouchableOpacity> */}
        </Animated.View>
      </Animated.View>

      <Image
        style={[
          {
            width: '100%',
            height: 155,
            position: 'absolute',
            left: 0,
            top: 165
          }
          // citySilhouteeStyle
        ]}
        source={require('@/assets/images/grozny2.png')}
        transition={200}
        cachePolicy="memory-disk"
        contentFit="cover"
      />

      {/* <Tabs.Container
        headerContainerStyle={{ shadowColor: 'transparent' }}
        // renderTabBar={(props) => <CustomTabs {...props} />}
        renderTabBar={(props) => <TopTabs {...props} />}
        initialTabName="Еда"
      >
        <Tabs.Tab name="Еда" label="Еда">
          <AnimatedTabsFlatList
            ref={flatScrollRef}
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }: any) => {
              return renderContent(item, index) || <></>;
            }}
            CellRendererComponent={({ item, index, children, style, ...props }) => (
              <View {...props} style={{ backgroundColor: index === 0 ? 'auto' : '#fff' }}>
                {children}
              </View>
            )}
            ListHeaderComponent={() => {
              // return renderFoodTypeSection();
              return renderFlatListHeader();
            }}
            initialNumToRender={1}
            // maxToRenderPerBatch={5}
            // windowSize={5}
            className="rounded-t-2xl relative"
            style={[
              isAndroid
                ? {
                    transform: [
                      {
                        translateY: 5
                      }
                    ],
                    paddingTop: HEADER_MAX_HEIGHT,
                    backgroundColor: 'transparent'
                  }
                : {}
            ]}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            contentInsetAdjustmentBehavior="never"
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            overScrollMode="never"
            stickyHeaderIndices={[1]}
            contentContainerStyle={{
              // backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingBottom: isAndroid ? 220 : 120
            }}
          >
            <View className="items-center justify-center flex-1 pb-[150px]"></View>
          </AnimatedTabsFlatList>
        </Tabs.Tab>

        <Tabs.Tab name="Продукты" label="Продукты">
          <Tabs.ScrollView>
            <View>
              <Text>Products</Text>
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container> */}

      <AnimatedFlatList
        pointerEvents={isLoading ? 'none' : 'auto'}
        ref={flatScrollRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }: any) => {
          // return <>{renderFoodTypeSection()}</>;
          return isLoading ? (
            <View style={styles.newsCard}>
              {/* Изображение */}
              <Skeleton height={200} borderRadius={12} style={{ marginBottom: 12 }} />

              {/* Категория */}
              <Skeleton width={80} height={24} borderRadius={12} style={{ marginBottom: 8 }} />

              {/* Заголовок */}
              <Skeleton width="100%" height={20} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={20} style={{ marginBottom: 12 }} />
            </View>
          ) : (
            renderContent(item, index)
          );
        }}
        // CellRendererComponent={({ item, index, children, style, ...props }) => (
        //   <View
        //     {...props}
        //     style={{
        //       backgroundColor: index === 0 ? 'auto' : '#fff',
        //       borderTopLeftRadius: index === 1 ? 16 : 0,
        //       borderTopRightRadius: index === 1 ? 16 : 0
        //     }}
        //   >
        //     {children}
        //   </View>
        // )}
        // ListHeaderComponent={() => {
        // return renderFoodTypeSection();
        // return renderFlatListHeader();
        // }}
        initialNumToRender={1}
        // maxToRenderPerBatch={5}
        // windowSize={5}
        className="rounded-t-2xl relative"
        style={[
          isAndroid
            ? {
                transform: [
                  {
                    translateY: 5
                  }
                ],
                paddingTop: HEADER_MAX_HEIGHT,
                backgroundColor: 'transparent'
              }
            : scrollSpaces
        ]}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        contentInsetAdjustmentBehavior="never"
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        overScrollMode="never"
        // stickyHeaderIndices={[1]}
        contentContainerStyle={{
          // backgroundColor: '#fff',
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

const styles = StyleSheet.create({
  restaurantCard: {
    padding: 4
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  listContent: {
    flex: 1
  },
  contentCard: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    borderRadius: 12,
    backgroundColor: '#fff'
  },
  contentText: {
    flex: 1
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24
  },
  categoryCard: {
    alignItems: 'center',
    padding: 8
  },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12
  },
  gridItem: {
    padding: 8
  },
  newsCard: {
    padding: 16,
    backgroundColor: '#fff'
  },
  paymentCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  horizontalScroll: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24
  },
  horizontalCard: {
    width: 250
  }
});
