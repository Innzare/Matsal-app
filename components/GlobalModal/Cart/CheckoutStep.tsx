import { View, TouchableOpacity, ScrollView, TextInput, Pressable, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useCartStore } from '@/store/useCartStore';
import { useAddressesStore } from '@/store/useAddressesStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface PaymentMethod {
  id: string;
  label: string;
  details: string;
  icon: { set: string; name: string; color: string };
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    label: 'Банковская карта',
    details: '•••• 4276',
    icon: { set: 'fontAwesome', name: 'credit-card', color: '#EA004B' }
  },
  {
    id: 'sbp',
    label: 'СБП',
    details: 'Система быстрых платежей',
    icon: { set: 'materialCom', name: 'bank-transfer', color: '#5B2D8E' }
  },
  {
    id: 'cash',
    label: 'Наличными',
    details: 'При получении',
    icon: { set: 'materialCom', name: 'cash', color: '#16a34a' }
  }
];

const DELIVERY_TIMES = [
  { id: 'asap', label: 'Как можно скорее', details: '30–45 мин' },
  { id: 'scheduled', label: 'К определённому времени', details: 'Выбрать время' }
];

interface CheckoutStepProps {
  restaurantId: string;
  accentColor: string;
  onPlaceOrder: () => void;
}

export default function CheckoutStep({ restaurantId, accentColor, onPlaceOrder }: CheckoutStepProps) {
  const insets = useSafeAreaInsets();
  const { getTotal, getDeliveryPrice } = useCartStore();
  const { addresses, activeAddressId, setActiveAddressId } = useAddressesStore();
  const { openGlobalModal, closeGlobalModal } = useGlobalModalStore();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedTime, setSelectedTime] = useState('asap');
  const [comment, setComment] = useState('');
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const activeAddress = addresses.find((a) => a.id === activeAddressId) || null;
  const subtotal = getTotal(restaurantId);
  const delivery = getDeliveryPrice(restaurantId);
  const total = subtotal + delivery;

  const onSelectAddress = (id: number) => {
    setActiveAddressId(id);
    setShowAddressPicker(false);
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Адрес доставки */}
        <Text className="text-sm font-bold text-stone-600 px-4 mt-4 mb-2">Адрес доставки</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          <TouchableOpacity
            onPress={() => setShowAddressPicker(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: accentColor + '15' }}>
                <Icon set="feather" name="map-pin" size={20} color={accentColor} />
              </View>
              <View className="flex-1">
                {activeAddress ? (
                  <>
                    <Text className="font-bold text-stone-700">{activeAddress.streetWithHouse}</Text>
                    <Text className="text-stone-400 text-xs mt-0.5">
                      {activeAddress.city}
                      {activeAddress.entrance ? `, подъезд ${activeAddress.entrance}` : ''}
                      {activeAddress.floor ? `, этаж ${activeAddress.floor}` : ''}
                      {activeAddress.flat ? `, кв. ${activeAddress.flat}` : ''}
                    </Text>
                  </>
                ) : (
                  <Text className="text-stone-400">Выберите адрес</Text>
                )}
              </View>
            </View>
            <Icon set="feather" name="chevron-right" size={20} color="#a8a29e" />
          </TouchableOpacity>
        </View>

        {/* Время доставки */}
        <Text className="text-sm font-bold text-stone-600 px-4 mt-5 mb-2">Время доставки</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          {DELIVERY_TIMES.map((time, index) => {
            const isSelected = selectedTime === time.id;
            return (
              <TouchableOpacity
                key={time.id}
                activeOpacity={0.7}
                onPress={() => setSelectedTime(time.id)}
                className={`flex-row items-center justify-between p-4 ${
                  index < DELIVERY_TIMES.length - 1 ? 'border-b border-stone-100' : ''
                }`}
              >
                <View>
                  <Text className={`text-sm ${isSelected ? 'font-bold text-stone-800' : 'text-stone-600'}`}>
                    {time.label}
                  </Text>
                  <Text className="text-xs text-stone-400 mt-0.5">{time.details}</Text>
                </View>
                <View
                  className="w-6 h-6 rounded-full border-2 items-center justify-center"
                  style={{ borderColor: isSelected ? accentColor : '#d4d4d4' }}
                >
                  {isSelected && <View className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: accentColor }} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Способ оплаты */}
        <Text className="text-sm font-bold text-stone-600 px-4 mt-5 mb-2">Способ оплаты</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          {PAYMENT_METHODS.map((method, index) => {
            const isSelected = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.7}
                onPress={() => setSelectedPayment(method.id)}
                className={`flex-row items-center justify-between p-4 ${
                  index < PAYMENT_METHODS.length - 1 ? 'border-b border-stone-100' : ''
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                    <Icon set={method.icon.set} name={method.icon.name} size={22} color={method.icon.color} />
                  </View>
                  <View>
                    <Text className={`text-sm ${isSelected ? 'font-bold text-stone-800' : 'text-stone-600'}`}>
                      {method.label}
                    </Text>
                    <Text className="text-xs text-stone-400 mt-0.5">{method.details}</Text>
                  </View>
                </View>
                <View
                  className="w-6 h-6 rounded-full border-2 items-center justify-center"
                  style={{ borderColor: isSelected ? accentColor : '#d4d4d4' }}
                >
                  {isSelected && <View className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: accentColor }} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Комментарий */}
        <Text className="text-sm font-bold text-stone-600 px-4 mt-5 mb-2">Комментарий</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200 px-4">
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Комментарий к заказу (необязательно)"
            placeholderTextColor="#a8a29e"
            multiline
            numberOfLines={3}
            className="py-3.5 text-sm"
            style={{ minHeight: 60, textAlignVertical: 'top' }}
          />
        </View>

        {/* Итого */}
        <Text className="text-sm font-bold text-stone-600 px-4 mt-5 mb-2">Итого</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200 p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-stone-500 text-sm">Подытог</Text>
            <Text className="font-bold text-sm text-stone-700">{subtotal} ₽</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-stone-500 text-sm">Доставка</Text>
            <Text className="font-bold text-sm" style={{ color: delivery === 0 ? '#16a34a' : '#57534e' }}>
              {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
            </Text>
          </View>
          <View className="h-[1px] bg-stone-100 my-2" />
          <View className="flex-row justify-between">
            <Text className="font-bold text-stone-700">К оплате</Text>
            <Text className="font-bold text-lg" style={{ color: accentColor }}>
              {total} ₽
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Кнопка оплатить */}
      <View className="px-5 pt-3 border-t border-stone-200 bg-white" style={{ paddingBottom: insets.bottom + 4 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPlaceOrder}
          className="h-[50px] rounded-full items-center justify-center flex-row gap-2"
          style={{ backgroundColor: accentColor }}
        >
          <Text className="text-white font-bold text-base">Оплатить</Text>
          <Text className="text-white/70 font-bold text-base">{total} ₽</Text>
        </TouchableOpacity>
      </View>

      {/* Оверлей выбора адреса */}
      {showAddressPicker && (
        <>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute inset-0 bg-black/50"
          >
            <Pressable className="flex-1" onPress={() => setShowAddressPicker(false)} />
          </Animated.View>

          <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(250)}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
            style={{ maxHeight: Dimensions.get('window').height * 0.6, paddingBottom: insets.bottom + 8 }}
          >
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded-full bg-stone-300" />
            </View>

            <View className="flex-row items-center justify-between px-5 pb-3 border-b border-stone-100">
              <Text className="text-lg font-bold">Адрес доставки</Text>
              <TouchableOpacity onPress={() => setShowAddressPicker(false)} activeOpacity={0.7}>
                <Icon set="ant" name="close" size={16} color="#a8a29e" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-4 pt-3">
              {addresses.map((address) => {
                const isActive = address.id === activeAddressId;
                return (
                  <TouchableOpacity
                    key={address.id}
                    activeOpacity={0.7}
                    onPress={() => onSelectAddress(address.id)}
                    className="flex-row items-center gap-3 p-3.5 mb-2 rounded-2xl border"
                    style={{
                      borderColor: isActive ? accentColor : '#e7e5e4',
                      backgroundColor: isActive ? accentColor + '10' : '#fff'
                    }}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: isActive ? accentColor : '#f5f5f4' }}
                    >
                      <Icon set="feather" name="map-pin" size={18} color={isActive ? '#fff' : '#a8a29e'} />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-bold ${isActive ? 'text-stone-800' : 'text-stone-600'}`}>
                        {address.streetWithHouse}
                      </Text>
                      <Text className="text-stone-400 text-xs mt-0.5">
                        {address.city}
                        {address.entrance ? `, подъезд ${address.entrance}` : ''}
                        {address.flat ? `, кв. ${address.flat}` : ''}
                      </Text>
                    </View>
                    {isActive && <Icon set="feather" name="check" size={20} color={accentColor} />}
                  </TouchableOpacity>
                );
              })}

              {/* Добавить новый адрес */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setShowAddressPicker(false);
                  closeGlobalModal();
                  setTimeout(() => {
                    openGlobalModal(GLOBAL_MODAL_CONTENT.ADD_ADDRESS);
                  }, 400);
                }}
                className="flex-row items-center gap-3 p-3.5 mb-2 rounded-2xl border border-dashed border-stone-300"
              >
                <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                  <Icon set="feather" name="plus" size={20} color={accentColor} />
                </View>
                <Text className="font-bold" style={{ color: accentColor }}>
                  Добавить новый адрес
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}
