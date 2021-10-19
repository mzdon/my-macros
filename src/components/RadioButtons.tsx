import React from 'react';

import {Button, StyleSheet, View} from 'react-native';

import Text from 'components/Text';

interface RBProps {
  value: string;
  selected: boolean;
  onPress: (v: string) => void;
}

const RadioButton = ({value, selected, onPress}: RBProps) => {
  const handlePress = React.useCallback(() => {
    onPress(value);
  }, [value, onPress]);
  const title = `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
  return (
    <View style={selected && _styles.selected}>
      <Button title={title} onPress={handlePress} />
    </View>
  );
};

const _styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'grey',
  },
  selected: {
    borderWidth: 1,
    borderColor: 'blue',
  },
});

interface Props {
  label?: string;
  value: string | null;
  values: string[];
  optional?: boolean;
  onChange: (v: string | null) => void;
}

const RadioButtons = ({
  label,
  value,
  values,
  optional = false,
  onChange,
}: Props) => {
  const handlePress = React.useCallback(
    valuePressed => {
      if (value === valuePressed && optional) {
        onChange(null);
      } else {
        onChange(valuePressed);
      }
    },
    [optional, value, onChange],
  );

  return (
    <>
      {label && <Text style={_styles.label}>{label}</Text>}
      <View style={_styles.innerContainer}>
        {values.map((v, i) => (
          <RadioButton
            key={`${value}-${i}`}
            value={v}
            onPress={handlePress}
            selected={v === value}
          />
        ))}
      </View>
    </>
  );
};

export default RadioButtons;
