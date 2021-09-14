import React from 'react';

import {StyleSheet, View} from 'react-native';

const _styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'grey',
    opacity: 0.2,
  },
});

const DisabledOverlay = () => (
  <View style={_styles.container} pointerEvents="box-only" />
);

export default DisabledOverlay;
