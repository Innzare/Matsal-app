import { Text } from '@/components/Text';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Cart(props: any) {
  const { isOpen, close } = props;

  return (
    <>
      <View className="absolute top-0 left-0 bg-stone-950"></View>
      <Modal visible={isOpen} animationType="slide" transparent={true} backdropColor="gray">
        {/* <View style={styles.overlay}> */}
        <View style={styles.modal}>
          {/* Крестик */}
          <TouchableOpacity activeOpacity={0.7} style={styles.closeButton} onPress={close}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Контент */}
        </View>
        {/* </View> */}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  openButton: {
    padding: 12,
    backgroundColor: '#0069a8',
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  overlay: {
    // flex: 1,
    // borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '100%',
    position: 'absolute',
    paddingTop: 200,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)', // затемнение фона
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    paddingTop: 50, // место для крестика,
    marginTop: 100
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    padding: 6,
    paddingTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff'
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  modalText: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 20
  }
});
