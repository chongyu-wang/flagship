import React from 'react';
import { View, StyleSheet } from 'react-native';
import Checkpoint from './ProgressCheckpoint.jsx';
import Bar from './ProgressBar';

const ProgressDisplay = ({firstCheckpointCompletion, firstCheckpointMax, secondCheckpointCompletion, secondCheckpointMax}) => {
  return (
    <View style={styles.statusBar}>
      <View style={styles.step}>
        <Checkpoint number="1" active= { firstCheckpointCompletion !== 0} />
        <Bar completed={firstCheckpointCompletion} maximum={firstCheckpointMax} />
      </View>
      <View style={styles.step}>
        <Checkpoint number="2" active= {secondCheckpointCompletion !== 0} />
        <Bar completed={secondCheckpointCompletion} maximum={secondCheckpointMax} />
      </View>
      <View style={styles.step}>
        <Checkpoint number="3" active= {secondCheckpointCompletion === 100} />
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

export default ProgressDisplay;
