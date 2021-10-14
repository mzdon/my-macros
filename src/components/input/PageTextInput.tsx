import React from 'react';

import {StyleSheet, TextInput} from 'react-native';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: pageLineColor,
    fontSize: 20,
  },
});

const PageTextInput = React.forwardRef<TextInput, BaseTextInputProps>(
  (props: BaseTextInputProps, ref): React.ReactElement<BaseTextInputProps> => {
    return (
      <BaseTextInput
        ref={ref}
        {...props}
        style={[props.style, _styles.input]}
      />
    );
  },
);

export default PageTextInput;
