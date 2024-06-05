import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const Bar = ({ completed, maximum }) => {
    const progress = (typeof completed === 'number' && typeof maximum === 'number' && maximum > 0) ? completed / maximum : 0;

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

export default Bar;
