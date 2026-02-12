import Addresses from '@/components/GlobalModal/Addresses';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useAddressesStore } from '@/store/useAddressesStore';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useCartStore, type RestaurantCart } from '@/store/useCartStore';
import { GROCERY_STORES } from '@/constants/resources';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GROCERY_IDS = new Set(GROCERY_STORES.map((s) => String(s.id)));

function CartCard({ cart }: { cart: RestaurantCart }) {
  const router = useRouter();
  const { setActiveRestaurant, clearCart } = useCartStore();
  const { openGlobalModal } = useGlobalModalStore();

  const isGrocery = GROCERY_IDS.has(cart.restaurantId);
  const accentColor = isGrocery ? '#16a34a' : '#EA004B';

  const itemsCount = cart.items.reduce((s: number, i: any) => s + i.quantity, 0);
  const total = cart.items.reduce((sum: number, i: any) => {
    const modTotal = i.modifiers.reduce((s: number, m: any) => s + m.price, 0);
    return sum + (i.price + modTotal) * i.quantity;
  }, 0);
  const delivery = isGrocery ? (total >= 1000 ? 0 : 99) : total >= 1500 ? 0 : 149;

  const onOpenCart = () => {
    setActiveRestaurant(cart.restaurantId);
    openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
  };

  const onGoToStore = () => {
    if (isGrocery) {
      router.push(`/groceries/${cart.restaurantId}`);
    } else {
      router.push(`/restaurants/${cart.restaurantId}`);
    }
  };

  return (
    <View className="mx-4 mb-3 bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Заголовок карточки */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onGoToStore}
        className="flex-row items-center justify-between p-4 border-b border-stone-100"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: isGrocery ? '#f0fdf4' : '#fdf2f8' }}
          >
            <Icon
              set={isGrocery ? 'material' : 'ion'}
              name={isGrocery ? 'local-grocery-store' : 'fast-food'}
              size={20}
              color={accentColor}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-stone-800">{cart.restaurantName}</Text>
              {isGrocery && (
                <View className="bg-green-100 rounded px-1.5 py-0.5">
                  <Text className="text-[10px] font-bold" style={{ color: '#16a34a' }}>
                    Продукты
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-stone-400 text-xs mt-0.5">
              {itemsCount} {itemsCount === 1 ? 'товар' : itemsCount < 5 ? 'товара' : 'товаров'}
            </Text>
          </View>
        </View>
        <Icon set="feather" name="chevron-right" size={20} color="#a8a29e" />
      </TouchableOpacity>

      {/* Список товаров (превью первых 3) */}
      <View className="px-4 py-3">
        {cart.items.slice(0, 3).map((item, index) => {
          const modifiersTotal = item.modifiers.reduce((s, m) => s + m.price, 0);
          const itemTotal = (item.price + modifiersTotal) * item.quantity;

          return (
            <View
              key={item.id + JSON.stringify(item.modifiers)}
              className={`flex-row items-center justify-between py-2 ${
                index < Math.min(cart.items.length, 3) - 1 ? 'border-b border-stone-50' : ''
              }`}
            >
              <View className="flex-row items-center gap-2 flex-1">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: isGrocery ? '#f0fdf4' : '#f5f5f4' }}
                >
                  <Text className="text-xs font-bold" style={{ color: isGrocery ? '#16a34a' : '#78716c' }}>
                    {item.quantity}
                  </Text>
                </View>
                <Text className="text-sm text-stone-600 flex-1" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text className="text-sm font-bold text-stone-700 ml-2">{itemTotal} ₽</Text>
            </View>
          );
        })}

        {cart.items.length > 3 && (
          <Text className="text-xs text-stone-400 mt-1">
            и ещё {cart.items.length - 3} {cart.items.length - 3 === 1 ? 'позиция' : 'позиций'}...
          </Text>
        )}
      </View>

      {/* Итого и действия */}
      <View className="px-4 pb-4 gap-3">
        <View className="flex-row justify-between items-center px-1">
          <Text className="text-stone-500 text-sm">{isGrocery ? 'Итого' : 'Итого с доставкой'}</Text>
          <Text className="font-bold text-base" style={{ color: accentColor }}>
            {total + delivery} ₽
          </Text>
        </View>

        {delivery === 0 && (
          <View className="flex-row items-center gap-1 px-1 -mt-1">
            <Icon set="material" name="local-shipping" size={14} color={accentColor} />
            <Text className="text-xs font-semibold" style={{ color: accentColor }}>
              Бесплатная доставка
            </Text>
          </View>
        )}

        <View className="flex-row gap-2">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => clearCart(cart.restaurantId)}
            className="h-[44px] rounded-xl bg-stone-100 items-center justify-center px-4"
          >
            <Icon set="feather" name="trash-2" size={18} color="#a8a29e" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenCart}
            className="flex-1 h-[44px] rounded-xl items-center justify-center flex-row gap-2"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-white font-bold text-sm">Оформить</Text>
            <Text className="text-white/70 font-bold text-sm">{total + delivery} ₽</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Carts() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();

  const { openGlobalBottomSheet } = useBottomSheetStore();
  const { carts: cartsMap } = useCartStore();
  const { activeAddressId, addresses } = useAddressesStore();

  const activeAddress = addresses.find((address) => address.id === activeAddressId);
  const carts = Object.values(cartsMap);

  const onAddressesPress = () => {
    openGlobalBottomSheet({
      content: <Addresses />,
      snaps: ['85%'],
      isBackgroundScalable: true,
      isIndicatorVisible: false
    });
  };

  const onGoHomePress = () => {
    router.push('/');
  };

  return (
    <View className="flex-1 bg-stone-100">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View className="bg-white border-b border-stone-200 py-1 px-6" style={{ paddingTop: insets.top }}>
        <Text className="text-xl font-bold mt-2">Корзина</Text>

        <TouchableOpacity onPress={onAddressesPress} activeOpacity={0.7} className="flex-row items-center">
          <Text className="text-sm">Доставить до:</Text>

          <View className="ml-2">
            <Text className="font-semibold text-sm">{activeAddress?.streetWithHouse}</Text>
          </View>

          <Icon set="material" name="arrow-drop-down" size={21} />
        </TouchableOpacity>
      </View>

      {carts.length === 0 ? (
        <View className="items-center justify-center flex-1 pb-[150px]">
          <View className="items-center">
            <View className="w-[130px] h-[130px] justify-center items-center mb-8 rounded-xl bg-white border border-stone-200 transform mt-10">
              <Icon set="feather" name="shopping-bag" size={62} color="#EA004B" />
            </View>

            <Text className="font-bold text-2xl max-w-[350px] text-center leading-tight text-stone-800">
              Корзина пуста
            </Text>

            <Text className="text-stone-500 text-center mt-2 px-10 leading-5">
              Добавьте блюда из ресторанов или товары из магазинов
            </Text>

            <View className="flex-row items-center gap-3 mt-6">
              <TouchableOpacity
                onPress={onGoHomePress}
                activeOpacity={0.7}
                className="px-6 py-3.5 rounded-full flex-row items-center gap-2"
                style={{ backgroundColor: '#EA004B' }}
              >
                <Text className="text-white font-bold">Рестораны</Text>
                <Icon set="feather" name="arrow-right" color="#fff" size={18} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/groceries')}
                activeOpacity={0.7}
                className="px-6 py-3.5 rounded-full flex-row items-center gap-2"
                style={{ backgroundColor: '#16a34a' }}
              >
                <Text className="text-white font-bold">Магазины</Text>
                <Icon set="feather" name="arrow-right" color="#fff" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-sm font-bold text-stone-400 px-5 mb-3">
            {carts.length} {carts.length === 1 ? 'корзина' : carts.length < 5 ? 'корзины' : 'корзин'}
          </Text>

          {carts.map((cart) => (
            <CartCard key={cart.restaurantId} cart={cart} />
          ))}

          <TouchableOpacity
            onPress={onGoHomePress}
            activeOpacity={0.7}
            className="mx-4 mt-1 bg-white rounded-2xl border border-stone-200 flex-row items-center justify-center p-4 gap-2"
          >
            <Icon set="feather" name="plus" size={20} color="#EA004B" />
            <Text className="font-bold" style={{ color: '#EA004B' }}>
              Заказать из ресторана
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/groceries')}
            activeOpacity={0.7}
            className="mx-4 mt-2 bg-white rounded-2xl border border-stone-200 flex-row items-center justify-center p-4 gap-2"
          >
            <Icon set="feather" name="plus" size={20} color="#16a34a" />
            <Text className="font-bold" style={{ color: '#16a34a' }}>
              Заказать из магазина
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
