import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import lorem from './text';

const Lorem = () => {
  return (
    <View>
      <Text style={styles.text}>{lorem}</Text>
    </View>
  );
};

export default Lorem;

const styles = StyleSheet.create({
  text: {
    padding: 10,
    color: 'black'
  }
});
