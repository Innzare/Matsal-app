import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PHONE_MASK = ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];

export default function Register() {
  const { authStep } = useAuthStore();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      {authStep === 'phone' && <PhoneStep />}
      {authStep === 'code' && <CodeStep />}
      {authStep === 'register' && <FormStep />}
    </KeyboardAvoidingView>
  );
}

// ШАГ 1: Ввод телефона
function PhoneStep() {
  const { sendCode, isLoading, error, setError } = useAuthStore();
  const [phone, setPhone] = useState(''); // Только 10 цифр (без 7)

  const handleSendCode = async () => {
    if (phone.length !== 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    try {
      await sendCode('7' + phone);
    } catch {
      // Ошибка уже в store
    }
  };

  return (
    <View className="flex-1 px-6 pt-8">
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text className="text-2xl font-bold mb-2">Регистрация</Text>
        <Text className="text-stone-500 mb-6">Введите номер телефона для подтверждения</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <Text className="text-sm text-stone-600 mb-2">Телефон</Text>
        <View className="flex-row items-center border border-stone-300 rounded-xl px-4 h-[50]">
          <Icon set="feather" name="phone" size={20} color="#777" />
          <MaskedTextInput
            mask={PHONE_MASK}
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

        {error && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text className="text-red-500 mt-2">{error}</Text>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View className="mt-8" entering={FadeInDown.duration(400).delay(200)}>
        <TouchableOpacity
          activeOpacity={0.8}
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: '#EA004B' }}
          onPress={handleSendCode}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">{isLoading ? 'Отправка...' : 'Получить код'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ШАГ 2: Ввод кода
function CodeStep() {
  const { verifyCode, phone, isLoading, error, setError, resetAuthFlow } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleVerify = useCallback(
    async (fullCode: string) => {
      try {
        await verifyCode(fullCode);
      } catch {
        setCode(['', '', '', '']);
        inputs.current[0]?.focus();
      }
    },
    [verifyCode]
  );

  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 4) {
      handleVerify(fullCode);
    }
  }, [code, handleVerify]);

  const handleChange = (text: string, index: number) => {
    if (error) setError(null);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const formatPhone = (value: string) => {
    if (!value || value.length < 11) return value;
    return `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
  };

  return (
    <View className="flex-1 px-6 pt-4">
      <Animated.View entering={FadeInDown.duration(400)}>
        <TouchableOpacity onPress={resetAuthFlow} className="mb-4">
          <Text className="text-[#EA004B]">← Изменить номер</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-2">Введите код</Text>
        <Text className="text-stone-500 mb-8">Отправили SMS на {formatPhone(phone || '')}</Text>
      </Animated.View>

      <Animated.View className="flex-row justify-between mb-6" entering={FadeInDown.duration(400).delay(100)}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            className="w-16 h-16 border-2 rounded-xl text-center text-2xl font-bold"
            style={{ borderColor: error ? '#ef4444' : '#d6d3d1' }}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            editable={!isLoading}
          />
        ))}
      </Animated.View>

      {error && (
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        </Animated.View>
      )}

      {isLoading && <Text className="text-center text-stone-500">Проверяем код...</Text>}
    </View>
  );
}

// ШАГ 3: Форма регистрации
function FormStep() {
  const { register, phone, isLoading, error, setError } = useAuthStore();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Введите имя');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов');
      return;
    }

    try {
      await register(name.trim(), password);
    } catch {
      // Ошибка уже в store
    }
  };

  const formatPhone = (value: string) => {
    if (!value || value.length < 11) return value;
    return `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
  };

  return (
    <View className="flex-1 px-6 pt-8">
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text className="text-2xl font-bold mb-2">Создание аккаунта</Text>
        <Text className="text-stone-500 mb-8">Номер {formatPhone(phone || '')} подтверждён</Text>
      </Animated.View>

      <Animated.View className="mb-4" entering={FadeInDown.duration(400).delay(100)}>
        <Text className="text-sm text-stone-600 mb-2">Ваше имя</Text>
        <View className="flex-row items-center border border-stone-300 rounded-xl px-4 h-[50]">
          <Icon set="feather" name="user" size={20} color="#777" />
          <TextInput
            className="flex-1 py-4 ml-3 text-base"
            placeholder="Как вас зовут?"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError(null);
            }}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>
      </Animated.View>

      <Animated.View className="mb-4" entering={FadeInDown.duration(400).delay(200)}>
        <Text className="text-sm text-stone-600 mb-2">Придумайте пароль</Text>
        <View className="flex-row items-center border border-stone-300 rounded-xl px-4 h-[50]">
          <Icon set="feather" name="lock" size={20} color="#777" />
          <TextInput
            className="flex-1 py-4 ml-3 text-base"
            placeholder="Минимум 6 символов"
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

      {error && (
        <Animated.View className="mb-4" entering={FadeInDown.duration(300)}>
          <Text className="text-red-500 text-center">{error}</Text>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.duration(400).delay(300)}>
        <TouchableOpacity
          activeOpacity={0.8}
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: '#EA004B' }}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">{isLoading ? 'Создание...' : 'Создать аккаунт'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
