import React from 'react';

import {
  Falsy,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';

import Text from 'components/Text';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  baseInput: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: pageLineColor,
    fontSize: 20,
  },
  coverTextInput: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    fontSize: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  inputErrorMessage: {
    color: 'red',
  },
  inputLabel: {
    color: 'grey',
  },
});

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string | Falsy;
  style?: StyleProp<ViewStyle>;
}
export type TextInputComponent = React.ForwardRefExoticComponent<
  TextInputProps & React.RefAttributes<TextInput>
>;
export type TextInputComponents = TextInputComponent & {
  CoverTextInput: TextInputComponent;
  PageTextInput: TextInputComponent;
};

const createComponent = (
  typeStyle?: TextInputProps['style'],
): TextInputComponent => {
  const Component = React.forwardRef<TextInput, TextInputProps>(
    (props: TextInputProps, ref): React.ReactElement<TextInputProps> => {
      const {label, error, style, ...rest} = props;
      return (
        <>
          {label && <Text style={_styles.inputLabel}>{label}</Text>}
          <TextInput
            ref={ref}
            style={[
              _styles.baseInput,
              typeStyle,
              !!error && _styles.inputError,
              style,
            ]}
            {...rest}
          />
          {error && <Text style={_styles.inputErrorMessage}>{error}</Text>}
        </>
      );
    },
  );
  return Component;
};

const Base = createComponent() as TextInputComponents;
Base.CoverTextInput = createComponent(_styles.coverTextInput);

export default Base;
