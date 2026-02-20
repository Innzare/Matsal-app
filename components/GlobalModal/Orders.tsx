import { View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useCartStore } from '@/store/useCartStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

interface TrackingStep {
  key: string;
  label: string;
  time?: string;
  done: boolean;
}

interface Order {
  id: number;
  restaurantId: string;
  restaurant: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  image: string;
  tracking?: TrackingStep[];
  estimatedTime?: string;
  courierName?: string;
}

const ORDERS: Order[] = [
  {
    id: 100,
    restaurantId: '2',
    restaurant: 'Pizza Hut',
    date: 'Сегодня, 19:20',
    status: 'in_progress',
    total: 1890,
    items: [
      { id: 'ph-10', name: 'Пицца Четыре сыра', price: 890 },
      { id: 'ph-11', name: 'Пицца BBQ', price: 790 },
      { id: 'ph-12', name: 'Чесночный хлеб', price: 210 }
    ],
    image: 'PH',
    estimatedTime: '19:50 – 20:10',
    courierName: 'Алексей',
    tracking: [
      { key: 'confirmed', label: 'Заказ принят', time: '19:20', done: true },
      { key: 'preparing', label: 'Готовится', time: '19:25', done: true },
      { key: 'on_way', label: 'Курьер в пути', time: '19:45', done: true },
      { key: 'delivered', label: 'Доставлен', done: false }
    ]
  },
  {
    id: 101,
    restaurantId: '200',
    restaurant: 'Магнит',
    date: 'Сегодня, 18:40',
    status: 'in_progress',
    total: 1240,
    items: [
      { id: 'mg-1', name: 'Молоко 3.2% 1л', price: 89 },
      { id: 'mg-2', name: 'Хлеб белый', price: 49 },
      { id: 'mg-3', name: 'Сыр Российский 300г', price: 320 },
      { id: 'mg-4', name: 'Куриное филе 1кг', price: 389 },
      { id: 'mg-5', name: 'Макароны Barilla 500г', price: 159 },
      { id: 'mg-6', name: 'Томаты 500г', price: 234 }
    ],
    image: 'MG',
    estimatedTime: '19:10 – 19:30',
    courierName: 'Дмитрий',
    tracking: [
      { key: 'confirmed', label: 'Заказ принят', time: '18:40', done: true },
      { key: 'preparing', label: 'Собирается', time: '18:48', done: true },
      { key: 'on_way', label: 'Курьер в пути', done: false },
      { key: 'delivered', label: 'Доставлен', done: false }
    ]
  },
  {
    id: 1,
    restaurantId: '1',
    restaurant: 'Burger King',
    date: '7 февраля, 18:30',
    status: 'delivered',
    total: 890,
    items: [
      { id: 'bk-1', name: 'Воппер', price: 389 },
      { id: 'bk-2', name: 'Картофель фри', price: 189 },
      { id: 'bk-3', name: 'Кола', price: 149 }
    ],
    image: 'BK'
  },
  {
    id: 2,
    restaurantId: '2',
    restaurant: 'Pizza Hut',
    date: '5 февраля, 20:15',
    status: 'delivered',
    total: 1450,
    items: [
      { id: 'ph-1', name: 'Пицца Пепперони', price: 790 },
      { id: 'ph-2', name: 'Пицца Маргарита', price: 660 }
    ],
    image: 'PH'
  },
  {
    id: 3,
    restaurantId: '3',
    restaurant: 'Sushi Master',
    date: '3 февраля, 13:00',
    status: 'cancelled',
    total: 2100,
    items: [
      { id: 'sm-1', name: 'Сет Филадельфия', price: 1490 },
      { id: 'sm-2', name: 'Мисо суп', price: 290 },
      { id: 'sm-3', name: 'Эдамаме', price: 320 }
    ],
    image: 'SM'
  },
  {
    id: 4,
    restaurantId: '4',
    restaurant: 'Шаурма House',
    date: '1 февраля, 19:45',
    status: 'delivered',
    total: 560,
    items: [
      { id: 'sh-1', name: 'Шаурма классическая', price: 420 },
      { id: 'sh-2', name: 'Айран', price: 140 }
    ],
    image: 'SH'
  },
  {
    id: 5,
    restaurantId: '5',
    restaurant: 'Coffee Bean',
    date: '28 января, 10:30',
    status: 'delivered',
    total: 720,
    items: [
      { id: 'cb-1', name: 'Латте', price: 320 },
      { id: 'cb-2', name: 'Чизкейк', price: 290 },
      { id: 'cb-3', name: 'Круассан', price: 110 }
    ],
    image: 'CB'
  }
];

const STATUS_MAP: Record<string, { label: string; color: string; bgLight: string; bgDark: string }> = {
  delivered: { label: 'Доставлен', color: '#16a34a', bgLight: '#f0fdf4', bgDark: '#1a2a24' },
  in_progress: { label: 'В пути', color: '#ea580c', bgLight: '#fff7ed', bgDark: '#2d2416' },
  cancelled: { label: 'Отменён', color: '#dc2626', bgLight: '#fef2f2', bgDark: '#2d1820' }
};

