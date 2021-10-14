import React from 'react';

import TextInput, {TextInputProps} from 'components/TextInput';
import {isStringValidNumber} from 'utils/Validators';

interface Props extends TextInputProps {
  value: string;
  error: string | undefined;
  onChangeText: (v: string) => void;
}

const BirthdayInput = (props: Props): React.ReactElement<Props> => {
  const {onChangeText, ...rest} = props;
  const {value} = rest;
  const onChangeBirthday = (v: string) => {
    if (v.length < value.length) {
      onChangeText(v);
      return;
    }
    const lastChar = v.slice(-1);
    const parts = v.split('/');
    if (
      isStringValidNumber(lastChar) &&
      parts.length < 3 &&
      parts[parts.length - 1].length === 2
    ) {
      onChangeText(`${v}/`);
    } else {
      onChangeText(v);
    }
  };
  return (
    <TextInput
      {...rest}
      onChangeText={onChangeBirthday}
      label="Birthday (optional)"
      placeholder="MM/DD/YYYY"
    />
  );
};

export default BirthdayInput;
