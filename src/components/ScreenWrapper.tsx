import React from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {backgroundColor} from 'styles';

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  innerContainer: {
    flex: 1,
  },
});

type Props = React.PropsWithChildren<{
  style?: ViewStyle;
}>;

const ScreenWrapper = ({style, children}: Props): React.ReactElement<Props> => {
  return (
    <SafeAreaView style={[_styles.container, style]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={_styles.innerContainer}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
