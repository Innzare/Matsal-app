import { Text } from '@/components/Text';
import React from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';

export default function PopularBrands(props: any) {
  const { list, title = '' } = props;

  return (
    <View>
      <Text className="text-2xl font-bold mb-4 px-6">{title}</Text>

      <FlatList
        data={list}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={5}
        renderItem={({ item }) => {
          return (
            <Pressable className="active:scale-90 transition-transform duration-150">
              <Image source={{ uri: item.image }} className="w-[80px] h-[80px] rounded-xl" resizeMode="cover" />

              <Text className="mt-2 text-center text-sm font-bold text-wrap w-[80px]">{item.name}</Text>
            </Pressable>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ flexDirection: 'row', gap: 20 }}
      />
    </View>
  );
}
