import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RestaurantsList() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="px-6">
      <Text className="text-lg">RestaurantsList</Text>
    </View>
  );
}