const TRACKING_ICONS: Record<string, { set: string; name: string }> = {
  confirmed: { set: 'feather', name: 'check-circle' },
  preparing: { set: 'material', name: 'restaurant' },
  on_way: { set: 'material', name: 'delivery-dining' },
  delivered: { set: 'feather', name: 'flag' }
};

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'completed', label: 'Завершённые' }
];

function TrackingTimeline({ steps }: { steps: TrackingStep[] }) {
  const activeIndex = steps.findIndex((s) => !s.done);
  const currentStep = activeIndex === -1 ? steps.length - 1 : activeIndex;
  const { colors, isDark } = useTheme();

  return (
    <View className="mt-1 mb-1">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCurrent = index === currentStep;
        const isDone = step.done;
        const icon = TRACKING_ICONS[step.key] || { set: 'feather', name: 'circle' };

        return (
          <View key={step.key} className="flex-row">
            {/* Линия + точка */}
            <View className="items-center" style={{ width: 32 }}>
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isDone ? '#ea580c' : isCurrent ? (isDark ? '#2d2416' : '#fff7ed') : (isDark ? colors.elevated : '#f5f5f4'),
                  borderWidth: isCurrent && !isDone ? 2 : 0,
                  borderColor: '#ea580c'
                }}
              >
                <Icon
                  set={icon.set}
                  name={icon.name}
                  size={14}
                  color={isDone ? '#fff' : isCurrent ? '#ea580c' : (isDark ? colors.textMuted : '#a8a29e')}
                />
              </View>
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    height: 28,
                    backgroundColor: isDone ? '#ea580c' : (isDark ? colors.border : '#e7e5e4')
                  }}
                />
              )}
            </View>

            {/* Текст */}
            <View className="flex-1 ml-3 pb-4">
              <Text
                className="text-sm font-bold"
                style={{ color: isDone || isCurrent ? (isDark ? colors.text : '#1c1917') : (isDark ? colors.textMuted : '#a8a29e') }}
              >
                {step.label}
              </Text>
              {step.time && (
                <Text className="text-xs text-stone-400 dark:text-dark-muted mt-0.5">{step.time}</Text>
              )}
              {isCurrent && !isDone && (
                <View className="flex-row items-center gap-1 mt-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <Text className="text-xs font-semibold" style={{ color: '#ea580c' }}>
                    Сейчас
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function Orders() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal, openGlobalModal } = useGlobalModalStore();
  const { addItem, setActiveRestaurant, clearCart } = useCartStore();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const onRepeatOrder = (order: Order) => {
    clearCart(order.restaurantId);
    order.items.forEach((item) => {
      addItem(order.restaurantId, order.restaurant, {
        id: item.id,
        name: item.name,
        price: item.price,
        modifiers: []
      });
    });
    setActiveRestaurant(order.restaurantId);
    openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
  };

  const onToggleExpand = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const filtered = ORDERS.filter((order) => {
    if (activeTab === 'active') return order.status === 'in_progress';
    if (activeTab === 'completed') return order.status === 'delivered' || order.status === 'cancelled';
    return true;
  });

  const activeCount = ORDERS.filter((o) => o.status === 'in_progress').length;

  return (
    <View className="bg-stone-100 dark:bg-dark-bg flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View className="bg-white dark:bg-dark-surface border-b border-stone-200 dark:border-dark-border" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 pb-3">
          <Text className="text-xl font-bold dark:text-dark-text">Мои заказы</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeGlobalModal}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-dark-elevated justify-center items-center"
          >
            <Icon set="ant" name="close" size={16} color={isDark ? colors.text : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Табы */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-3">
          <View className="flex-row gap-2">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key)}
                className="px-4 py-2 rounded-full border flex-row items-center gap-1.5"
                style={{
                  borderColor: activeTab === tab.key ? (isDark ? '#EA004B' : '#1c1917') : (isDark ? colors.border : '#d4d4d4'),
                  backgroundColor: activeTab === tab.key ? (isDark ? '#EA004B' : '#1c1917') : (isDark ? colors.elevated : '#fff')
                }}
              >
                <Text className={`text-sm font-bold ${activeTab === tab.key ? 'text-white' : 'dark:text-dark-text'}`} style={{ color: activeTab === tab.key ? '#fff' : (isDark ? colors.text : '#57534e') }}>
                  {tab.label}
                </Text>
                {tab.key === 'active' && activeCount > 0 && (
                  <View
                    className="w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: activeTab === 'active' ? '#ea580c' : (isDark ? '#2d2416' : '#fff7ed') }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{ color: activeTab === 'active' ? '#fff' : '#ea580c' }}
                    >
                      {activeCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {filtered.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          {filtered.map((order, index) => {
            const status = STATUS_MAP[order.status];
            const isActive = order.status === 'in_progress';
            const isExpanded = expandedOrderId === order.id;

            return (
              <TouchableOpacity
                key={order.id}
                activeOpacity={0.7}
                onPress={() => isActive && onToggleExpand(order.id)}
                className={`mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border ${index === 0 ? 'mt-4' : 'mt-3'}`}
                style={{ borderColor: isActive ? '#fdba74' : (isDark ? colors.border : '#e7e5e4') }}
              >
                {/* Оранжевый верхний акцент для активных */}
                {isActive && (
                  <View className="h-1" style={{ backgroundColor: '#ea580c' }} />
                )}

                <View className="p-4">
                  {/* Верх: ресторан + статус */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: isActive ? (isDark ? '#2d2416' : '#fff7ed') : (isDark ? colors.elevated : '#f5f5f4') }}
                      >
                        <Text
                          className="font-bold text-xs"
                          style={{ color: isActive ? '#ea580c' : (isDark ? colors.textMuted : '#78716c') }}
                        >
                          {order.image}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-bold dark:text-dark-text">{order.restaurant}</Text>
                        <Text className="text-stone-400 dark:text-dark-muted text-xs">{order.date}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: isDark ? status.bgDark : status.bgLight }}>
                        <Text className="text-xs font-bold" style={{ color: status.color }}>
                          {status.label}
                        </Text>
                      </View>
                      {isActive && (
                        <Icon
                          set="feather"
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={isDark ? colors.textMuted : '#a8a29e'}
                        />
                      )}
                    </View>
                  </View>

                  {/* Время доставки для активных */}
                  {isActive && order.estimatedTime && (
                    <View className="flex-row items-center gap-2 mb-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: isDark ? '#2d2416' : '#fff7ed' }}>
                      <Icon set="feather" name="clock" size={16} color="#ea580c" />
                      <Text className="text-sm font-bold" style={{ color: '#ea580c' }}>
                        Ожидаемое время: {order.estimatedTime}
                      </Text>
                    </View>
                  )}

                  {/* Раскрытый контент */}
                  {isActive && isExpanded && (
                    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
                      {/* Трекинг */}
                      {order.tracking && (
                        <View className="mb-3">
                          <TrackingTimeline steps={order.tracking} />
                        </View>
                      )}

                      {/* Курьер */}
                      {order.courierName && (
                        <View className="flex-row items-center gap-3 p-3 rounded-xl mb-3" style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4' }}>
                          <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: isDark ? '#2d2416' : '#fed7aa' }}>
                            <Icon set="feather" name="user" size={16} color="#ea580c" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-xs text-stone-400 dark:text-dark-muted">Курьер</Text>
                            <Text className="font-bold text-sm dark:text-dark-text">{order.courierName}</Text>
                          </View>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            className="w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: isDark ? '#2d2416' : '#fed7aa' }}
                          >
                            <Icon set="feather" name="phone" size={16} color="#ea580c" />
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Состав заказа */}
                      <Text className="text-xs font-bold text-stone-400 dark:text-dark-muted mb-2">Состав заказа</Text>
                      <View className="rounded-xl overflow-hidden mb-1" style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4' }}>
                        {order.items.map((item, i) => (
                          <View
                            key={item.id}
                            className={`flex-row justify-between px-3 py-2.5 ${
                              i < order.items.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''
                            }`}
                          >
                            <Text className="text-sm text-stone-600 dark:text-dark-muted flex-1" numberOfLines={1}>{item.name}</Text>
                            <Text className="text-sm font-bold text-stone-700 dark:text-dark-text ml-2">{item.price} ₽</Text>
                          </View>
                        ))}
                      </View>
                    </Animated.View>
                  )}

                  {/* Состав заказа (свернутый, для не-активных или свёрнутых активных) */}
                  {(!isActive || !isExpanded) && (
                    <Text className="text-stone-500 dark:text-dark-muted text-sm mb-3">
                      {order.items.map((i) => i.name).join(', ')}
                    </Text>
                  )}

                  {/* Низ: сумма + кнопка */}
                  <View className="flex-row items-center justify-between pt-3 border-t border-stone-100 dark:border-dark-border">
                    <Text className="font-bold text-lg dark:text-dark-text">{order.total} ₽</Text>

                    {order.status === 'delivered' && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onRepeatOrder(order)}
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: '#EA004B' }}
                      >
                        <Text className="text-white text-sm font-bold">Повторить</Text>
                      </TouchableOpacity>
                    )}

                    {isActive && !isExpanded && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onToggleExpand(order.id)}
                        className="px-4 py-2 rounded-full flex-row items-center gap-1.5"
                        style={{ backgroundColor: isDark ? '#2d2416' : '#fff7ed' }}
                      >
                        <Icon set="feather" name="map-pin" size={14} color="#ea580c" />
                        <Text className="text-sm font-bold" style={{ color: '#ea580c' }}>Отследить</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Icon set="feather" name="shopping-bag" size={48} color={isDark ? colors.border : '#d4d4d4'} />
          <Text className="text-stone-400 dark:text-dark-muted text-center mt-4 text-lg">Нет заказов</Text>
          <Text className="text-stone-400 dark:text-dark-muted text-center text-sm mt-1">
            {activeTab === 'active' ? 'Активных заказов пока нет' : 'Здесь будет история ваших заказов'}
          </Text>
        </View>
      )}
    </View>
  );
}
