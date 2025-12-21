import { Text } from '@/components/Text';
import { CATEGORIES } from '@/constants/resources';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

export default function Categories(props: any) {
  const { activeCategoryId, onCategorySelect, isTitleVisible = true, ...rest } = props;

  const isActiveCategory = (categoryId: number) => {
    return activeCategoryId === categoryId;
  };

  return (
    <View {...rest}>
      {isTitleVisible && (
        <Text className="text-2xl text-stone-800 text-left font-bold mb-2 px-6 font-quicksand-bold">Категории</Text>
      )}

      <FlatList
        data={[...CATEGORIES, ...CATEGORIES]}
        initialNumToRender={5}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <Pressable
              className="items-center gap-2 active:scale-95 transition-transform duration-150"
              onPress={() => onCategorySelect(item.id)}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  overflow: 'hidden',
                  borderWidth: isActiveCategory(item.id) ? 2 : 0,
                  borderColor: isActiveCategory(item.id) ? '#3d3d3d' : '',
                  backgroundColor: '#f3f3f3'
                }}
              />

              <Text className="text-sm font-semibold">{item.name}</Text>
            </Pressable>
          );
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          gap: 20,
          paddingHorizontal: 24
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
