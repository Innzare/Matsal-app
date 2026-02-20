import React, { useState } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Modal, TextInput, Keyboard, Alert } from 'react-native';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import { useTheme } from '@/hooks/useTheme';

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
      <Icon key={star} set="ant" name="star" size={14} color={star <= rating ? '#f59e0b' : '#d4d4d4'} />
    ))}
  </View>
);

export default function Reviews() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, поставьте оценку');
      return;
    }
    if (reviewText.trim().length === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, напишите отзыв');
      return;
    }

    // Здесь отправка отзыва на сервер
    Alert.alert('Спасибо!', 'Ваш отзыв успешно отправлен', [
      {
        text: 'OK',
        onPress: () => {
          setModalVisible(false);
          setRating(0);
          setReviewText('');
        }
      }
    ]);
  };

  return (
    <View className="flex-1 bg-stone-100 dark:bg-dark-bg">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View
        className="bg-white dark:bg-dark-surface flex-row items-center px-4 py-3 border-b border-stone-200 dark:border-dark-border"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} className="flex-row items-center gap-1">
          <Icon set="material" name="keyboard-arrow-left" size={23} color={isDark ? colors.text : '#000'} />
          <Text className="text-lg dark:text-dark-text">Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Общий рейтинг */}
        <View className="mx-4 mt-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden p-5">
          <Text className="text-lg font-bold mb-4 dark:text-dark-text">{restaurant?.name}</Text>

          <View className="flex-row items-center gap-6">
            {/* Средний балл */}
            <View className="items-center">
              <Text className="text-4xl font-bold dark:text-dark-text">{stats.average}</Text>
              <RatingStars rating={Math.round(stats.average)} />
              <Text className="text-stone-500 dark:text-dark-muted text-sm mt-1">{stats.total} отзывов</Text>
            </View>

            {/* Распределение */}
            <View className="flex-1 gap-1.5">
              {stats.distribution.map((item) => (
                <View key={item.stars} className="flex-row items-center gap-2">
                  <Text className="text-xs text-stone-500 dark:text-dark-muted w-3">{item.stars}</Text>
                  <View className="flex-1 h-2 bg-stone-100 dark:bg-dark-elevated rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: '#f59e0b',
                        width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%'
                      }}
                    />
                  </View>
                  <Text className="text-xs text-stone-400 dark:text-dark-muted w-4">{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Список отзывов */}
        <View className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden">
          {REVIEWS.map((review, index) => (
            <View key={review.id} className={`p-5 ${index < REVIEWS.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''}`}>
              {/* Шапка отзыва */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-stone-200 dark:bg-dark-elevated items-center justify-center">
                    <Text className="font-bold text-stone-500 dark:text-dark-text">{review.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text className="font-bold dark:text-dark-text">{review.name}</Text>
                    <RatingStars rating={review.rating} />
                  </View>
                </View>
                <Text className="text-stone-400 dark:text-dark-muted text-xs">{review.date}</Text>
              </View>

              {/* Текст отзыва */}
              <Text className="text-stone-600 dark:text-dark-muted leading-5 mb-2">{review.text}</Text>

              {/* Заказ */}
              <View className="flex-row items-center gap-1.5">
                <Icon set="feather" name="shopping-bag" size={12} color={isDark ? colors.textMuted : '#a8a29e'} />
                <Text className="text-stone-400 dark:text-dark-muted text-xs">{review.order}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Кнопка написать отзыв */}
      <View className="absolute bottom-0 left-0 right-0 px-4" style={{ paddingBottom: insets.bottom + 20 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          className="bg-white dark:bg-dark-surface rounded-full py-4 flex-row items-center justify-center gap-2"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.6 : 0.3,
            shadowRadius: 6,
            elevation: 8
          }}
        >
          <Icon set="feather" name="edit-3" size={18} color="#EA004B" />
          <Text className="font-bold" style={{ color: '#EA004B' }}>
            Написать отзыв
          </Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно для написания отзыва */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-stone-50 dark:bg-dark-bg">
          <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

          {/* Хедер модального окна */}
          <View className="bg-white dark:bg-dark-surface flex-row items-center justify-between px-4 py-5 border-b border-stone-200 dark:border-dark-border">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-base font-semibold" style={{ color: '#EA004B' }}>
                Отмена
              </Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold dark:text-dark-text">Новый отзыв</Text>

            <TouchableOpacity onPress={handleSubmitReview}>
              <Text className="text-base font-semibold" style={{ color: '#EA004B' }}>
                Готово
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4">
            {/* Название ресторана */}
            <View className="mt-4 bg-white dark:bg-dark-surface rounded-2xl p-4 border border-stone-200 dark:border-dark-border">
              <Text className="text-lg font-bold dark:text-dark-text">{restaurant?.name}</Text>
            </View>

            {/* Выбор оценки */}
            <View className="mt-3 bg-white dark:bg-dark-surface rounded-2xl p-4 border border-stone-200 dark:border-dark-border">
              <Text className="font-bold mb-3 dark:text-dark-text">Ваша оценка</Text>
              <View className="flex-row gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                    <Icon set="ant" name="star" size={36} color={star <= rating ? '#f59e0b' : (isDark ? colors.border : '#d4d4d4')} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Текст отзыва */}
            <View className="mt-3 bg-white dark:bg-dark-surface rounded-2xl p-4 border border-stone-200 dark:border-dark-border">
              <Text className="font-bold mb-3 dark:text-dark-text">Ваш отзыв</Text>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Расскажите о вашем опыте заказа..."
                placeholderTextColor={isDark ? colors.textMuted : '#a8a29e'}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="bg-stone-50 dark:bg-dark-elevated rounded-xl p-3 text-base dark:text-dark-text border border-stone-200 dark:border-dark-border"
                style={{
                  minHeight: 120,
                  fontFamily: 'System'
                }}
              />
              <Text className="text-xs text-stone-400 dark:text-dark-muted mt-2">{reviewText.length} / 500 символов</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
