import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Text';
import React from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { Icon } from './Icon';

export default function MenuSectionsList(props: any) {
  const { sections = [], onTabPress } = props;

  const insets = useSafeAreaInsets();
  const { closeGlobalBottomSheet } = useBottomSheetStore();

  return (
    <BottomSheetScrollView>
      <View style={{ paddingBottom: insets.bottom }}>
        <View className="items-center py-4 pb-6 mb-2 border-b border-stone-200">
          <Text className="uppercase font-bold">Разделы в Меню</Text>
        </View>

        <View className="px-4 gap-3 mt-4">
          {sections.map((item: any, index: number) => {
            if (item === 'sticky') return null;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                className="p-3 bg-stone-100 rounded-lg flex-row items-center justify-between"
                onPress={() => {
                  onTabPress(index + 1);
                  closeGlobalBottomSheet();
                }}
              >
                <Text className="font-bold">{item.title}</Text>

                <Icon set="feather" name="arrow-right" color="#aaa" />
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={closeGlobalBottomSheet}
            className="bg-stone-200 text-center rounded-lg mt-4 py-6 items-center border border-stone-400"
          >
            <Text className="uppercase font-bold">Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetScrollView>
  );
}
