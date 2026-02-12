import AllRestaurantsList from '@/components/AllRestaurantsList';
import { Icon } from '@/components/Icon';
import Map from '@/components/Maps/Map';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import BottomSheet, { BottomSheetScrollView, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { TextInput, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const restaurants = [...RESTAURANTS, ...RESTAURANTS2];

export default function Groceries() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const snapPoints = useMemo(() => ['20%', '80%'], []);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.linear
  });

  return (
    <View className="flex-1 relative bg-white" style={{ paddingBottom: insets.bottom + 150 }}>
      {/* {isFocused ? <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> : null} */}
      <Map isVisible={isFocused} className="-mb-12" />

      <BottomSheet
        // ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enableOverDrag={false}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        animationConfigs={animationConfigs}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 }, // тень сверху
          shadowOpacity: 0.3,
          shadowRadius: 8
        }}
      >
        <BottomSheetScrollView className="relative z-50">
          <AllRestaurantsList list={restaurants} />
        </BottomSheetScrollView>
      </BottomSheet>

      <View className="absolute top-0 z-40 w-full">
        <View className="relative h-full" style={{ paddingTop: insets.top }}>
          <View
            className="relative z-30 pl-3 py-1 mx-4 bg-white border border-stone-200 flex-row items-center gap-3 rounded-full"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 }, // тень сверху
              shadowOpacity: 0.3,
              shadowRadius: 8
            }}
          >
            <Icon set="feather" name="search" />
            <TextInput
              placeholderTextColor="#777777"
              placeholder="Найти на карте"
              // value={searchQuery}
              // onChangeText={onSearchQueryChange}
              className="flex-1 py-3 leading-[17px]"
            />
          </View>

          <LinearGradient
            colors={['rgba(0, 0, 0, 0.65)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: '150%'
            }}
          />
        </View>
      </View>
    </View>
    // <ScrollView style={{ paddingTop: insets.top }} className="px-6" contentContainerStyle={{ flexGrow: 1 }}>
    //   <Text className="text-xl font-bold">
    //     Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi fuga minus quaerat quas nemo, mollitia
    //     perferendis, exercitationem, ratione ullam ab accusamus. Mollitia impedit doloremque sequi alias nemo ipsum fuga
    //     possimus!
    //   </Text>
    // </ScrollView>
  );
}
