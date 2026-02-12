import { StatusBar, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { useIsFocused } from '@react-navigation/native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { TopTabs } from '@/components/top-tabs';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { RESTAURANTS, RESTAURANTS2, GROCERY_STORES } from '@/constants/resources';
import RestaurantItem from '@/components/RestaurantItem';
import GroceryStoreItem from '@/components/GroceryStoreItem';

const ALL_RESTAURANTS = [...RESTAURANTS, ...RESTAURANTS2];

export default function Favourites() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();

  const { favoriteRestaurants, favoriteGroceries } = useFavoritesStore();

  const favoriteItems = useMemo(
    () => ALL_RESTAURANTS.filter((r) => favoriteRestaurants.includes(r.id)),
    [favoriteRestaurants]
  );

  const favoriteGroceryItems = useMemo(
    () => GROCERY_STORES.filter((s) => favoriteGroceries.includes(s.id)),
    [favoriteGroceries]
  );

  const onGoHomePress = () => {
    router.push('/');
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <Text className="font-bold text-xl px-6 text-center mt-2">Избранное</Text>

      <Tabs.Container
        headerContainerStyle={{ shadowColor: 'transparent' }}
        renderTabBar={(props) => <TopTabs {...props} />}
        initialTabName="Еда"
      >
        <Tabs.Tab name="Еда" label="Еда">
          <Tabs.ScrollView className="bg-stone-100">
            {favoriteItems.length > 0 ? (
              <View className="px-4 pt-4 pb-[150px] gap-4">
                {favoriteItems.map((restaurant) => (
                  <RestaurantItem key={restaurant.id} data={restaurant} block />
                ))}
              </View>
            ) : (
              <View className="items-center justify-center flex-1 pb-[150px]">
                <View className="items-center">
                  <View className="w-[130px] h-[130px] justify-center items-center mb-6 rounded-xl border border-stone-200 bg-white mt-10">
                    <Icon set="feather" name="bookmark" size={42} color="red" />
                  </View>

                  <Text className="font-bold text-2xl max-w-[250px] text-center leading-tight">
                    У вас пока нет сохраненных ресторанов
                  </Text>

                  <Text className="text-stone-500 text-center mt-4 px-10 leading-5">
                    Здесь вы сможете быстро найти ваши любимые заведения! Чтобы добавить их сюда используйте символ ❤️
                    на любом заведении
                  </Text>

                  <TouchableOpacity
                    onPress={onGoHomePress}
                    activeOpacity={0.7}
                    className="px-6 py-3 rounded-full mt-6 flex-row items-center gap-2"
                    style={{ backgroundColor: '#EA004B' }}
                  >
                    <Text className="text-white font-bold">Перейти к заведениям</Text>
                    <Icon set="material" name="keyboard-arrow-right" color="#fff" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Продукты" label="Продукты">
          <Tabs.ScrollView className="bg-stone-100">
            {favoriteGroceryItems.length > 0 ? (
              <View className="px-2 pt-4 pb-[150px] gap-2">
                {favoriteGroceryItems.map((store) => (
                  <GroceryStoreItem key={store.id} data={store} variant="list" />
                ))}
              </View>
            ) : (
              <View className="items-center justify-center flex-1 pb-[150px]">
                <View className="items-center">
                  <View className="w-[130px] h-[130px] justify-center items-center mb-6 rounded-xl border border-stone-200 bg-white mt-10">
                    <Icon set="fontAwesome" name="store" size={36} color="#16a34a" />
                  </View>

                  <Text className="font-bold text-2xl max-w-[250px] text-center leading-tight">
                    У вас пока нет сохраненных магазинов
                  </Text>

                  <Text className="text-stone-500 text-center mt-4 px-10 leading-5 items-center">
                    Здесь вы сможете быстро найти ваши любимые магазины! Чтобы добавить их сюда используйте символ ❤️ на
                    любом магазине
                  </Text>

                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/groceries')}
                    activeOpacity={0.7}
                    className="px-6 py-3 rounded-full mt-6 flex-row items-center gap-2"
                    style={{ backgroundColor: '#16a34a' }}
                  >
                    <Text className="text-white font-bold">Перейти к магазинам</Text>
                    <Icon set="material" name="keyboard-arrow-right" color="#fff" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
