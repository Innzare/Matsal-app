import { Icon } from '@/components/Icon';
import RestaurantItem from '@/components/RestaurantItem';
import { Text } from '@/components/Text';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

export default function RestaurantsListPreview(props: any) {
  const { title = '', list } = props;

  const router = useRouter();

  const onAllRestaurantsPress = () => {
    router.push('/restaurants');
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center justify-between gap-2 mb-3 px-6"
        onPress={onAllRestaurantsPress}
      >
        <Text className="text-2xl text-stone-800 text-left font-bold">{title}</Text>

        <View className="bg-stone-100 rounded-full w-[30px] h-[30px] justify-center items-center">
          <Icon set="material" name="keyboard-arrow-right" color="gray" size={23} />
        </View>
      </TouchableOpacity>

      <FlatList
        data={list}
        initialNumToRender={5}
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        snapToInterval={300}
        decelerationRate="fast"
        renderItem={({ item }) => {
          return <RestaurantItem data={item} />;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, gap: 15, paddingHorizontal: 22 }}
      ></FlatList>
    </View>
  );
}
