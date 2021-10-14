import React from 'react';

import {StyleSheet, View} from 'react-native';
import {defaultPadding} from 'styles';
import {JustChildrenProps} from 'types/Common';

const radius = 12;
const margin = 10;

const _styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'white',
    borderRadius: radius,
  },
  container: {
    backgroundColor: 'black',
    borderRadius: radius,
    margin: margin,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: radius,
    margin: margin,
    padding: defaultPadding,
  },
});

const CoverContent = ({
  children,
}: JustChildrenProps): React.ReactElement<JustChildrenProps> => {
  return (
    <View style={_styles.outerContainer}>
      <View style={_styles.container}>
        <View style={_styles.innerContainer}>{children}</View>
      </View>
    </View>
  );
};

export default CoverContent;
