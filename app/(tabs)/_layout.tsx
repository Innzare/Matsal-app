import BottomNavigation from '@/components/BottomNavigation';
import { useFonts } from 'expo-font';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';

import { useAuthStore } from '@/store/useAuthStore';

import '@/assets/styles/global.css';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // const [fontsLoaded, error] = useFonts({
  //   'Panton-Bold': require('@/assets/fonts/Panton-Bold.ttf'),
  //   'Panton-Light': require('@/assets/fonts/Panton-Light.ttf'),
  //   'Panton-Italic': require('@/assets/fonts/Panton-Italic.ttf'),
  //   'Panton-Regular': require('@/assets/fonts/Panton-Regular.ttf'),
  //   'Panton-SemiBold': require('@/assets/fonts/Panton-SemiBold.ttf')
  // });

  // useEffect(() => {
  //   if (error) throw error;

  //   if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded, error]);

  // 🆕 ПОКАЗЫВАЕМ ЗАГРУЗКУ
  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#EA004B" />
        <Text className="mt-4 text-stone-600 dark:text-dark-muted">Загрузка...</Text>
      </View>
    );
  }

  // 🆕 ПЕРЕНАПРАВЛЯЕМ НА ЛОГИН ЕСЛИ НЕ АВТОРИЗОВАН
  // if (!isAuthenticated) {
  //   return <Redirect href="/auth/login" />;
  // }

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} className="flex-1 relative bg-white dark:bg-dark-bg">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <View className="flex-1 relative bg-white dark:bg-dark-bg">
        <View className="flex-1">
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: 'none' },
              animation: 'fade'
              // animationDuration: 200
            }}
          />
          {/* <Stack screenOptions={{ gestureEnabled: false, headerShown: false, animation: 'none' }} /> */}
        </View>

        <BottomNavigation />
      </View>
    </Animated.View>
  );
}
