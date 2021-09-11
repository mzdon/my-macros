import React from 'react';
import {Falsy} from 'react-native';

import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import styles from 'styles';

export interface BaseTextInputProps extends TextInputProps {
  label?: string;
  error?: string | Falsy;
  style?: StyleProp<ViewStyle>;
}

const BaseTextInput = (
  props: BaseTextInputProps,
): React.ReactElement<BaseTextInputProps> => {
  const {label, error, style, ...rest} = props;
  return (
    <>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <TextInput
        style={[styles.input, !!error && styles.inputError, style]}
        {...rest}
      />
      {error && <Text style={styles.inputErrorMessage}>{error}</Text>}
    </>
  );
};

export default BaseTextInput;
