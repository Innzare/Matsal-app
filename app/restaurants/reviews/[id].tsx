import React from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';

// Моковые отзывы
const REVIEWS = [
  {
    id: 1,
    name: 'Ахмед М.',
    rating: 5,
    date: '2 дня назад',
    text: 'Отличная еда! Пицца была горячей и вкусной. Доставили за 30 минут. Рекомендую всем!',
    order: 'Пицца Маргарита, Кола'
  },
  {
    id: 2,
    name: 'Мадина К.',
    rating: 4,
    date: '5 дней назад',
    text: 'Вкусно, но доставка немного задержалась. В целом всё хорошо, буду заказывать ещё.',
    order: 'Шаурма, Картофель фри'
  },
  {
    id: 3,
    name: 'Рустам А.',
    rating: 5,
    date: '1 неделю назад',
    text: 'Лучшие суши в городе! Всегда свежие, порции большие. Курьер вежливый.',
    order: 'Сет Филадельфия'
  },
  {
    id: 4,
    name: 'Патимат Д.',
    rating: 3,
    date: '2 недели назад',
    text: 'Еда нормальная, но упаковка могла бы быть лучше. Соус пролился.',
    order: 'Донер, Айран'
  },
  {
    id: 5,
    name: 'Магомед И.',
    rating: 5,
    date: '2 недели назад',
    text: 'Заказываю каждую неделю. Качество стабильно высокое. Молодцы!',
    order: 'Пицца Пепперони, Кофе'
  },
  {
    id: 6,
    name: 'Амина С.',
    rating: 4,
    date: '3 недели назад',
    text: 'Очень вкусный кофе и десерты. Приятное обслуживание.',
    order: 'Латте, Чизкейк'
  }
];

const RatingStars = ({ rating }: { rating: number }) => (
  <View className="flex-row gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        set="ant"
        name={star <= rating ? 'star' : 'staro'}
        size={14}
        color={star <= rating ? '#f59e0b' : '#d4d4d4'}
      />
    ))}
  </View>
);

export default function Reviews() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const restarauntsList = [...RESTAURANTS, ...RESTAURANTS2];
  const restaurant = restarauntsList.find((item) => Number(item.id) === Number(id));

  // Статистика рейтинга
  const stats = {
    average: 4.5,
    total: REVIEWS.length,
    distribution: [
      { stars: 5, count: 4 },
      { stars: 4, count: 2 },
      { stars: 3, count: 1 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 }
    ]
  };

  const maxCount = Math.max(...stats.distribution.map((d) => d.count));

  return (
    <View className="flex-1 bg-stone-100">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View
        className="bg-white flex-row items-center px-4 py-3 border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="flex-row items-center gap-1">
          <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
          <Text className="text-lg">Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Общий рейтинг */}
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden p-5">
          <Text className="text-lg font-bold mb-4">{restaurant?.name}</Text>

          <View className="flex-row items-center gap-6">
            {/* Средний балл */}
            <View className="items-center">
              <Text className="text-4xl font-bold">{stats.average}</Text>
              <RatingStars rating={Math.round(stats.average)} />
              <Text className="text-stone-500 text-sm mt-1">{stats.total} отзывов</Text>
            </View>

            {/* Распределение */}
            <View className="flex-1 gap-1.5">
              {stats.distribution.map((item) => (
                <View key={item.stars} className="flex-row items-center gap-2">
                  <Text className="text-xs text-stone-500 w-3">{item.stars}</Text>
                  <View className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: '#f59e0b',
                        width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%'
                      }}
                    />
                  </View>
                  <Text className="text-xs text-stone-400 w-4">{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Список отзывов */}
        <View className="mx-4 mt-3 bg-white rounded-2xl overflow-hidden">
          {REVIEWS.map((review, index) => (
            <View key={review.id} className={`p-5 ${index < REVIEWS.length - 1 ? 'border-b border-stone-100' : ''}`}>
              {/* Шапка отзыва */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-stone-200 items-center justify-center">
                    <Text className="font-bold text-stone-500">{review.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="font-bold">{review.name}</Text>
                    <RatingStars rating={review.rating} />
                  </View>
                </View>
                <Text className="text-stone-400 text-xs">{review.date}</Text>
              </View>

              {/* Текст отзыва */}
              <Text className="text-stone-600 leading-5 mb-2">{review.text}</Text>

              {/* Заказ */}
              <View className="flex-row items-center gap-1.5">
                <Icon set="feather" name="shopping-bag" size={12} color="#a8a29e" />
                <Text className="text-stone-400 text-xs">{review.order}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
