import { Alert, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import Addresses from '@/components/GlobalModal/Addresses';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrdersStore } from '@/store/useOrdersStore';
import { useNotificationsStore } from '@/store/useNotificationsStore';

export default function Favourites() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();
  const { openGlobalModal } = useGlobalModalStore();
  const { openGlobalBottomSheet } = useBottomSheetStore();

  const { isAuthenticated } = useAuthStore();
  const { activeOrdersCount } = useOrdersStore();
  const { unreadCount } = useNotificationsStore();

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
      iconSet: 'ion',
      iconName: 'receipt-outline',
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

  const { logout, user } = useAuthStore();

  const onLogoutPress = async () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // Expo Router автоматически перенаправит на /auth/login
        }
      }
    ]);
  };

  const onLogInPress = async () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.AUTH);
  };

  const onPaymentPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.PAYMENT);
  };

  useEffect(() => {
    console.log('user', user);
  });

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View className="flex-row items-center justify-between border-b border-stone-200 px-6 pb-2">
        <Text className="font-bold text-xl">Профиль</Text>

        <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7} className="p-2">
          <Icon set="fontAwesome" name="cog" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {isAuthenticated ? (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80 }} className="bg-stone-100">
          {/* Шапка профиля */}
          <TouchableOpacity
            onPress={onEditProfilePress}
            activeOpacity={0.7}
            className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden p-5 border border-stone-200"
          >
            <View className="flex-row items-center gap-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: '#EA004B' }}
              >
                <Text className="text-white text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</Text>
              </View>

              <View className="flex-1">
                <Text className="text-xl font-bold">{user?.name}</Text>
                <Text className="text-stone-500 text-sm">
                  +{user?.phone?.slice(0, 1)} ({user?.phone?.slice(1, 4)}) {user?.phone?.slice(4, 7)}-
                  {user?.phone?.slice(7, 9)}-{user?.phone?.slice(9, 11)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onEditProfilePress}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center"
              >
                <Icon set="feather" name="edit-2" size={18} color="#EA004B" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Быстрые действия */}
          <View className="mx-4 mt-3 flex-row gap-3">
            {BUTTONS.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                activeOpacity={0.7}
                className="flex-1 bg-white rounded-2xl p-4 items-center gap-2 border border-stone-200"
              >
                <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                  <Icon set={item.iconSet} name={item.iconName} size={20} color="#EA004B" />
                  {item.text === 'Заказы' && activeOrdersCount > 0 && (
                    <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-orange-500 items-center justify-center px-1">
                      <Text className="text-white text-[10px] font-bold">{activeOrdersCount}</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm font-bold text-stone-600">{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Настройки */}
          <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden border border-stone-200">
            <TouchableOpacity
              onPress={onPaymentPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                  <Icon set="fontAwesome" name="credit-card" size={18} color="#EA004B" />
                </View>
                <Text className="font-bold text-stone-700">Способ оплаты</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNotificationsPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                  <Icon set="ion" name="notifications-outline" size={22} color="#EA004B" />
                  {unreadCount > 0 && (
                    <View className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-[1.5px] border-white" />
                  )}
                </View>
                <Text className="font-bold text-stone-700">Уведомления</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {unreadCount > 0 && (
                  <View className="min-w-[20px] h-[20px] rounded-full bg-red-500 items-center justify-center px-1.5">
                    <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
                  </View>
                )}
                <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSettingsPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                  <Icon set="feather" name="settings" size={20} color="#EA004B" />
                </View>
                <Text className="font-bold text-stone-700">Настройки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Поддержка */}
          <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden border border-stone-200">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Icon set="materialCom" name="headphones-settings" size={20} color="#57534e" />
                </View>
                <Text className="font-bold text-stone-700">Служба поддержки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Icon set="feather" name="shield" size={20} color="#57534e" />
                </View>
                <Text className="font-bold text-stone-700">Политика конфиденциальности</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Icon set="feather" name="info" size={20} color="#57534e" />
                </View>
                <Text className="font-bold text-stone-700">О приложении</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>
          </View>

          {/* Выход */}
          <TouchableOpacity
            onPress={onLogoutPress}
            activeOpacity={0.7}
            className="bg-white mx-4 mt-6 p-4 rounded-full flex-row justify-center items-center gap-2 border border-stone-200"
          >
            <Icon set="feather" name="log-out" size={18} color="#EA004B" />
            <Text className="font-bold" style={{ color: '#EA004B' }}>
              Выйти
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 50 }} className="bg-stone-100">
          {/* Карточка авторизации */}
          <View className="m-4 bg-white rounded-2xl overflow-hidden">
            <View className="h-36 items-center justify-center" style={{ backgroundColor: '#EA004B' }}>
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
                <Icon set="feather" name="user" size={40} color="white" />
              </View>
            </View>

            <View className="px-6 py-6">
              <Text className="text-2xl font-bold text-center">Добро пожаловать!</Text>
              <Text className="text-stone-500 text-center text-sm font-bold mb-6">
                Авторизуйтесь для доступа ко всем функциям
              </Text>

              <TouchableOpacity
                onPress={onLogInPress}
                activeOpacity={0.7}
                className="p-4 rounded-xl flex-row justify-center items-center gap-2 mb-3"
                style={{ backgroundColor: '#EA004B' }}
              >
                <Icon set="feather" name="log-in" size={18} color="white" />
                <Text className="text-white font-bold">Войти</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onLogInPress}
                activeOpacity={0.7}
                className="p-4 rounded-xl flex-row justify-center items-center gap-2 bg-stone-100"
              >
                <Icon set="feather" name="user-plus" size={18} color="#57534e" />
                <Text className="font-bold text-stone-600">Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Преимущества */}
          <View className="mx-4 mt-0 bg-white rounded-2xl overflow-hidden">
            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="clock" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">История заказов</Text>
                <Text className="text-stone-500 text-sm">Повторяйте любимые заказы в один клик</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="heart" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Избранное</Text>
                <Text className="text-stone-500 text-sm">Сохраняйте любимые рестораны и блюда</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="map-pin" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Адреса доставки</Text>
                <Text className="text-stone-500 text-sm">Сохраните адреса для быстрого заказа</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="gift" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Бонусы и акции</Text>
                <Text className="text-stone-500 text-sm">Получайте персональные скидки</Text>
              </View>
            </View>
          </View>

          {/* Быстрые ссылки */}
          <View className="mx-4 mt-4 mb-8 bg-white rounded-2xl overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100"
            >
              <View className="flex-row items-center gap-3">
                <Icon set="materialCom" name="headphones-settings" size={20} color="#EA004B" />
                <Text className="font-bold text-stone-600">Служба поддержки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <Icon set="materialCom" name="dots-horizontal-circle-outline" size={20} color="#EA004B" />
                <Text className="font-bold text-stone-600">О приложении</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          onPress={onLogoutPress}
          activeOpacity={0.7}
          className="p-4 mx-6 mt-20 rounded-full flex-row justify-center items-center gap-3"
          style={{ backgroundColor: '#EA004B' }}
        >
          <Text className="text-white font-bold pt-1">Выйти</Text>
          <Icon set="feather" name="log-out" size={21} color="white" />
        </TouchableOpacity>
      </ScrollView> */}
    </View>
  );
}
