import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Login() {
  const { login, error, isLoading, setError } = useAuthStore();

  const [phone, setPhone] = useState(''); // Только цифры (без маски)
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (phone.length !== 10 || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      // Добавляем 7 к номеру для API
      await login('7' + phone, password);
    } catch {
      // Ошибка уже установлена в store
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text className="text-2xl font-bold mb-2">Вход</Text>
          <Text className="text-stone-500 mb-6">Введите данные для входа</Text>
        </Animated.View>

        {/* Телефон */}
        <Animated.View className="mb-4" entering={FadeInDown.duration(600).delay(100)}>
          <Text className="text-sm text-stone-600 mb-2">Телефон</Text>
          <View className="flex-row items-center border border-stone-300 rounded-xl px-4 h-[50]">
            <Icon set="feather" name="phone" size={20} color="#777" />
            <MaskedTextInput
              mask={[
                '+',
                '7',
                ' ',
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/
              ]}
              value={phone}
              maxLength={18}
              className="flex-1 py-4 ml-3 text-base leading-5"
              placeholder="+7 (999) 999-99-99"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              editable={!isLoading}
              onChangeText={(_masked: string, unmasked: string) => {
                setPhone(unmasked);
                if (error) setError(null);
              }}
            />
          </View>
        </Animated.View>

        {/* Пароль */}
        <Animated.View className="mb-8" entering={FadeInDown.duration(600).delay(200)}>
          <Text className="text-sm text-stone-600 mb-2">Пароль</Text>
          <View className="flex-row items-center border border-stone-300 rounded-xl px-4 h-[50]">
            <Icon set="feather" name="lock" size={20} color="#777" />
            <TextInput
              className="flex-1 py-4 ml-3 text-base leading-5"
              placeholder="Введите пароль"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon set="feather" name={showPassword ? 'eye-off' : 'eye'} size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Ошибка */}
        {error && (
          <Animated.View className="mb-4" entering={FadeInDown.duration(300)}>
            <Text className="text-red-500 text-center">{error}</Text>
          </Animated.View>
        )}

        {/* Кнопка входа */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <TouchableOpacity
            activeOpacity={0.8}
            className="py-4 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#EA004B' }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-lg">{isLoading ? 'Вход...' : 'Войти'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
