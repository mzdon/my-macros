import React from 'react';

import {
  Falsy,
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

const BaseTextInput = React.forwardRef<TextInput, BaseTextInputProps>(
  (props: BaseTextInputProps, ref): React.ReactElement<BaseTextInputProps> => {
    const {label, error, style, ...rest} = props;
    return (
      <>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, !!error && styles.inputError, style]}
          {...rest}
        />
        {error && <Text style={styles.inputErrorMessage}>{error}</Text>}
      </>
    );
  },
);

export default BaseTextInput;
