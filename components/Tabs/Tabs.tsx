import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tag } from './Tags';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Categories from '../Categories';
import RestaurantsListPreview from '../RestaurantsListPreview';
import { POPULAR_BRANDS, RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import PopularBrands from '../PopularBrands';
import AllRestaurantsList from '../AllRestaurantsList';
type TProps = {
  horizontalScrollData: Array<any>;
  verticalScrollData: Array<any>;
};

type TSectionProps = {
  data: Array<TItemProps>;
};

type TItemProps = {
  name: string;
  id: number;
  image?: any;
};
const SectionList = ({ data }: TSectionProps) => {
  // const renderItem = (item: TItemProps) => {
  //   return (
  //     <View style={styles.itemCardView}>
  //       {item?.image && <Image source={{ uri: item.image }} style={styles.image} />}
  //       <Text>{item?.name}</Text>
  //     </View>
  //   );
  // };

  return (
    <View style={{ marginBottom: 10 }}>
      {/* {renderItem(item)} */}

      <Categories activeCategoryId={null} onCategorySelect={() => {}} />

      {null === null && (
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
    </View>
  );

  // return (
  //   <FlatList
  //     data={data}
  //     ItemSeparatorComponent={() => <View style={styles.itemSeparatorStyle} />}
  //     keyExtractor={(item) => item.id.toString()}
  //     contentContainerStyle={styles.contentContainerStyle}
  //     showsVerticalScrollIndicator={false}
  //     renderItem={({ item }) => renderItem(item)}
  //   />
  // );
};

export const horizontalScrollData = [
  { id: 1, name: 'Sort' },
  { id: 2, name: 'Pizza', image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png' },
  { id: 3, name: 'Burger', image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png' },
  {
    id: 4,
    name: 'Sandwich',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  { id: 5, name: 'Cake', image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png' },
  {
    id: 6,
    name: 'Summer Specials',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 7,
    name: 'North Indian',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  }
];

const pizzaData = [
  {
    id: 1,
    name: 'Pizza best',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 2,
    name: 'Pizza best:)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 3,
    name: 'Pizza Love',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 4,
    name: 'Pizza :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 5,
    name: 'Pizza :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 6,
    name: 'Pizza :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  { id: 7, name: 'Pizza :)', image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png' }
];

const burgerData = [
  {
    id: 1,
    name: 'burger best',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 2,
    name: 'burger best:)',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 3,
    name: 'burger Love',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 4,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 5,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 6,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 7,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 8,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 9,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 10,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 11,
    name: 'burger best',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 12,
    name: 'burger best:)',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 13,
    name: 'burger Love',
    image: '	https://c-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 14,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 15,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 16,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 17,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 18,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 19,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 20,
    name: 'burger :)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  }
];

const sandwichData = [
  {
    id: 1,
    name: 'Sandwich best',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 2,
    name: 'Sandwich best:)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 3,
    name: 'Sandwich Love',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 4,
    name: 'Sandwich :)',
    image: '	htps://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  }
];

const cakeData = [
  {
    id: 1,
    name: 'Cake best',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 2,
    name: 'Cake best:)',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  {
    id: 3,
    name: 'Cake Love',
    image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png'
  },
  { id: 4, name: 'Cake :)', image: 'https://cn-geo1.uber.com/static/mobile-content/eats/cuisine-filters/v1/Pizza.png' }
];

const sortData = [
  { id: 1, name: 'Sort filter' },
  { id: 2, name: 'Sort pizza' },
  { id: 3, name: 'Sort burger' },
  { id: 4, name: 'Sort cake' }
];

export const verticalScrollData = [
  { id: 1, component: <SectionList data={sortData} /> },
  { id: 2, name: 'Pizza', component: <SectionList data={pizzaData} /> }
  // { id: 3, name: 'Burger', component: <SectionList data={burgerData} /> },
  // { id: 4, name: 'Sandwich', component: <SectionList data={sandwichData} /> },
  // { id: 5, name: 'Cake', component: <SectionList data={cakeData} /> },
  // { id: 6, name: 'Summer Specials', component: <Text>Summer Specials</Text> },
  // { id: 7, name: 'North Indian', component: <Text>North Indian</Text> }
];

const AnimationTopTab = () => {
  const [selectedItemIndex, setSelectedItem] = React.useState(0);
  const { width } = Dimensions.get('window');
  const horizontalScrollRef = React.useRef<FlatList>(null);
  const verticalScrollRef = React.useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const onItemPress = (id: number) => {
    if (verticalScrollRef?.current) {
      verticalScrollRef.current?.scrollToIndex({
        animated: true,
        index: id,
        viewPosition: 0
      });
    }
    if (horizontalScrollRef?.current) {
      horizontalScrollRef.current.scrollToIndex({
        animated: true,
        index: id,
        viewPosition: 0.5
      });
    }
    setSelectedItem(id);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={horizontalScrollRef}
        style={styles.flatListStyle}
        bounces={false}
        initialNumToRender={20}
        initialScrollIndex={selectedItemIndex}
        data={horizontalScrollData}
        contentContainerStyle={styles.contentContainerStyle}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparatorStyle} />}
        horizontal
        renderItem={({ item, index }) => {
          return <Tag onPress={() => onItemPress(index)} selected={index === selectedItemIndex} {...item} />;
        }}
      />

      <FlatList
        ref={verticalScrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        initialScrollIndex={selectedItemIndex}
        data={verticalScrollData}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginBottom: Math.max(Number(insets?.bottom), 15)
        }}
        onScrollToIndexFailed={() => {
          if (horizontalScrollRef?.current) {
            horizontalScrollRef.current.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0
            });
          }

          if (verticalScrollRef?.current) {
            verticalScrollRef.current.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0
            });
          }
        }}
        onMomentumScrollEnd={(item) => {
          const newIndex = Math.floor(item.nativeEvent.contentOffset.x / width);
          const currentIndex = newIndex > 0 ? newIndex : 0;
          if (horizontalScrollRef?.current) {
            horizontalScrollRef.current.scrollToIndex({
              animated: true,
              index: currentIndex,
              viewPosition: 0.5
            });
          }
          setSelectedItem(currentIndex);
        }}
        renderItem={({ item }) => <View style={{ width, paddingHorizontal: 12 }}>{item?.component}</View>}
      />
    </View>
  );
};

export default AnimationTopTab;

const styles = StyleSheet.create({
  flatListStyle: { flexGrow: 0 },
  contentContainerStyle: {
    paddingHorizontal: 10,
    marginBottom: 15
  },
  itemSeparatorStyle: {
    marginRight: 10
  },

  itemCardView: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    height: 20,
    width: 20,
    marginRight: 8
  }
});
