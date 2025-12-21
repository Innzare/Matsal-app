import { Icon } from '@/components/Icon';
import RestaurantItem from '@/components/RestaurantItem';
import { Text } from '@/components/Text';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

export default function AllRestaurantsList(props: any) {
  const { list = [], title = '' } = props;

  const router = useRouter();

  const onAllRestaurantsPress = () => {
    router.push('/restaurants');
  };

  return (
    <>
      {title && (
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
      )}

      <FlatList
        data={list}
        initialNumToRender={1}
        className="gap-6 px-6"
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return <RestaurantItem data={item} block />;
        }}
        contentContainerStyle={{ gap: 20 }}
      >
        {/* {list.map((item: any, index: number) => {
          return <RestaurantItem key={index} data={item} block />;
        })} */}
      </FlatList>
    </>
  );
}
