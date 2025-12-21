import { Modal, View } from 'react-native';
import React from 'react';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import Settings from './Settings';
import Addresses from './Addresses';
import Orders from './Orders';
import AddAddressPage from './AddAddressPage';

export default function GlobalModal() {
  const { isGlobalModalOpen, contentString } = useGlobalModalStore();

  const renderContent = () => {
    switch (contentString) {
      case GLOBAL_MODAL_CONTENT.SETTINGS:
        return <Settings />;

      case GLOBAL_MODAL_CONTENT.ADDRESSES:
        return <Addresses />;

      case GLOBAL_MODAL_CONTENT.ORDERS:
        return <Orders />;

      case GLOBAL_MODAL_CONTENT.ADD_ADDRESS:
        return <AddAddressPage />;

      default:
        return <Addresses />;
    }
  };

  return (
    <Modal visible={isGlobalModalOpen} animationType="slide" transparent>
      <View className="flex-1 bg-black">{renderContent()}</View>
    </Modal>
  );
}
