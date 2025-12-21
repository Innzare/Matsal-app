import { Pressable, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { useIsFocused } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import SimpleTabs from '@/components/Tabs/Tabs';
import { MaterialTabBar, TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { TopTabs } from '@/components/top-tabs';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';

const CustomTabs = (props: TabBarProps) => {
  const { tabNames, onTabPress, indexDecimal, tabProps } = props;

  // console.log('tabProps.get(tab)', tabProps.get(tab));

  return (
    <View className="flex-row justify-between px-6 w-full flex-1 border-b border-stone-200">
      {tabNames.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab)}
            className="w-[49%] px-4 py-2 rounded-lg bg-stone-200"
            style={
              {
                // backgroundColor: indexDecimal.value === index ? '#ccc' : 'red'
              }
            }
          >
            <Text className="font-bold text text-center">{tabProps.get(tab)?.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function Favourites() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const router = useRouter();

  const onGoHomePress = () => {
    router.push('/');
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <Text className="font-bold text-xl px-6 mb-6 text-center mt-2">Избранное</Text>

      <Tabs.Container
        headerContainerStyle={{ shadowColor: 'transparent' }}
        // renderTabBar={(props) => <CustomTabs {...props} />}
        renderTabBar={(props) => <TopTabs {...props} />}
        initialTabName="Еда"
      >
        <Tabs.Tab name="Еда" label="Еда">
          <Tabs.ScrollView>
            <View className="items-center justify-center flex-1 pb-[150px]">
              <View className="items-center">
                <View className="w-[100px] h-[100px] justify-center items-center mb-6 rounded-xl bg-stone-100 transform rotate-6 mt-10">
                  <Icon set="feather" name="bookmark" size={42} color="red" />
                </View>

                <Text className="font-bold text-2xl max-w-[250px] text-center leading-tight">
                  У вас пока нет сохраненных ресторанов
                </Text>

                <Text className="font-bold text-stone-500 text-center mt-4 px-10 leading-normal ">
                  Здесь вы сможете быстро найти ваши любимые заведения! Чтобы добавить их сюда используйте символ ❤️ на
                  любом заведении
                </Text>

                <TouchableOpacity
                  onPress={onGoHomePress}
                  activeOpacity={0.7}
                  className="px-6 py-3 rounded-xl mt-6 bg-red-500 flex-row items-center gap-2"
                >
                  <Text className="text-white font-bold">Перейти к заведениям</Text>
                  <Icon set="material" name="keyboard-arrow-right" color="#fff" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Продукты" label="Продукты">
          <Tabs.ScrollView>
            <View className="items-center justify-center flex-1 pb-[150px]">
              <View className="items-center">
                <View className="w-[100px] h-[100px] justify-center items-center mb-6 rounded-xl bg-stone-100 transform -rotate-6 mt-10">
                  <Icon set="fontAwesome" name="store" size={36} color="red" />
                </View>

                <Text className="font-bold text-2xl max-w-[250px] text-center leading-tight">
                  У вас пока нет сохраненных магазинов
                </Text>

                <Text className="font-bold text-stone-500 text-center mt-4 px-10 leading-normal items-center">
                  Здесь вы сможете быстро найти ваши любимые магазины! Чтобы добавить их сюда используйте символ ❤️ на
                  любом магазине
                </Text>

                <TouchableOpacity
                  onPress={onGoHomePress}
                  activeOpacity={0.7}
                  className="px-6 py-3 rounded-xl mt-6 bg-red-500 flex-row items-center gap-2"
                >
                  <Text className="text-white font-bold">Перейти к магазинам</Text>
                  <Icon set="material" name="keyboard-arrow-right" color="#fff" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
