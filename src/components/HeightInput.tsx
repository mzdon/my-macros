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

const toFeetInches = (v: number): {feet: number; inches: number} => {
  if (!v) {
    return {feet: 0, inches: 0};
  }
  const feet = Math.floor(v / 12);
  const inches = v - feet * 12;
  return {feet, inches};
};

interface InnerProps
  extends Omit<BaseTextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (v: number) => void;
}

const ImperialWeightInput = (
  props: InnerProps,
): React.ReactElement<InnerProps> => {
  const {value, onChangeText, ...rest} = props;
  const {feet, inches} = toFeetInches(value);
  const onChangeFeet = checkValidNumberFirst((val: string) => {
    const nextHeight = Math.max(0, Number(val)) * 12 + inches;
    onChangeText(nextHeight);
  });
  const onChangeInches = checkValidNumberFirst((val: string) => {
    const nextHeight = 12 * feet + Number(val);
    onChangeText(nextHeight);
  });

  return (
    <>
      <BaseTextInput
        value={String(feet)}
        onChangeText={onChangeFeet}
        {...rest}
        style={_styles.stretchInput}
      />
      <Text style={_styles.stretchLabel}>{'ft'}</Text>
      <BaseTextInput
        value={String(inches)}
        onChangeText={onChangeInches}
        {...rest}
        style={_styles.stretchInput}
      />
      <Text style={_styles.stretchLabel}>{'in'}</Text>
    </>
  );
};

const MetricWeightInput = (
  props: InnerProps,
): React.ReactElement<InnerProps> => {
  const {value, onChangeText, ...rest} = props;
  const onChangeHeight = (val: string) => {
    onChangeText(Number(val));
  };
  return (
    <>
      <BaseTextInput
        {...rest}
        value={String(value)}
        style={_styles.stretchInput}
        onChangeText={checkValidNumberFirst(onChangeHeight)}
      />
      <Text style={_styles.stretchLabel}>{'cm'}</Text>
    </>
  );
};

type Props = {
  measurementSystem: MeasurementSystem | null;
  value: number;
  onChangeText: (v: number) => void;
} & Omit<BaseTextInputProps, 'value' | 'onChangeText'>;

const HeightInput = (props: Props): React.ReactElement<Props> | null => {
  const {value, measurementSystem, ...rest} = props;
  if (!measurementSystem) {
    return null;
  }

  const Component = {
    [MeasurementSystem.Imperial]: ImperialWeightInput,
    [MeasurementSystem.Metric]: MetricWeightInput,
  }[measurementSystem];
  return (
    <>
      <Text style={styles.inputLabel}>{'Height (optional)'}</Text>
      <View style={_styles.innerContainer}>
        <Component {...rest} value={value} />
      </View>
      <Spacer />
    </>
  );
};

export default HeightInput;
