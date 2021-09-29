import React from 'react';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';
import styles from 'styles';
import {isStringValidNumber} from 'utils/Validators';

interface Props extends BaseTextInputProps {
  value: string;
  error: string | undefined;
  onChangeText: (v: string) => void;
}

const BirthdayInput = (props: Props): React.ReactElement<Props> => {
  const {onChangeText, ...rest} = props;
  const {value, error} = rest;
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
    <BaseTextInput
      {...rest}
      onChangeText={onChangeBirthday}
      label="Birthday (optional)"
      style={!!error && styles.inputError}
      placeholder="MM/DD/YYYY"
    />
  );
};

export default BirthdayInput;
