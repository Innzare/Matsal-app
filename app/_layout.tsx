import { SplashScreen, Stack } from 'expo-router';
import { StatusBar, View, Dimensions, ActivityIndicator, Text } from 'react-native';

import '@/assets/styles/global.css';
import { GlobalBottomSheet } from '@/components/GlobalBottomSheet/GlobalBottomSheet';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomModal from '@/components/GlobalModal/CustomModal';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import GlobalModal from '@/components/GlobalModal/GlobalModal';
import { GlobalToast } from '@/components/GlobalToast/GlobalToast';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { YamapInstance } from 'react-native-yamap-plus';

import { useAuthStore } from '@/store/useAuthStore';
import Constants from 'expo-constants';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';

// import Onboarding from '@/components/Onboarding/Onboarding';
import { Onboarding } from '@/components/Onboarding/routes/onboarding';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';

import { useColorScheme } from 'nativewind';
import { useThemeStore } from '@/store/useThemeStore';

const YANDEX_MAP_KEY = Constants.expoConfig?.extra?.YANDEX_MAP_KEY;

YamapInstance.setLocale('ru_RU');
YamapInstance.init(YANDEX_MAP_KEY);

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function RootLayout() {
  // const [fontsLoaded, error] = useFonts({
  //   'Panton-Bold': require('@/assets/fonts/Panton-Bold.ttf'),
  //   'Panton-Light': require('@/assets/fonts/Panton-Light.ttf'),
  //   'Panton-Italic': require('@/assets/fonts/Panton-Italic.ttf'),
  //   'Panton-Regular': require('@/assets/fonts/Panton-Regular.ttf'),
  //   'Panton-SemiBold': require('@/assets/fonts/Panton-SemiBold.ttf')
  // });

  // const { isGlobalModalOpen, isMainContentScalable } = useGlobalModalStore();
  // const { isGlobalBottomSheetOpen, position } = useBottomSheetStore();
  const { checkAuth, hasSeenOnboarding, completeOnboarding } = useAuthStore();

  // Тема
  const { setColorScheme } = useColorScheme();
  const { themeMode, loadTheme, isLoaded: isThemeLoaded } = useThemeStore();

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isThemeLoaded) return;
    if (themeMode === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(themeMode);
    }
  }, [themeMode, isThemeLoaded]);

  // 🆕 СОСТОЯНИЕ ДЛЯ SPLASH SCREEN
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const animatedScale = useSharedValue(1);
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);

  // const { openGlobalModal } = useGlobalModalStore();

  useAnimatedReaction(
    () => sheetPosition,
    (isOpen) => {
      // animatedScale.value = isOpen ? withTiming(0.87, { duration: 200 }) : withTiming(1, { duration: 200 });
      animatedScale.value = interpolate(
        sheetPosition.value,
        [SCREEN_HEIGHT, 0], // 300 — высота снаппоинта (пример)
        [1, 0.85],
        Extrapolation.CLAMP
      );
    }
  );

  // 🆕 ПРОВЕРЯЕМ АВТОРИЗАЦИЮ И ГОТОВИМ ПРИЛОЖЕНИЕ
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Проверяем авторизацию
        await checkAuth();

        // Минимальное время показа splash screen (чтобы анимация успела доиграть)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // if (!isAuthenticated) {
        //   openGlobalModal(GLOBAL_MODAL_CONTENT.AUTH);
        // }

        setAppReady(true);
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setAppReady(true);
      }
    };

    prepareApp();
  }, []);

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }]
    };
  });


  const handleSheetPosition = (pos: number) => {
    // pos: 0 = закрыт, max = открыт
    console.log('pos', pos);

    sheetPosition.value = pos;
  };

  // 🆕 ОБРАБОТЧИК ЗАВЕРШЕНИЯ SPLASH
  const handleSplashFinish = () => {
    setShowSplash(false);

    // Если пользователь не видел onboarding - показываем
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  };

  // 🆕 ОБРАБОТЧИК ЗАВЕРШЕНИЯ ONBOARDING
  const handleOnboardingComplete = async () => {
    await completeOnboarding();
    setShowOnboarding(false);
  };

  // useEffect(() => {
  //   if (error) throw error;

  //   if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded, error]);

  // // 🆕 ПРОВЕРЯЕМ АВТОРИЗАЦИЮ ПРИ ЗАПУСКЕ
  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // 🆕 ПОКАЗЫВАЕМ SPLASH SCREEN
  if (showSplash) {
    return <AnimatedSplashScreen onFinish={handleSplashFinish} />;
  }

  // 🆕 ПОКАЗЫВАЕМ ONBOARDING
  if (showOnboarding) {
    // return <Onboarding onComplete={handleOnboardingComplete} />;
    return (
      <GestureHandlerRootView>
        <Onboarding onComplete={handleOnboardingComplete} />
      </GestureHandlerRootView>
    );
  }

  // 🆕 ПОКАЗЫВАЕМ ЗАГРУЗКУ ПОСЛЕ SPLASH
  if (!appReady) {
    return (
      <View className="flex-1 bg-white dark:bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#EA004B" />
        <Text className="mt-4 text-stone-600 dark:text-dark-muted">Подготовка...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <View className="flex-1 bg-black">
          <Animated.View
            className="flex-1 relative bg-white dark:bg-dark-bg rounded-2xl overflow-hidden"
            style={contentStyle}
          >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

            <View className="flex-1 relative bg-white dark:bg-dark-bg">
              <View className="flex-1">
                {/* <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} /> */}
                {/* <Stack screenOptions={{ headerShown: false, animation: 'none'}} /> */}
                <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom', animationDuration: 300 }}>
                  {/* <Stack.Screen
                    name="auth"
                    options={{ gestureEnabled: false, animation: 'slide_from_bottom', animationDuration: 400 }}
                  /> */}

                  <Stack.Screen
                    name="(tabs)"
                    options={{ gestureEnabled: false, animation: 'slide_from_bottom', animationDuration: 400 }}
                  />

                  {/* 🆕 RESTAURANTS - SLIDE FROM RIGHT */}
                  <Stack.Screen
                    name="restaurants"
                    options={{
                      gestureEnabled: true,
                      animation: 'slide_from_right',
                      animationDuration: 300,
                      gestureDirection: 'horizontal'
                    }}
                  />

                  {/* 🆕 NOTIFICATIONS - SLIDE FROM RIGHT */}
                  <Stack.Screen
                    name="notifications"
                    options={{
                      gestureEnabled: true,
                      animation: 'slide_from_right',
                      animationDuration: 300
                    }}
                  />

                  {/* 🆕 EDIT PROFILE - SLIDE FROM RIGHT */}
                  <Stack.Screen
                    name="edit-profile"
                    options={{
                      gestureEnabled: true,
                      animation: 'slide_from_right',
                      animationDuration: 300
                    }}
                  />

                  {/* 🆕 GROCERIES - SLIDE FROM RIGHT */}
                  <Stack.Screen
                    name="groceries"
                    options={{
                      gestureEnabled: true,
                      animation: 'slide_from_right',
                      animationDuration: 300,
                      gestureDirection: 'horizontal'
                    }}
                  />

                  <Stack.Screen
                    name="settings"
                    options={{
                      gestureEnabled: true,
                      animation: 'slide_from_right',
                      animationDuration: 300,
                      gestureDirection: 'horizontal'
                    }}
                  />
                </Stack>
              </View>

              {/* <BottomNavigation /> */}
            </View>

          </Animated.View>

          {/* <CustomModal /> */}
          <GlobalModal />
          <GlobalBottomSheet onChangePostion={handleSheetPosition} />
          <GlobalToast />
        </View>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
