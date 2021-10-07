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
    const [internalValue, setInternalValue] = React.useState<string>(
      String(value),
    );
    React.useEffect(() => {
      if (Number(value) !== Number(internalValue)) {
        setInternalValue(String(value));
      }
    }, [internalValue, value]);
    const validOnChangeText = useCheckValidNumberFirst((v: string) => {
      setInternalValue(v);
      onChangeText(Number(v));
    });
    return (
      <BaseTextInput
        ref={ref}
        {...rest}
        keyboardType="numeric"
        value={internalValue}
        onChangeText={validOnChangeText}
      />
    );
  },
);

export default BaseNumberInput;
