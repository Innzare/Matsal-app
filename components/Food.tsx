import { View, Text } from 'react-native';
import React, { memo, useState } from 'react';
import Categories from './Categories';
import { POPULAR_BRANDS, RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import RestaurantsListPreview from './RestaurantsListPreview';
import PopularBrands from './PopularBrands';
import AllRestaurantsList from './AllRestaurantsList';

export default memo(function Food(props: any) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const onCategoryPress = (categoryId: number) => {
    setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
  };

  return (
    <>
      <Categories activeCategoryId={activeCategoryId} onCategorySelect={onCategoryPress} />

      {activeCategoryId === null && (
        <View>
          <View className="py-1 bg-stone-100 my-8" />

          <RestaurantsListPreview list={RESTAURANTS2} title="Закажите еще раз" />

          <View className="py-1 bg-stone-100 my-8" />

          <PopularBrands list={POPULAR_BRANDS} title="Популярные бренды" />

          <View className="py-1 bg-stone-100 my-8" />

          <RestaurantsListPreview list={RESTAURANTS} title="Рядом с вами" />

          <View className="py-1 bg-stone-100 my-8" />

          <RestaurantsListPreview list={RESTAURANTS2} title="Часто заказывают" />
        </View>
      )}

      <View className="py-1 bg-stone-100 my-8" />

      <AllRestaurantsList list={[...RESTAURANTS, ...RESTAURANTS2]} title="Все рестораны" />
    </>
  );
});
