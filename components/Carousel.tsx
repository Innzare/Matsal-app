import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import PromoSlide from './PromoSlide';

const images = [
  'https://picsum.photos/id/1019/800/400',
  'https://picsum.photos/id/1015/800/400',
  'https://picsum.photos/id/1020/800/400'
];

const { width } = Dimensions.get('window');

export default function Slider() {
  const carouselRef: any = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true
    });
  };

  return (
    <View>
      <Carousel
        ref={carouselRef}
        width={width}
        height={200}
        data={images}
        autoPlay
        autoPlayInterval={2500}
        loop
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50
        }}
        onSnapToItem={(index: any) => setActiveIndex(index)}
        renderItem={({ item }: any) => <PromoSlide style={{ height: '100%', width }} />}
      />

      <Pagination.Basic
        progress={progress}
        data={images}
        dotStyle={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50, height: 5 }}
        containerStyle={{ gap: 5, marginTop: 0 }}
        onPress={onPressPagination}
      />

      {/* <View style={styles.pagination}>
        {images.map((_, index) => (
          <View key={index} style={[styles.dot, { opacity: index === activeIndex ? 1 : 0.3 }]} />
        ))}
      </View>

      <View className="flex-row items-center gap-6 mt-10">
        <Pressable
          onPress={() => carouselRef.current?.prev()}
          className="border border-stone-500 rounded-full w-10 h-10 justify-center items-center"
        >
          <Icon set="feather" name="arrow-left"></Icon>
        </Pressable>

        <Pressable
          onPress={() => carouselRef.current?.next()}
          className="border border-stone-500 rounded-full w-10 h-10 justify-center items-center"
        >
          <Icon set="feather" name="arrow-right"></Icon>
        </Pressable>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  image: {
    width: width,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center'
  },
  pagination: {
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 10,
    backgroundColor: '#ccc',
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    zIndex: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4
  }
});
