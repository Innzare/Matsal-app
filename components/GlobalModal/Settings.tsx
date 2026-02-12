import { View, TouchableOpacity, StatusBar, ScrollView, Switch, Linking } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <View className="bg-stone-100 flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Хедер */}
      <View className="bg-white border-b border-stone-200" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 pb-3">
          <Text className="text-xl font-bold">Настройки</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeGlobalModal}
            className="w-8 h-8 rounded-full bg-stone-100 justify-center items-center"
          >
            <Icon set="ant" name="close" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Уведомления */}
        <Text className="text-sm font-bold text-stone-400 px-4 mt-4 mb-2">Уведомления</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          <View className="flex-row items-center justify-between p-4 border-b border-stone-100">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="ion" name="notifications-outline" size={22} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Push-уведомления</Text>
                <Text className="text-stone-400 text-xs">Статусы заказов и акции</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#d4d4d4', true: '#EA004B' }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="volume-2" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Звуки</Text>
                <Text className="text-stone-400 text-xs">Звук при получении уведомлений</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#d4d4d4', true: '#EA004B' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Приложение */}
        <Text className="text-sm font-bold text-stone-400 px-4 mt-4 mb-2">Приложение</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          <View className="flex-row items-center justify-between p-4 border-b border-stone-100">
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="map-pin" size={20} color="#EA004B" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700">Геолокация</Text>
                <Text className="text-stone-400 text-xs">Для поиска ресторанов рядом</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#d4d4d4', true: '#EA004B' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="globe" size={20} color="#EA004B" />
              </View>
              <View>
                <Text className="font-bold text-stone-700">Язык</Text>
                <Text className="text-stone-400 text-xs">Русский</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-pink-50 items-center justify-center">
                <Icon set="feather" name="trash-2" size={20} color="#EA004B" />
              </View>
              <View>
                <Text className="font-bold text-stone-700">Очистить кэш</Text>
                <Text className="text-stone-400 text-xs">Освободить место на устройстве</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>
        </View>

        {/* О приложении */}
        <Text className="text-sm font-bold text-stone-400 px-4 mt-4 mb-2">О приложении</Text>
        <View className="mx-4 bg-white rounded-2xl overflow-hidden border border-stone-200">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                <Icon set="feather" name="shield" size={20} color="#57534e" />
              </View>
              <Text className="font-bold text-stone-700">Политика конфиденциальности</Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                <Icon set="feather" name="file-text" size={20} color="#57534e" />
              </View>
              <Text className="font-bold text-stone-700">Условия использования</Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color="#777" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 items-center justify-center">
                <Icon set="feather" name="info" size={20} color="#57534e" />
              </View>
              <Text className="font-bold text-stone-700">Версия</Text>
            </View>
            <Text className="text-stone-400 text-sm">1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
