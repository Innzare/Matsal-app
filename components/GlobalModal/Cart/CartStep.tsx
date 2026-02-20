import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useCartStore, CartItem } from '@/store/useCartStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GROCERY_STORES } from '@/constants/resources';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';

const GROCERY_IDS = new Set(GROCERY_STORES.map((s) => String(s.id)));

function CartItemRow({ item, restaurantId, accentColor }: { item: CartItem; restaurantId: string; accentColor: string }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { colors, isDark } = useTheme();
  const modifiersTotal = item.modifiers.reduce((s, m) => s + m.price, 0);
  const itemTotal = (item.price + modifiersTotal) * item.quantity;

  return (
    <View className="flex-row p-4 gap-3">
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: 70, height: 70, borderRadius: 12 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={200}
        />
      )}

      <View className="flex-1 justify-between">
        <View className="flex-row justify-between items-start">
          <Text className="font-bold text-stone-700 dark:text-dark-text flex-1 mr-2">{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(restaurantId, item.id)} activeOpacity={0.7}>
            <Icon set="feather" name="trash-2" size={18} color={isDark ? colors.textMuted : '#a8a29e'} />
          </TouchableOpacity>
        </View>

        {item.modifiers.length > 0 && (
          <Text className="text-xs text-stone-400 dark:text-dark-muted mt-0.5">{item.modifiers.map((m) => m.label).join(', ')}</Text>
        )}

        <View className="flex-row justify-between items-center mt-2">
          <Text className="font-bold text-sm" style={{ color: accentColor }}>
            {itemTotal} ₽
          </Text>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => updateQuantity(restaurantId, item.id, item.quantity - 1)}
              className="w-8 h-8 border border-stone-200 dark:border-dark-border rounded-full bg-stone-100 dark:bg-dark-elevated justify-center items-center"
            >
              <Icon set="feather" name="minus" size={16} color={isDark ? colors.text : '#57534e'} />
            </TouchableOpacity>

            <Text className="font-bold w-4 text-center dark:text-dark-text">{item.quantity}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => updateQuantity(restaurantId, item.id, item.quantity + 1)}
              className="w-8 h-8 border border-stone-200 dark:border-dark-border rounded-full bg-stone-100 dark:bg-dark-elevated justify-center items-center"
            >
              <Icon set="feather" name="plus" size={16} color={isDark ? colors.text : '#57534e'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

interface CartStepProps {
  restaurantId: string;
  onNext: () => void;
}

export default function CartStep({ restaurantId, onNext }: CartStepProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { getTotal, getDeliveryPrice, getCartItems } = useCartStore();
  const items = getCartItems(restaurantId);
  const { closeGlobalModal } = useGlobalModalStore();
  const [promoCode, setPromoCode] = useState('');
  const isGrocery = GROCERY_IDS.has(restaurantId);
  const accentColor = isGrocery ? '#16a34a' : '#EA004B';

  const subtotal = getTotal(restaurantId);
  const delivery = getDeliveryPrice(restaurantId);
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Icon set="feather" name="shopping-cart" size={48} color={isDark ? colors.border : '#d4d4d4'} />
        <Text className="text-stone-400 dark:text-dark-muted text-center mt-4 text-lg">Корзина пуста</Text>
        <Text className="text-stone-400 dark:text-dark-muted text-center text-sm mt-1">
          {isGrocery ? 'Добавьте товары из магазина' : 'Добавьте блюда из меню ресторана'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            closeGlobalModal();
            const path = isGrocery ? `/groceries/${restaurantId}` : `/restaurants/${restaurantId}`;
            setTimeout(() => router.push(path as any), 100);
          }}
          className="mt-6 px-8 py-3 rounded-full"
          style={{ backgroundColor: accentColor }}
        >
          <Text className="text-white font-bold">
            {isGrocery ? 'Перейти в магазин' : 'Перейти в меню'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Товары */}
        <Text className="text-sm font-bold text-stone-600 dark:text-dark-text px-4 mt-4 mb-2">Ваш заказ ({items.length})</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          {items.map((item, index) => (
            <View key={item.id + JSON.stringify(item.modifiers)}>
              <CartItemRow item={item} restaurantId={restaurantId} accentColor={accentColor} />
              {index < items.length - 1 && <View className="h-[1px] bg-stone-100 dark:bg-dark-border mx-4" />}
            </View>
          ))}
        </View>

        {/* Добавить ещё */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            closeGlobalModal();
            const path = isGrocery ? `/groceries/${restaurantId}` : `/restaurants/${restaurantId}`;
            setTimeout(() => router.push(path as any), 100);
          }}
          className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border flex-row items-center justify-center p-4 gap-2"
        >
          <Icon set="feather" name="plus" size={20} color={accentColor} />
          <Text className="font-bold" style={{ color: accentColor }}>
            Добавить ещё
          </Text>
        </TouchableOpacity>

        {/* Промокод */}
        <Text className="text-sm font-bold text-stone-600 dark:text-dark-text px-4 mt-5 mb-2">Промокод</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border flex-row items-center px-4">
          <Icon set="materialCom" name="ticket-percent-outline" size={20} color={isDark ? colors.textMuted : '#a8a29e'} />
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Введите промокод"
            placeholderTextColor={isDark ? colors.textMuted : '#a8a29e'}
            className="flex-1 py-3.5 px-3 text-sm dark:text-dark-text"
          />
          {promoCode.length > 0 && (
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="font-bold text-sm" style={{ color: accentColor }}>
                Применить
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Итого */}
        <Text className="text-sm font-bold text-stone-600 dark:text-dark-text px-4 mt-5 mb-2">Детали заказа</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-stone-500 dark:text-dark-muted text-sm">Подытог</Text>
            <Text className="font-bold text-sm text-stone-700 dark:text-dark-text">{subtotal} ₽</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-stone-500 dark:text-dark-muted text-sm">Доставка</Text>
            <Text className="font-bold text-sm" style={{ color: delivery === 0 ? '#16a34a' : (isDark ? colors.text : '#57534e') }}>
              {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
            </Text>
          </View>
          <View className="h-[1px] bg-stone-100 dark:bg-dark-border my-2" />
          <View className="flex-row justify-between">
            <Text className="font-bold text-stone-700 dark:text-dark-text">Итого</Text>
            <Text className="font-bold text-lg" style={{ color: accentColor }}>
              {total} ₽
            </Text>
          </View>
        </View>

        {delivery > 0 && (
          <View className="mx-4 mt-3 flex-row items-start gap-2 px-2">
            <Icon set="feather" name="info" size={14} color={isDark ? colors.textMuted : '#a8a29e'} />
            <Text className="text-stone-400 dark:text-dark-muted text-xs flex-1">
              Бесплатная доставка от 500 ₽. Добавьте ещё на {500 - subtotal} ₽
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Кнопка оформить */}
      <View className="px-5 pt-3 border-t border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface" style={{ paddingBottom: insets.bottom + 4 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNext}
          className="h-[50px] rounded-full items-center justify-center flex-row gap-2"
          style={{ backgroundColor: accentColor }}
        >
          <Text className="text-white font-bold text-base">Оформить заказ</Text>
          <Text className="text-white/70 font-bold text-base">{total} ₽</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
