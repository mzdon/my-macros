import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

import BaseTextInput, {BaseTextInputProps} from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import {MeasurementSystem} from 'types/MeasurementSystem';
import {checkValidNumberFirst} from 'utils/Validators';
import styles from 'styles';

const _styles = StyleSheet.create({
  innerContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  stretchInput: {flexGrow: 1},
  stretchLabel: {width: 40, paddingLeft: 8},
});

type Props = {
  measurementSystem: MeasurementSystem | null;
  value: number;
  onChangeText: (v: number) => void;
} & Omit<BaseTextInputProps, 'value' | 'onChangeText'>;

const WeightInput = (props: Props): React.ReactElement<Props> | null => {
  const {value, measurementSystem, onChangeText, ...rest} = props;
  if (!measurementSystem) {
    return null;
  }

  const onChangeInputText = checkValidNumberFirst((v: string) => {
    onChangeText(v ? Number(v) : 0);
  });

  const uomText = {
    [MeasurementSystem.Imperial]: 'lbs',
    [MeasurementSystem.Metric]: 'kgs',
  }[measurementSystem];
  return (
    <>
      <Text style={styles.inputLabel}>{'Weight (optional)'}</Text>
      <View style={_styles.innerContainer}>
        <BaseTextInput
          {...rest}
          value={String(value)}
          style={_styles.stretchInput}
          onChangeText={onChangeInputText}
        />
        <Text style={_styles.stretchLabel}>{uomText}</Text>
      </View>
      <Spacer />
    </>
  );
};

export default WeightInput;
