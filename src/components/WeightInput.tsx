import React from 'react';

import {StyleSheet, Text, TextInput, View} from 'react-native';

import {BaseNumberInputProps} from 'components/BaseNumberInput';
import DisabledOverlay from 'components/DisabledOverlay';
import PageNumberInput from 'components/input/PageNumberInput';
import Spacer from 'components/Spacer';
import {MeasurementSystem} from 'types/MeasurementSystem';
import styles from 'styles';

const _styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stretchInput: {flexGrow: 1},
  stretchLabel: {width: 40, paddingLeft: 8},
});

interface Props extends BaseNumberInputProps {
  measurementSystem: MeasurementSystem | null;
}

const WeightInput = (props: Props): React.ReactElement<Props> | null => {
  const {measurementSystem, ...rest} = props;

  const inputRef = React.useRef<TextInput | null>(null);
  React.useEffect(() => {
    if (!measurementSystem) {
      inputRef.current?.blur();
    }
  });

  const uomText = {
    [MeasurementSystem.Imperial]: 'lbs',
    [MeasurementSystem.Metric]: 'kgs',
  }[measurementSystem || MeasurementSystem.Imperial];
  return (
    <View>
      <Text style={styles.inputLabel}>{'Weight (optional)'}</Text>
      <View style={_styles.innerContainer}>
        <PageNumberInput
          ref={inputRef}
          {...rest}
          style={_styles.stretchInput}
        />
        <Text style={_styles.stretchLabel}>{uomText}</Text>
      </View>
      <Spacer />
      {!measurementSystem && <DisabledOverlay />}
    </View>
  );
};

export default WeightInput;
