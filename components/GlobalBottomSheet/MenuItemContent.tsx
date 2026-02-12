import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '@/store/useCartStore';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';

const MODIFIERS = [
  {
    id: 'size',
    title: 'Размер порции',
    required: true,
    options: [
      { id: 's', label: 'Стандартная', price: 0 },
      { id: 'l', label: 'Большая', price: 80 }
    ]
  },
  {
    id: 'extras',
    title: 'Добавки',
    required: false,
    options: [
      { id: 'cheese', label: 'Сыр', price: 50 },
      { id: 'sauce', label: 'Соус', price: 30 },
      { id: 'greens', label: 'Зелень', price: 20 }
    ]
  }
];

export default function MenuItemContent({ item, restaurantId, restaurantName }: any) {
  const [itemsCount, setItemsCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState('s');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const insets = useSafeAreaInsets();
  const { addItem, setActiveRestaurant } = useCartStore();
  const { closeGlobalBottomSheet } = useBottomSheetStore();
  const { openGlobalModal } = useGlobalModalStore();

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const extrasTotal =
    MODIFIERS.find((m) => m.id === 'extras')
      ?.options.filter((o) => selectedExtras.includes(o.id))
      .reduce((sum, o) => sum + o.price, 0) || 0;

  const sizeExtra = MODIFIERS.find((m) => m.id === 'size')?.options.find((o) => o.id === selectedSize)?.price || 0;

  const basePrice = typeof item.price === 'number' ? item.price : parseInt(item.price) || 0;
  const totalPrice = (basePrice + sizeExtra + extrasTotal) * itemsCount;

  return (
    <>
      <BottomSheetScrollView>
        {/* Изображение */}
        <View className="px-4 pt-2">
          <Image
            source={{ uri: item.image }}
            style={{ height: 220, borderRadius: 16 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={300}
          />
        </View>

        <View className="px-5 pt-4 pb-4">
          {/* Название и цена */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold flex-1 mr-3">{item.name}</Text>
            <Text className="text-xl font-bold" style={{ color: '#EA004B' }}>
              {basePrice} ₽
            </Text>
          </View>

          {/* Описание */}
          {item.description ? (
            <Text className="text-stone-500 text-sm mb-4 leading-5">{item.description}</Text>
          ) : (
            <Text className="text-stone-400 text-sm mb-4 leading-5">Вкусное блюдо из нашего меню</Text>
          )}

          {/* Инфо: вес, калории */}
          <View className="flex-row gap-4 mb-5">
            <View className="flex-row items-center gap-1.5">
              <Icon set="materialCom" name="weight" size={16} color="#a8a29e" />
              <Text className="text-stone-400 text-xs">{item.weight || '250 г'}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Icon set="materialCom" name="fire" size={16} color="#a8a29e" />
              <Text className="text-stone-400 text-xs">{item.calories || '320 ккал'}</Text>
            </View>
          </View>

          {/* Модификаторы */}
          {MODIFIERS.map((modifier) => (
            <View key={modifier.id} className="mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Text className="text-sm font-bold text-stone-700">{modifier.title}</Text>
                {modifier.required && (
                  <View className="px-2 py-0.5 rounded-full bg-pink-50">
                    <Text className="text-xs font-bold" style={{ color: '#EA004B' }}>
                      Обязательно
                    </Text>
                  </View>
                )}
              </View>

              <View className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {modifier.options.map((option, index) => {
                  const isSelected =
                    modifier.id === 'size' ? selectedSize === option.id : selectedExtras.includes(option.id);

                  return (
                    <TouchableOpacity
                      key={option.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (modifier.id === 'size') {
                          setSelectedSize(option.id);
                        } else {
                          toggleExtra(option.id);
                        }
                      }}
                      className={`flex-row items-center justify-between p-3.5 ${
                        index < modifier.options.length - 1 ? 'border-b border-stone-100' : ''
                      }`}
                    >
                      <Text className={`text-sm ${isSelected ? 'font-bold text-stone-800' : 'text-stone-600'}`}>
                        {option.label}
                      </Text>

                      <View className="flex-row items-center gap-3">
                        {option.price > 0 && <Text className="text-xs text-stone-400">+{option.price} ₽</Text>}

                        <View
                          className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                            isSelected ? 'border-transparent' : 'border-stone-300'
                          }`}
                          style={isSelected ? { backgroundColor: '#EA004B' } : {}}
                        >
                          {isSelected && <Icon set="feather" name="check" size={12} color="#fff" />}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </BottomSheetScrollView>

      {/* Нижняя панель */}
      <View
        className="flex-row items-center px-5 pt-3 border-t border-stone-200"
        style={{ paddingBottom: insets.bottom + 4 }}
      >
        {/* Счётчик */}
        <View className="flex-row items-center gap-3 mr-4">
          <TouchableOpacity
            disabled={itemsCount <= 1}
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 bg-stone-100 w-14 h-9 justify-center items-center"
            onPress={() => setItemsCount((prev) => prev - 1)}
            style={{ opacity: itemsCount <= 1 ? 0.4 : 1 }}
          >
            <Icon set="feather" name="minus" size={18} color="#57534e" />
          </TouchableOpacity>

          <Text className="font-bold text-lg w-5 text-center">{itemsCount}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            className="rounded-full border border-stone-200 bg-stone-100 w-14 h-9 justify-center items-center"
            onPress={() => setItemsCount((prev) => prev + 1)}
          >
            <Icon set="feather" name="plus" size={18} color="#57534e" />
          </TouchableOpacity>
        </View>

        {/* Кнопка добавления */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const sizeOption = MODIFIERS.find((m) => m.id === 'size')?.options.find((o) => o.id === selectedSize);
            const extrasOptions =
              MODIFIERS.find((m) => m.id === 'extras')?.options.filter((o) => selectedExtras.includes(o.id)) || [];

            const modifiers = [
              ...(sizeOption && sizeOption.price > 0
                ? [{ id: sizeOption.id, label: sizeOption.label, price: sizeOption.price }]
                : []),
              ...extrasOptions.map((o) => ({ id: o.id, label: o.label, price: o.price }))
            ];

            addItem(restaurantId, restaurantName, {
              id: item.id || item.name,
              name: item.name,
              price: basePrice,
              image: item.image,
              quantity: itemsCount,
              modifiers
            });

            closeGlobalBottomSheet();
            setActiveRestaurant(restaurantId);
            openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
          }}
          className="flex-1 flex-row justify-center items-center py-3.5 rounded-full gap-2"
          style={{ backgroundColor: '#EA004B' }}
        >
          <Text className="text-white font-bold text-base">В корзину</Text>
          <Text className="text-white/70 font-bold text-base">{totalPrice} ₽</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
