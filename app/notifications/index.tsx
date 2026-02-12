import React, { useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'Заказ доставлен',
    text: 'Ваш заказ из "Burger King" успешно доставлен. Приятного аппетита!',
    time: '10 мин назад',
    group: 'today',
    read: false
  },
  {
    id: 2,
    type: 'promo',
    title: 'Скидка 20% на суши',
    text: 'Только сегодня! Закажите любые суши со скидкой 20%.',
    time: '1 час назад',
    group: 'today',
    read: false
  },
  {
    id: 3,
    type: 'order',
    title: 'Заказ принят',
    text: 'Ресторан "Pizza Hut" принял ваш заказ. Ожидайте доставку через 35 мин.',
    time: '3 часа назад',
    group: 'today',
    read: true
  },
  {
    id: 4,
    type: 'system',
    title: 'Обновление приложения',
    text: 'Доступна новая версия Matsal с улучшенным поиском.',
    time: 'Вчера, 18:30',
    group: 'yesterday',
    read: true
  },
  {
    id: 5,
    type: 'promo',
    title: 'Бесплатная доставка',
    text: 'При заказе от 1000₽ — бесплатная доставка до конца недели!',
    time: 'Вчера, 12:00',
    group: 'yesterday',
    read: true
  },
  {
    id: 6,
    type: 'order',
    title: 'Оцените заказ',
    text: 'Как вам заказ из "Шаурма House"? Оставьте отзыв и получите бонусы.',
    time: '3 дня назад',
    group: 'earlier',
    read: true
  },
  {
    id: 7,
    type: 'promo',
    title: 'Новый ресторан',
    text: 'Встречайте "Sushi Master" — теперь доступен для заказа в вашем районе!',
    time: '5 дней назад',
    group: 'earlier',
    read: true
  }
];

const ICON_MAP: Record<string, { name: string; set: string; bg: string; color: string }> = {
  order: { name: 'shopping-bag', set: 'feather', bg: '#fef3c7', color: '#f59e0b' },
  promo: { name: 'gift', set: 'feather', bg: '#fce4ec', color: '#EA004B' },
  system: { name: 'info', set: 'feather', bg: '#e0f2fe', color: '#0ea5e9' }
};

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const groups = [
    { key: 'today', label: 'Сегодня' },
    { key: 'yesterday', label: 'Вчера' },
    { key: 'earlier', label: 'Ранее' }
  ];

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View className="bg-white py-4 border-b border-stone-200" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="flex-row items-center gap-1">
            <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
            <Text className="text-xl">Назад</Text>
          </TouchableOpacity>

          {hasUnread && (
            <TouchableOpacity onPress={markAllRead}>
              <Text className="text-sm" style={{ color: '#EA004B' }}>
                Прочитать все
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-2xl font-bold mt-4 px-4">Уведомления</Text>
      </View>

      {notifications.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          {groups.map((group) => {
            const items = notifications.filter((n) => n.group === group.key);
            if (items.length === 0) return null;

            return (
              <View key={group.key} className="mt-4">
                <Text className="text-sm font-bold text-stone-400 px-4 mb-2">{group.label}</Text>
                <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
                  {items.map((item, index) => {
                    const icon = ICON_MAP[item.type];
                    return (
                      <Pressable
                        key={item.id}
                        className={`flex-row gap-3 p-4 ${index < items.length - 1 ? 'border-b border-stone-100' : ''}`}
                        style={{
                          backgroundColor: item.read ? '#fff' : '#fdf2f8',
                          borderColor: item.read ? '#e5e7eb' : '#fce4ec'
                        }}
                      >
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center"
                          style={{ backgroundColor: icon.bg }}
                        >
                          <Icon set={icon.set} name={icon.name} size={20} color={icon.color} />
                        </View>

                        <View className="flex-1">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="font-bold text-stone-800">{item.title}</Text>
                            {!item.read && (
                              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#EA004B' }} />
                            )}
                          </View>
                          <Text className="text-stone-500 text-sm leading-5">{item.text}</Text>
                          <Text className="text-stone-400 text-xs mt-1">{item.time}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Icon set="feather" name="bell-off" size={48} color="#d4d4d4" />
          <Text className="text-stone-400 text-center mt-4 text-lg">Нет уведомлений</Text>
          <Text className="text-stone-400 text-center text-sm mt-1">Здесь будут ваши уведомления</Text>
        </View>
      )}
    </View>
  );
}
