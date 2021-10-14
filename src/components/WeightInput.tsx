import React from 'react';

import {StyleSheet, Text, TextInput, View} from 'react-native';

import DisabledOverlay from 'components/DisabledOverlay';
import NumberInput, {NumberInputProps} from 'components/NumberInput';
import Spacer from 'components/Spacer';
import {MeasurementSystem} from 'types/MeasurementSystem';

const _styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stretchInput: {flexGrow: 1},
  stretchLabel: {width: 40, paddingLeft: 8},
});

interface Props extends NumberInputProps {
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
      <View style={_styles.innerContainer}>
        <NumberInput
          ref={inputRef}
          label="Weight (optional)"
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
