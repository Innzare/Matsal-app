import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Addresses() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();

  const onBackPress = () => {
    router.back();
  };

  return (
    <View className="bg-slate-100 flex-1 relative">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View
        className="relative bg-white flex-row items-center px-4 py-3 gap-3 border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={onBackPress} className="flex-row items-center gap-2">
          <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
          <Text className="text-xl">Назад</Text>
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-5">
        <Text className="text-2xl font-bold">Редактирование профиля</Text>
      </View>
    </View>
  );
}
