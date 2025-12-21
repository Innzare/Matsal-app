import { SplashScreen, Stack } from 'expo-router';
import { StatusBar, View, Dimensions } from 'react-native';

import '@/assets/styles/global.css';
import { GlobalBottomSheet } from '@/components/GlobalBottomSheet/GlobalBottomSheet';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomModal from '@/components/GlobalModal/CustomModal';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import GlobalModal from '@/components/GlobalModal/GlobalModal';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { YamapInstance } from 'react-native-yamap-plus';

import Constants from 'expo-constants';

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
  const animatedScale = useSharedValue(1);
  const sheetPosition = useSharedValue(SCREEN_HEIGHT);

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

  // useEffect(() => {
  //   if (error) throw error;

  //   if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded, error]);

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <View className="flex-1 bg-black">
          <Animated.View className="flex-1 relative bg-white rounded-2xl overflow-hidden" style={contentStyle}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

            <View className="flex-1 relative bg-white">
              <View className="flex-1">
                {/* <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} /> */}
                {/* <Stack screenOptions={{ headerShown: false, animation: 'none'}} /> */}
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ gestureEnabled: false, animation: 'none' }} />
                  <Stack.Screen name="restaurants" options={{ gestureEnabled: true }} />
                </Stack>
              </View>

              {/* <BottomNavigation /> */}
            </View>
          </Animated.View>

          {/* <CustomModal /> */}
          <GlobalModal />
          <GlobalBottomSheet onChangePostion={handleSheetPosition} />
        </View>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
