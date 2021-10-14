import React from 'react';

import {StyleSheet, Text} from 'react-native';

import {JustChildrenProps} from 'types/Common';

const _styles = StyleSheet.create({
  style: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const CoverHeader = ({
  children,
}: JustChildrenProps): React.ReactElement<JustChildrenProps> => (
  <Text style={_styles.style}>{children}</Text>
);

export default CoverHeader;
