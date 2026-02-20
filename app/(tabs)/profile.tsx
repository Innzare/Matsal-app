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
import { useToastStore } from '@/store/useToastStore';
import { useTheme } from '@/hooks/useTheme';

export default function Favourites() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();
  const { openGlobalModal } = useGlobalModalStore();
  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { colors, isDark } = useTheme();

  const { isAuthenticated } = useAuthStore();
  const { activeOrdersCount } = useOrdersStore();
  const { unreadCount } = useNotificationsStore();
  const { showToast } = useToastStore();

  const onEditProfilePress = () => {
    router.push('/edit-profile');
  };

  const onFavouritesPress = () => {
    router.push('/favourites');
  };

  const onSettingsPress = () => {
    router.push('/settings');
  };

  const onAddressesPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.ADDRESSES, true, 'pageSheet');
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
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white dark:bg-dark-surface">
      {isFocused ? <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} /> : null}

      <View className="flex-row items-center justify-between border-b border-stone-200 dark:border-dark-border px-6 pb-2">
        <Text className="font-bold text-xl">Профиль</Text>

        <TouchableOpacity onPress={onSettingsPress} activeOpacity={0.7} className="p-2">
          <Icon set="fontAwesome" name="cog" size={18} color={colors.iconDefault} />
        </TouchableOpacity>
      </View>

      {isAuthenticated ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          className="bg-stone-100 dark:bg-dark-bg"
        >
          {/* Шапка профиля */}
          <TouchableOpacity
            onPress={onEditProfilePress}
            activeOpacity={0.7}
            className="mx-4 mt-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden p-5 border border-stone-200 dark:border-dark-border"
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
                <Text className="text-stone-500 dark:text-dark-muted text-sm">
                  +{user?.phone?.slice(0, 1)} ({user?.phone?.slice(1, 4)}) {user?.phone?.slice(4, 7)}-
                  {user?.phone?.slice(7, 9)}-{user?.phone?.slice(9, 11)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onEditProfilePress}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center"
              >
                <Icon set="feather" name="edit-2" size={18} color={colors.accent} />
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
                className="flex-1 bg-white dark:bg-dark-surface rounded-2xl p-4 items-center gap-2 border border-stone-200 dark:border-dark-border"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <Icon set={item.iconSet} name={item.iconName} size={20} color={colors.accent} />
                  {item.text === 'Заказы' && activeOrdersCount > 0 && (
                    <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-orange-500 items-center justify-center px-1">
                      <Text className="text-white text-[10px] font-bold">{activeOrdersCount}</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm font-bold text-stone-600 dark:text-dark-muted">{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Настройки */}
          <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
            <TouchableOpacity
              onPress={onPaymentPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <Icon set="fontAwesome" name="credit-card" size={18} color={colors.accent} />
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Способ оплаты</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNotificationsPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <Icon set="ion" name="notifications-outline" size={22} color={colors.accent} />
                  {unreadCount > 0 && (
                    <View className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border-[1.5px] border-white dark:border-dark-surface" />
                  )}
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Уведомления</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {unreadCount > 0 && (
                  <View className="min-w-[20px] h-[20px] rounded-full bg-red-500 items-center justify-center px-1.5">
                    <Text className="text-white text-[10px] font-bold">{unreadCount}</Text>
                  </View>
                )}
                <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSettingsPress}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <Icon set="feather" name="settings" size={20} color={colors.accent} />
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Настройки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>

          {/* Поддержка */}
          <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                  <Icon set="materialCom" name="headphones-settings" size={20} color={colors.iconSecondary} />
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Служба поддержки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                  <Icon set="feather" name="shield" size={20} color={colors.iconSecondary} />
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Политика конфиденциальности</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                  <Icon set="feather" name="info" size={20} color={colors.iconSecondary} />
                </View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">О приложении</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>

          {/* Тест уведомлений */}
          <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
            <View className="px-4 pt-4 pb-2">
              <Text className="text-xs font-bold text-stone-400 dark:text-dark-subtle uppercase tracking-widest">
                Тест уведомлений
              </Text>
            </View>

            {[
              {
                type: 'success' as const,
                title: 'Заказ оформлен!',
                message: 'Ваш заказ принят и готовится',
                color: '#16a34a'
              },
              {
                type: 'error' as const,
                title: 'Ошибка оплаты',
                message: 'Не удалось провести платёж. Попробуйте снова',
                color: '#dc2626'
              },
              {
                type: 'warning' as const,
                title: 'Ресторан скоро закроется',
                message: 'Успейте сделать заказ до 23:00',
                color: '#d97706'
              },
              {
                type: 'info' as const,
                title: 'Акция активирована',
                message: 'Скидка 15% применена к вашему заказу',
                color: '#2563eb'
              }
            ].map((item, index, arr) => (
              <TouchableOpacity
                key={item.type}
                activeOpacity={0.7}
                onPress={() => showToast({ type: item.type, title: item.title, message: item.message })}
                className={`flex-row items-center gap-3 px-4 py-3.5 ${index < arr.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''}`}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-stone-800 dark:text-dark-text text-sm">{item.title}</Text>
                  <Text className="text-stone-400 dark:text-dark-subtle text-xs mt-0.5" numberOfLines={1}>
                    {item.message}
                  </Text>
                </View>
                <Icon set="feather" name="play" size={13} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Выход */}
          <TouchableOpacity
            onPress={onLogoutPress}
            activeOpacity={0.7}
            className="bg-white dark:bg-dark-surface mx-4 mt-6 p-4 rounded-full flex-row justify-center items-center gap-2 border border-stone-200 dark:border-dark-border"
          >
            <Icon set="feather" name="log-out" size={18} color={colors.accent} />
            <Text className="font-bold" style={{ color: colors.accent }}>
              Выйти
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 50 }}
          className="bg-stone-100 dark:bg-dark-bg"
        >
          {/* Карточка авторизации */}
          <View className="m-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden">
            <View className="h-36 items-center justify-center" style={{ backgroundColor: '#EA004B' }}>
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
                <Icon set="feather" name="user" size={40} color="white" />
              </View>
            </View>

            <View className="px-6 py-6">
              <Text className="text-2xl font-bold text-center">Добро пожаловать!</Text>
              <Text className="text-stone-500 dark:text-dark-muted text-center text-sm font-bold mb-6">
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
                className="p-4 rounded-xl flex-row justify-center items-center gap-2 bg-stone-100 dark:bg-dark-elevated"
              >
                <Icon set="feather" name="user-plus" size={18} color={colors.iconSecondary} />
                <Text className="font-bold text-stone-600 dark:text-dark-muted">Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Преимущества */}
          <View className="mx-4 mt-0 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden">
            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100 dark:border-dark-border">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="clock" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">История заказов</Text>
                <Text className="text-stone-500 dark:text-dark-muted text-sm">
                  Повторяйте любимые заказы в один клик
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100 dark:border-dark-border">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="heart" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Избранное</Text>
                <Text className="text-stone-500 dark:text-dark-muted text-sm">
                  Сохраняйте любимые рестораны и блюда
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4 border-b border-stone-100 dark:border-dark-border">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="map-pin" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Адреса доставки</Text>
                <Text className="text-stone-500 dark:text-dark-muted text-sm">
                  Сохраните адреса для быстрого заказа
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 p-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="gift" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Бонусы и акции</Text>
                <Text className="text-stone-500 dark:text-dark-muted text-sm">Получайте персональные скидки</Text>
              </View>
            </View>
          </View>

          {/* Быстрые ссылки */}
          <View className="mx-4 mt-4 mb-8 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3">
                <Icon set="materialCom" name="headphones-settings" size={20} color={colors.accent} />
                <Text className="font-bold text-stone-600 dark:text-dark-muted">Служба поддержки</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <Icon set="materialCom" name="dots-horizontal-circle-outline" size={20} color={colors.accent} />
                <Text className="font-bold text-stone-600 dark:text-dark-muted">О приложении</Text>
              </View>
              <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
