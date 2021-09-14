import React from 'react';

import {TextInput} from 'react-native';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';
import {useCheckValidNumberFirst} from 'utils/Validators';

export interface BaseNumberInputProps
  extends Omit<BaseTextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (value: number) => void;
}

const BaseNumberInput = React.forwardRef<TextInput, BaseNumberInputProps>(
  (
    props: BaseNumberInputProps,
    ref,
  ): React.ReactElement<BaseNumberInputProps> => {
    const {value, onChangeText, ...rest} = props;
    const validOnChangeText = useCheckValidNumberFirst((v: string) => {
      onChangeText(Number(v));
    });
    return (
      <BaseTextInput
        ref={ref}
        {...rest}
        value={String(value)}
        onChangeText={validOnChangeText}
      />
    );
  },
);

export default BaseNumberInput;
