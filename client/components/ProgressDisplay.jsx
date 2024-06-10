import React from 'react';
import { View, StyleSheet } from 'react-native';
import Checkpoint from './ProgressCheckpoint.jsx';
import Bar from './ProgressBar';

export default function ProgressDisplay({firstCheckpointCompletion, firstCheckpointMax, secondCheckpointCompletion, secondCheckpointMax}) {
  return (
    <View style={styles.statusBar}>
      <View style={styles.step}>
        <Checkpoint number="1" active />
        <Bar completed={firstCheckpointCompletion} maximum={firstCheckpointMax} />
      </View>
      <View style={styles.step}>
        <Checkpoint number="2" active= {firstCheckpointCompletion === firstCheckpointMax} />
        <Bar completed={secondCheckpointCompletion} maximum={secondCheckpointMax} />
      </View>
      <View style={styles.step}>
        <Checkpoint number="3" active= {secondCheckpointCompletion === secondCheckpointMax} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
