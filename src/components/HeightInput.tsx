import React from 'react';

import {StyleSheet, TextInput, View} from 'react-native';

import DisabledOverlay from 'components/DisabledOverlay';
import NumberInput, {NumberInputProps} from 'components/NumberInput';
import Spacer from 'components/Spacer';
import Text from 'components/Text';
import {MeasurementSystem} from 'types/MeasurementSystem';

const _styles = StyleSheet.create({
  inputLabel: {
    color: 'grey',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
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

interface InnerProps extends NumberInputProps {
  hasMeasurementSystem: boolean;
}

const ImperialWeightInput = (
  props: InnerProps,
): React.ReactElement<InnerProps> => {
  const {value, hasMeasurementSystem, onChangeText, ...rest} = props;
  const {feet, inches} = toFeetInches(value);
  const onChangeFeet = React.useCallback(
    (val: number) => {
      const nextHeight = Math.max(0, val) * 12 + inches;
      onChangeText(nextHeight);
    },
    [inches, onChangeText],
  );
  const onChangeInches = React.useCallback(
    (val: number) => {
      const nextHeight = 12 * feet + val;
      onChangeText(nextHeight);
    },
    [feet, onChangeText],
  );

  const ftRef = React.useRef<TextInput | null>(null);
  const inRef = React.useRef<TextInput | null>(null);
  React.useEffect(() => {
    if (!hasMeasurementSystem) {
      ftRef.current?.blur();
      inRef.current?.blur();
    }
  }, [hasMeasurementSystem]);

  return (
    <>
      <NumberInput
        ref={ftRef}
        value={feet}
        onChangeText={onChangeFeet}
        {...rest}
        style={_styles.stretchInput}
      />
      <Text style={_styles.stretchLabel}>{'ft'}</Text>
      <NumberInput
        ref={inRef}
        value={inches}
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
  const {hasMeasurementSystem, ...rest} = props;
  const cmRef = React.useRef<TextInput | null>(null);
  React.useEffect(() => {
    if (!hasMeasurementSystem) {
      cmRef.current?.blur();
    }
  }, [hasMeasurementSystem]);

  return (
    <>
      <NumberInput ref={cmRef} {...rest} style={_styles.stretchInput} />
      <Text style={_styles.stretchLabel}>{'cm'}</Text>
    </>
  );
};

interface Props extends NumberInputProps {
  measurementSystem: MeasurementSystem | null;
}

const HeightInput = (props: Props): React.ReactElement<Props> | null => {
  const {measurementSystem, ...rest} = props;
  const nestedProps = {...rest, hasMeasurementSystem: !!measurementSystem};

  return (
    <View>
      <Text style={_styles.inputLabel}>{'Height (optional)'}</Text>
      <View style={_styles.innerContainer}>
        {(!measurementSystem ||
          measurementSystem === MeasurementSystem.Imperial) && (
          <ImperialWeightInput {...nestedProps} />
        )}
        {measurementSystem === MeasurementSystem.Metric && (
          <MetricWeightInput {...nestedProps} />
        )}
      </View>
      <Spacer />
      {!measurementSystem && <DisabledOverlay />}
    </View>
  );
};

export default HeightInput;
