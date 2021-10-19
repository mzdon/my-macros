import React from 'react';

import {StyleSheet, View, ViewStyle} from 'react-native';
import {defaultPadding} from 'styles';

const _styles = StyleSheet.create({
  container: {
    paddingHorizontal: defaultPadding,
  },
});

type Props = React.PropsWithChildren<{
  style?: ViewStyle;
}>;

const Container = ({children, style}: Props): React.ReactElement<Props> => (
  <View style={[_styles.container, style]}>{children}</View>
);

export default Container;
