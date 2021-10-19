import React from 'react';

import {StyleSheet, View} from 'react-native';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: pageLineColor,
  },
});

const ItemSeparator = () => <View style={_styles.separator} />;

export default ItemSeparator;
