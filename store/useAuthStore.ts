import { authApi } from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// Типы данных
interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

type AuthStep = 'phone' | 'code' | 'register' | 'login' | 'done';

interface AuthStore {
  // Состояния
  user: User | null; // Данные пользователя
  accessToken: string | null; // JWT токен
  refreshToken: string | null; // JWT токен
  isLoading: boolean; // Загрузка при проверке токена
  isAuthenticated: boolean; // Авторизован ли пользователь
  hasSeenOnboarding: boolean;

  //Sms Flow
  phone: string | null;
  authStep: AuthStep;
  isUserExists: boolean;
  error: string | null;

  // Действия
  sendCode: (phone: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  checkAuth: () => Promise<void>; // Проверка при запуске
  resetAuthFlow: () => void;
  completeOnboarding: () => Promise<void>;
  setError: (error: string | null) => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

// === ТЕСТОВЫЙ РЕЖИМ ===
const USE_MOCK = true; // Поставь false когда бэкенд доступен

const MOCK_USER: User = {
  id: '1',
  name: 'Ахмед Тестов',
  phone: '79991234567',
  email: 'test@matsal.app'
};

const MOCK_CREDENTIALS = {
  phone: '79991234567', // +7 (999) 123-45-67
  password: '123456'
};

const MOCK_ACCESS_TOKEN = 'mock-access-token-12345';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-12345';

// Ключи для хранения в AsyncStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';
const ONBOARDING_KEY = 'has_seen_onboarding';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  hasSeenOnboarding: false,
  phone: null,
  authStep: 'phone',
  isUserExists: false,
  error: null,

  setError: (error) => set({ error }),

  resetAuthFlow: () => set({ phone: null, authStep: 'phone', isUserExists: false, error: null }),

  // 📱 ШАГ 1: Отправка SMS кода
  sendCode: async (phone: string) => {
    try {
      set({ isLoading: true, error: null });
      await authApi.sendCode(phone);
      set({ phone, authStep: 'code', isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка отправки кода', isLoading: false });
      throw error;
    }
  },

  // ✅ ШАГ 2: Проверка кода (только для регистрации)
  verifyCode: async (code: string) => {
    const { phone } = get();
    if (!phone) throw new Error('Телефон не указан');

    try {
      set({ isLoading: true, error: null });
      await authApi.verifyCode(phone, code);

      // После проверки кода — переходим к форме регистрации
      set({
        authStep: 'register',
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Неверный код', isLoading: false });
      throw error;
    }
  },

  // 📝 ШАГ 3а: Регистрация (новый пользователь)
  register: async (name: string, password: string) => {
    const { phone } = get();
    if (!phone) throw new Error('Телефон не указан');

    try {
      set({ isLoading: true, error: null });
      const response = await authApi.register(phone, name, password);

      console.log('response', response);

      const { user, accessToken, refreshToken } = response;

      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        authStep: 'done',
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка регистрации', isLoading: false });
      throw error;
    }
  },

  // 🔐 Вход (существующий пользователь)
  login: async (phone: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Мок-режим
      if (USE_MOCK) {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (phone !== MOCK_CREDENTIALS.phone || password !== MOCK_CREDENTIALS.password) {
          throw new Error('Неверный телефон или пароль');
        }

        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, MOCK_ACCESS_TOKEN);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, MOCK_REFRESH_TOKEN);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(MOCK_USER));

        set({
          user: MOCK_USER,
          accessToken: MOCK_ACCESS_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }

      // Реальный API
      const { customer, accessToken, refreshToken } = await authApi.login(phone, password);

      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(customer));

      set({
        user: customer,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка входа', isLoading: false });
      throw error;
    }
  },

  // 🚪 Выход
  logout: async () => {
    const { refreshToken } = get();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      // Игнорируем ошибки logout
    }

    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      phone: null,
      authStep: 'phone',
      isUserExists: false
    });
  },

  // 🔄 Обновление токенов
  refreshTokens: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return false;

    try {
      const tokens = await authApi.refresh(refreshToken);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      return true;
    } catch (error) {
      // Токен истёк — выходим
      await get().logout();
      return false;
    }
  },

  // ✅ Проверка авторизации при запуске
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const hasSeenOnboarding = (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      const userJson = await AsyncStorage.getItem(USER_KEY);

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson);

        // Мок-режим — не проверяем токен на сервере
        if (USE_MOCK) {
          set({
            user,
            accessToken,
            refreshToken,
            hasSeenOnboarding,
            isAuthenticated: true,
            isLoading: false
          });
          return;
        }

        // Реальный API
        try {
          await authApi.getProfile(accessToken);
          set({
            user,
            accessToken,
            refreshToken,
            hasSeenOnboarding,
            isAuthenticated: true,
            isLoading: false
          });
        } catch {
          const refreshed = await get().refreshTokens();
          if (!refreshed) {
            set({ hasSeenOnboarding, isLoading: false });
          } else {
            set({
              user,
              hasSeenOnboarding,
              isAuthenticated: true,
              isLoading: false
            });
          }
        }
      } else {
        set({ hasSeenOnboarding, isLoading: false });
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      set({ isLoading: false });
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasSeenOnboarding: true });
  },

  // ✏️ Обновление профиля
  updateProfile: async (data: { name?: string; email?: string }) => {
    const { accessToken, user } = get();
    if (!accessToken) throw new Error('Не авторизован');

    try {
      set({ error: null });
      const updatedUser = await authApi.updateProfile(accessToken, data);

      // Обновляем user в store и AsyncStorage
      const newUser = { ...user, ...updatedUser };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

      set({ user: newUser });
    } catch (error: any) {
      set({ error: error.message || 'Ошибка обновления профиля' });
      throw error;
    }
  }
}));
