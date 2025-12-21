import BottomNavigation from '@/components/BottomNavigation';
import { useFonts } from 'expo-font';
import { SplashScreen, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, View } from 'react-native';

import '@/assets/styles/global.css';

export default function RootLayout() {
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

  return (
    <View className="flex-1 relative bg-white">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      <View className="flex-1 relative bg-white">
        <View className="flex-1">
          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
          {/* <Stack screenOptions={{ gestureEnabled: false, headerShown: false, animation: 'none' }} /> */}
        </View>

        <BottomNavigation />
      </View>
    </View>
  );
}
