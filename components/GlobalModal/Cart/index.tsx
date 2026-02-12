import { View, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useCartStore } from '@/store/useCartStore';
import { GROCERY_STORES } from '@/constants/resources';
import CartStep from './CartStep';
import CheckoutStep from './CheckoutStep';

const GROCERY_IDS = new Set(GROCERY_STORES.map((s) => String(s.id)));

const STEPS = [
  { key: 1, label: 'Меню' },
  { key: 2, label: 'Корзина' },
  { key: 3, label: 'Оплата' }
];

function StepIndicator({ activeStep, accentColor }: { activeStep: number; accentColor: string }) {
  return (
    <View className="flex-row items-center justify-center px-8 py-3">
      {STEPS.map((step, index) => {
        const isCompleted = step.key < activeStep;
        const isActive = step.key === activeStep;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={step.key}>
            <View className="items-center">
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor: isCompleted || isActive ? accentColor : '#e7e5e4'
                }}
              >
                {isCompleted ? (
                  <Icon set="feather" name="check" size={14} color="#fff" />
                ) : (
                  <Text
                    className="text-xs font-bold"
                    style={{ color: isActive ? '#fff' : '#a8a29e' }}
                  >
                    {step.key}
                  </Text>
                )}
              </View>
              <Text
                className="text-[10px] mt-1 font-semibold"
                style={{ color: isCompleted || isActive ? accentColor : '#a8a29e' }}
              >
                {step.label}
              </Text>
            </View>

            {!isLast && (
              <View
                className="flex-1 h-[2px] mx-2 -mt-3"
                style={{
                  backgroundColor: isCompleted ? accentColor : '#e7e5e4'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function Cart() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const { clearCart, activeRestaurantId } = useCartStore();
  const [activeStep, setActiveStep] = useState(2);

  const restaurantId = activeRestaurantId || '';
  const isGrocery = GROCERY_IDS.has(restaurantId);
  const accentColor = isGrocery ? '#16a34a' : '#EA004B';
  const title = activeStep === 2 ? 'Корзина' : 'Оформление';

  const goToCheckout = () => setActiveStep(3);
  const goBackToCart = () => setActiveStep(2);

  const handlePlaceOrder = () => {
    clearCart(restaurantId);
    closeGlobalModal();
  };

  return (
    <View className="bg-stone-100 flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View className="bg-white border-b border-stone-200" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 pb-3">
          {activeStep === 3 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={goBackToCart}
              className="w-8 h-8 rounded-full bg-stone-100 justify-center items-center"
            >
              <Icon set="feather" name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
          ) : (
            <View className="w-8" />
          )}

          <Text className="text-xl font-bold">{title}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeGlobalModal}
            className="w-8 h-8 rounded-full bg-stone-100 justify-center items-center"
          >
            <Icon set="ant" name="close" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <StepIndicator activeStep={activeStep} accentColor={accentColor} />
      </View>

      {/* Контент */}
      {activeStep === 2 && <CartStep restaurantId={restaurantId} onNext={goToCheckout} />}
      {activeStep === 3 && <CheckoutStep restaurantId={restaurantId} accentColor={accentColor} onPlaceOrder={handlePlaceOrder} />}
    </View>
  );
}