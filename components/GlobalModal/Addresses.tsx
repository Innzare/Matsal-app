import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useIsFocused } from '@react-navigation/native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { CustomRadio } from '../CustomRadio';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useAddressesStore } from '@/store/useAddressesStore';
import { SwipeRow } from '@/components/SwipeableItem';

// const addressesList = [
//   {
//     id: 0,
//     city: 'Грозный',
//     address: 'Магаданская 14',
//     location: {
//       lon: 40.434,
//       lat: 42.865
//     }
//   },
//   {
//     id: 1,
//     city: 'Грозный',
//     address: 'Вольная 34',
//     location: {
//       lon: 40.434,
//       lat: 42.865
//     }
//   },
//   {
//     id: 2,
//     city: 'Грозный',
//     address: 'Возрождения 11',
//     location: {
//       lon: 40.434,
//       lat: 42.865
//     }
//   },
//   {
//     id: 3,
//     city: 'Грозный',
//     address: 'Путина 2',
//     location: {
//       lon: 40.434,
//       lat: 42.865
//     }
//   }
// ];

const AddressItem = ({ data, onPress, onDelete, onEditPress, selected }: any) => {
  return (
    <SwipeRow onDelete={() => onDelete(data.id)}>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row gap-4 items-center justify-between"
        onPress={() => onPress(data.id)}
      >
        <View className="flex-row gap-4 items-center">
          <CustomRadio selected={selected}></CustomRadio>

          <View>
            <Text className="text-sm font-bold">{data.streetWithHouse}</Text>
            <Text className="text-sm text-stone-600">{data.city}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onEditPress} activeOpacity={0.7} className="p-2">
          <Icon set="feather" name="edit-2" size={18} color="#555" />
        </TouchableOpacity>
      </TouchableOpacity>
    </SwipeRow>
  );
};

export default function Addresses() {
  const insets = useSafeAreaInsets();
  const { closeGlobalBottomSheet } = useBottomSheetStore();
  const { openGlobalModal } = useGlobalModalStore();
  const isFocused = useIsFocused();

  const { addresses, activeAddressId, setActiveAddressId, setAddressForEdit, removeAddress } = useAddressesStore();

  const onAddressPress = (id: number) => {
    setActiveAddressId(id);
  };

  const onAddAddressPress = () => {
    openGlobalModal(GLOBAL_MODAL_CONTENT.ADD_ADDRESS);
  };

  const onEditAddressPress = (address: any) => {
    setAddressForEdit(address);
    openGlobalModal(GLOBAL_MODAL_CONTENT.ADD_ADDRESS);
  };

  const onAddressDelete = (id: number) => {
    if (addresses.length === 1) return;

    removeAddress(id);

    if (addresses.length > 1) {
      const addressesWithoutDeleted = addresses.filter((address) => address.id !== id);
      setActiveAddressId(addressesWithoutDeleted[0].id);
    }
  };

  return (
    <View className="flex-1 bg-slate-100 relative rounded-t-2xl overflow-hidden border border-stone-200">
      {isFocused ? <StatusBar barStyle="light-content" /> : null}

      <View
        className="relative bg-white flex-row items-center justify-between px-6 py-3 gap-2 border-b border-stone-200"
        // style={{ paddingTop: insets.top }}
      >
        <Text className="text-xl font-bold">Адреса</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={closeGlobalBottomSheet}
          className="w-[30px] h-[30px] justify-center items-center"
        >
          <Icon set="ant" name="close" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 mt-6">
          <Text className="font-bold text-xl mb-1">Куда нужно доставить заказ?</Text>
          <Text className="text-sm text-stone-600">Ваши сохраненные адреса:</Text>
        </View>

        <View className="py-6 flex-1">
          <View className="gap-2">
            {addresses.map((item: any, index) => {
              const isSelected = item.id === activeAddressId;

              return (
                <AddressItem
                  key={item.id}
                  data={item}
                  selected={isSelected}
                  onPress={onAddressPress}
                  onDelete={() => onAddressDelete(item.id)}
                  onEditPress={() => onEditAddressPress(item)}
                />
              );
            })}
          </View>
        </View>
      </BottomSheetScrollView>

      <View>
        <View className="flex-row items-center gap-3 mb-4 mx-4 px-4 py-2 bg-stone-100 border border-stone-200 rounded-xl">
          <Icon set="feather" name="info" size={18} color="#555" />
          <Text className="text-sm text-stone-600 font-semibold">Свайп влево для удаления</Text>
        </View>

        <TouchableOpacity
          onPress={onAddAddressPress}
          activeOpacity={0.7}
          style={{ backgroundColor: '#EA004B' }}
          className="flex-row gap-2 mb-4 mt-2 mx-4 p-4 justify-center items-center rounded-xl"
        >
          <Text className="font-bold text-white">Добавить адрес</Text>

          <Icon set="feather" name="map-pin" size={21} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
