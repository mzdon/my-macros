import React from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {backgroundColor, defaultPadding} from 'styles';
import {JustChildrenProps} from 'types/Common';

const _styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor,
  },
  screen: {
    flex: 1,
    padding: defaultPadding,
  },
});

const ScreenWrapper = ({
  children,
}: JustChildrenProps): React.ReactElement<JustChildrenProps> => {
  return (
    <SafeAreaView style={_styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={_styles.flex}>
        <View style={_styles.screen}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
