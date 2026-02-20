import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
      }}
    />
  );
}
