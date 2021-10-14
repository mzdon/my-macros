import React from 'react';

import {StyleSheet, TextInput} from 'react-native';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';

const _styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    fontSize: 20,
  },
});

const CoverTextInput = React.forwardRef<TextInput, BaseTextInputProps>(
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

export default CoverTextInput;
