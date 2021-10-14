import React from 'react';

import {StyleSheet, TextInput} from 'react-native';

import BaseNumberInput, {
  BaseNumberInputProps,
} from 'components/BaseNumberInput';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: pageLineColor,
    fontSize: 20,
  },
});

const PageNumberInput = React.forwardRef<TextInput, BaseNumberInputProps>(
  (
    props: BaseNumberInputProps,
    ref,
  ): React.ReactElement<BaseNumberInputProps> => {
    return (
      <BaseNumberInput
        ref={ref}
        {...props}
        style={[props.style, _styles.input]}
      />
    );
  },
);

export default PageNumberInput;
