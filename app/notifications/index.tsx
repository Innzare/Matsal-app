import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();

  const onBackPress = () => {
    router.back();
  };

  return (
    <View className="flex-1">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}
      <View
        className="px-4 pb-3 flex-row items-center gap-2 bg-white border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={onBackPress} className="flex-row items-center gap-2">
          <Icon set="material" name="keyboard-arrow-left" size={23} color="" />
          <Text className="text-xl">Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View className="p-6">
          <Text className="text-xl font-bold">Уведомления</Text>

          {Array.from({ length: 10 }).map((_, index) => (
            <View key={index} className="mt-4 p-4 bg-white border border-stone-200 rounded-lg">
              <Text className="font-bold text-stone-700">Уведомление {index + 1}</Text>
              <Text className="text-stone-600 mt-2">
                Это пример текста уведомления. Здесь может быть любая информация, которую вы хотите показать
                пользователю.
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
