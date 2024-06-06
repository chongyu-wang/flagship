import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Checkpoint({ number, active }) {
    return (
        <View style={[styles.circle, active ? styles.activeCircle : null]}>
          <Text style={styles.number}>{number}</Text>
        </View>
      );
};

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  activeCircle: {
    backgroundColor: '#f0a500',
  },
  number: {
    color: '#fff',
    fontSize: 16,
  },
});
