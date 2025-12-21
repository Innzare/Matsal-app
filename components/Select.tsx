import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { Text } from './Text';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import Animated from 'react-native-reanimated';
import { CustomRadio } from './CustomRadio';

const options = [{ label: 'Грозный', value: 'grozny' }];

export function Select() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const insets = useSafeAreaInsets();

  return (
    <>
      <View>
        <Text className="text-stone-600 text-sm -mb-1">Город</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center justify-between border-b border-stone-400 h-[40px]"
          onPress={() => setVisible(true)}
        >
          <Text className="text-lg font-bold">{selected.label}</Text>

          <Icon set="material" name="keyboard-arrow-down" color="#777" />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}
        ></Pressable>

        <View
          style={{
            marginTop: -15,
            backgroundColor: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            // paddingTop: 24,
            // paddingHorizontal: 18,
            paddingBottom: insets.bottom + 20
            // gap: 14
          }}
        >
          <View className="flex-row items-center justify-between px-8 py-3 mb-6 border-b border-stone-200">
            <Text className="text-lg font-semibold">Список городов:</Text>

            <TouchableOpacity onPress={() => setVisible(false)} className="p-2">
              <Icon set="ant" name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="px-6 gap-4">
            {options.map((item) => {
              const isSelected = item.value === selected.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  className="flex-row items-center gap-3 border border-stone-300 px-4 rounded-xl"
                  onPress={() => {
                    setSelected(item);
                    setVisible(false);
                  }}
                  style={{ paddingVertical: 12 }}
                >
                  <CustomRadio selected={isSelected} />
                  <Text className="text-xl font-bold">{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mx-6 p-6 mt-6 relative bg-stone-50 border border-stone-200 rounded-2xl flex-row gap-4 items-center">
            <Icon name="info-circle" set="ant" size={24} color="orange" />
            <Text className="flex-1">
              На данный момент сервис работает только по городу <Text className="font-bold">Грозный</Text>
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
