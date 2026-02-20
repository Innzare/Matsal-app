import { Icon } from '@/components/Icon';
import RestaurantItem from '@/components/RestaurantItem';
import { Text } from '@/components/Text';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function AllRestaurantsList(props: any) {
  const { list = [], title = '' } = props;

  const router = useRouter();
  const { colors, isDark } = useTheme();

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
          <Text className="text-xl text-stone-800 dark:text-dark-text text-left font-bold">{title}</Text>

          <View className="rounded-full w-[30px] h-[30px] justify-center items-center bg-stone-100 dark:bg-dark-elevated">
            <Icon set="material" name="keyboard-arrow-right" color={isDark ? colors.textMuted : 'gray'} size={23} />
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
