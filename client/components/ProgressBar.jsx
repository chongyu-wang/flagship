import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function Bar({ completed, maximum }) {
  const progress = completed / maximum;
  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color="#f0a500" style={styles.progressBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 4,
    marginHorizontal: 5,
  },
  progressBar: {
    height: 4,
  },
});
