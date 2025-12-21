import React from 'react';
import { ScrollView, StatusBar, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutRestaurants() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="px-4 flex-1 bg-white"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" />

      <Text>AboutRestaurants</Text>
    </ScrollView>
  );
}
