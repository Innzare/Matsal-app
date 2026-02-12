import { View, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.ease) };

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const router = useRouter();

  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [nameFocused, setNameFocused] = useState(false);

  const nameInputStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(nameFocused ? '#EA004B' : '#c9c9c9', TIMING_CONFIG)
  }));

  const onBackPress = () => {
    router.back();
  };

  const onSavePress = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите имя');
      return;
    }

    try {
      await updateProfile({ name: name.trim() });
      Alert.alert('Успешно', 'Профиль обновлён', [{ text: 'OK', onPress: onBackPress }]);
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось обновить профиль');
    }
  };

  return (
    <View className="bg-white flex-1 relative">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      <View
        className="relative bg-white flex-row items-center justify-between px-4 py-3 border-b border-stone-200"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={onBackPress} className="flex-row items-center gap-1">
          <Icon set="material" name="keyboard-arrow-left" size={23} color="#000" />
          <Text className="text-lg">Назад</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={onSavePress} disabled={isLoading}>
          <Text className="text-lg font-bold" style={{ color: '#EA004B' }}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-6 mt-6">
        <Text className="text-2xl font-bold mb-6">Редактирование профиля</Text>

        <View className="mb-5">
          <Text className="text-sm font-semibold text-stone-500 mb-2">Имя</Text>
          <Animated.View
            className="flex-row items-center rounded-2xl px-4 bg-slate-50"
            style={[
              {
                height: 56,
                // backgroundColor: '#fafaf9',
                borderWidth: 1.5
              },
              nameInputStyle
            ]}
          >
            <Icon set="feather" name="user" size={20} color={nameFocused ? '#EA004B' : '#a8a29e'} />
            <TextInput
              className="flex-1 py-4 ml-3 text-base leading-5"
              placeholder="Введите имя"
              placeholderTextColor="#a8a29e"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
          </Animated.View>
        </View>

        <View className="mb-5">
          <Text className="text-sm font-semibold text-stone-500 mb-2">Телефон</Text>
          <View
            className="flex-row items-center rounded-2xl px-4"
            style={{
              height: 56,
              backgroundColor: '#f5f5f4',
              borderWidth: 1.5,
              borderColor: '#e7e5e4'
            }}
          >
            <Icon set="feather" name="phone" size={20} color="#c4c1be" />
            <Text className="flex-1 py-4 ml-3 text-base text-stone-400">
              +{user?.phone?.slice(0, 1)} ({user?.phone?.slice(1, 4)}) {user?.phone?.slice(4, 7)}-
              {user?.phone?.slice(7, 9)}-{user?.phone?.slice(9, 11)}
            </Text>
          </View>
          <Text className="text-xs text-stone-400 mt-1.5">Телефон нельзя изменить</Text>
        </View>
      </View>
    </View>
  );
}
