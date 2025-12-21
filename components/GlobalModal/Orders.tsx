import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useIsFocused } from '@react-navigation/native';

export default function Orders() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const isFocused = useIsFocused();

  return (
    <View className="bg-slate-100 flex-1 relative">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View
        className="relative bg-white flex-row items-center justify-between px-6 pb-2 gap-2 border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-xl font-bold">Заказы</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={closeGlobalModal}
          className="w-[30px] h-[30px] justify-center items-center"
        >
          <Icon set="ant" name="close" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
