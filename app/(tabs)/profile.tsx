import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import Addresses from '@/components/GlobalModal/Addresses';

export default function Favourites() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();
  const { openGlobalModal } = useGlobalModalStore();
  const { openGlobalBottomSheet } = useBottomSheetStore();

  const onEditProfilePress = () => {
    router.push('/edit-profile');
  };

  const onFavouritesPress = () => {
    router.push('/favourites');
  };

  const onSettingsPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.SETTINGS);
  };

  const onAddressesPress = () => {
    // openGlobalModal(GLOBAL_MODAL_CONTENT.ADDRESSES, true);
    openGlobalBottomSheet({
      content: <Addresses />,
      snaps: ['85%'],
      isBackgroundScalable: true,
      isIndicatorVisible: false
    });
  };

  const onOrdersPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.ORDERS);
  };

  const onNotificationsPress = () => {
    router.push('/notifications');
  };

  const BUTTONS = [
    {
      iconSet: 'materialCom',
      iconName: 'invoice-list-outline',
      text: 'Заказы',
      action: onOrdersPress
    },
    {
      iconSet: 'feather',
      iconName: 'heart',
      text: 'Избранное',
      action: onFavouritesPress
    },
    {
      iconSet: 'feather',
      iconName: 'map-pin',
      text: 'Адреса',
      action: onAddressesPress
    }
  ];

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View className="flex-row items-center justify-between border-b border-stone-200 px-6 pb-2">
        <Text className="font-bold text-xl">Профиль</Text>

        <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7} className="p-2">
          <Icon set="fontAwesome" name="cog" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-4 py-10 bg-stone-50">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-stone-600">Имя Фамилия</Text>

            <TouchableOpacity
              onPress={onEditProfilePress}
              activeOpacity={0.7}
              className="rounded-full bg-white p-2 justify-center items-center border border-stone-200"
            >
              <Icon set="material" name="edit" size={21} color="#EA004B" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-6 justify-between">
            {BUTTONS.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={item.action}
                  activeOpacity={0.7}
                  className="bg-white border border-stone-200 p-4 rounded-xl w-[31%] items-center gap-1"
                >
                  <Icon set={item.iconSet} name={item.iconName} size={21} color="#EA004B" />
                  <Text className="text-sm font-bold text-stone-600 pt-1">{item.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row justify-between items-center mt-4 bg-white border border-stone-200 p-4 rounded-xl gap-3"
          >
            <View className="flex-row gap-3 items-center">
              <Icon set="fontAwesome" name="credit-card" size={21} color="#EA004B" />
              <Text className="text-sm font-bold text-stone-600 pt-1">Способ оплаты</Text>
            </View>

            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNotificationsPress}
            activeOpacity={0.7}
            className="flex-row justify-between items-center mt-4 bg-white border border-stone-200 p-4 rounded-xl gap-3"
          >
            <View className="flex-row gap-3 items-center">
              <Icon set="ion" name="notifications-outline" size={24} color="#EA004B" />
              <Text className="text-sm font-bold text-stone-600 pt-1">Уведомления</Text>
            </View>

            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-xl font-bold mb-2">Основное</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="py-4 flex-row items-center justify-between gap-3 border-b border-stone-200 mb-4"
          >
            <View className="flex-row items-center gap-3">
              <Icon set="materialCom" name="headphones-settings" size={21} color="#EA004B" />
              <Text className="text font-bold text-stone-600 pt-1">Служба поддержки</Text>
            </View>

            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="py-4 flex-row items-center justify-between gap-3 border-b border-stone-200"
          >
            <View className="flex-row items-center gap-3">
              <Icon set="materialCom" name="dots-horizontal-circle-outline" size={21} color="#EA004B" />
              <Text className="text font-bold text-stone-600 pt-1">Политика конфиденциальности</Text>
            </View>

            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="p-4 mx-6 mt-20 rounded-full flex-row justify-center items-center gap-3"
          style={{ backgroundColor: '#EA004B' }}
        >
          <Text className="text-white font-bold pt-1">Выйти</Text>
          <Icon set="feather" name="log-out" size={21} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
