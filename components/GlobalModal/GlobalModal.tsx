import { Modal, View } from 'react-native';
import React from 'react';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import Addresses from './Addresses';
import Orders from './Orders';
import AddAddressPage from './AddAddressPage';
import Auth from './Auth';
import Payment from './Payment';
import Cart from './Cart';

export default function GlobalModal() {
  const { isGlobalModalOpen, contentString, presentationStyle, closeGlobalModal } = useGlobalModalStore();

  const renderContent = () => {
    switch (contentString) {
      case GLOBAL_MODAL_CONTENT.ADDRESSES:
        return <Addresses />;

      case GLOBAL_MODAL_CONTENT.ORDERS:
        return <Orders />;

      case GLOBAL_MODAL_CONTENT.ADD_ADDRESS:
        return <AddAddressPage />;

      case GLOBAL_MODAL_CONTENT.AUTH:
        return <Auth />;

      case GLOBAL_MODAL_CONTENT.PAYMENT:
        return <Payment />;

      case GLOBAL_MODAL_CONTENT.CART:
        return <Cart />;

      default:
        return <Addresses />;
    }
  };

  return (
    <Modal
      visible={isGlobalModalOpen}
      animationType="slide"
      presentationStyle={presentationStyle}
      onRequestClose={() => closeGlobalModal()}
    >
      <View className="flex-1 bg-black">{renderContent()}</View>
    </Modal>
  );
}
