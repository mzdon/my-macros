import React from 'react';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';
import {useCheckValidNumberFirst} from 'utils/Validators';

interface Props extends Omit<BaseTextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (value: number) => void;
}

const BaseNumberInput = (props: Props): React.ReactElement<Props> => {
  const {value, onChangeText, ...rest} = props;
  const validOnChangeText = useCheckValidNumberFirst((v: string) => {
    onChangeText(Number(v));
  });
  return (
    <BaseTextInput
      {...rest}
      value={String(value)}
      onChangeText={validOnChangeText}
    />
  );
};

export default BaseNumberInput;
