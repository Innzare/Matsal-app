import Addresses from '@/components/GlobalModal/Addresses';
import { Icon } from '@/components/Icon';
import { Text } from '@/components/Text';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useAddressesStore } from '@/store/useAddressesStore';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Carts() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const { openGlobalBottomSheet } = useBottomSheetStore();
  const router = useRouter();

  const { activeAddressId, addresses } = useAddressesStore();

  const activeAddress = addresses.find((address) => address.id === activeAddressId);

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
    <View className="flex-1 bg-white">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View className="border-b border-stone-200 py-1 px-6" style={{ paddingTop: insets.top }}>
        <Text className="text-xl font-bold mt-2">Корзина</Text>

        <TouchableOpacity onPress={onAddressesPress} activeOpacity={0.7} className="flex-row items-center">
          <Text className="text-sm">Доставить до:</Text>

          <View className="ml-2">
            <Text className="font-semibold text-sm">{activeAddress?.streetWithHouse}</Text>
          </View>

          <Icon set="material" name="arrow-drop-down" size={21} />
        </TouchableOpacity>
      </View>

      <View className="items-center justify-center flex-1 pb-[150px]">
        <View className="items-center">
          <View className="w-[100px] h-[100px] justify-center items-center mb-6 rounded-xl bg-stone-100 transform mt-10">
            <Icon set="feather" name="shopping-bag" size={42} color="red" />
          </View>

          <Text className="font-bold text-2xl max-w-[350px] text-center leading-tight">
            Ваша корзина пока что пуста 🧑🏻‍🍳
          </Text>

          <Text className="font-bold text-stone-500 text-center mt-4 px-10 leading-normal ">
            Самое время что-нибудь заказать!
          </Text>

          <TouchableOpacity
            onPress={onGoHomePress}
            activeOpacity={0.7}
            className="px-6 py-3 rounded-xl mt-6 bg-red-500 flex-row items-center gap-2"
          >
            <Text className="text-white font-bold">Перейти к заведениям</Text>
            <Icon set="material" name="keyboard-arrow-right" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
