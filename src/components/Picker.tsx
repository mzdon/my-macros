import React from 'react';

import {Picker as RNPicker} from '@react-native-picker/picker';
import {StyleSheet} from 'react-native';

import Text, {textStyles} from 'components/Text';

const _styles = StyleSheet.create({
  label: {
    color: 'grey',
  },
});

type Value =
  | string
  | {
      label: string;
      value: string;
    };

interface Props {
  label?: string;
  value: string | null | undefined;
  values: Value[];
  nullable?: boolean;
  onChange: (value: string | null) => void;
}

const getInitialValue = ({value, values, nullable = false}: Props) => {
  let selectedValue: Value;
  if (!value) {
    if (nullable) {
      return null;
    }
    selectedValue = values[0];
  } else {
    selectedValue = value;
  }
  if (typeof selectedValue === 'string') {
    return selectedValue;
  }
  return selectedValue.value;
};

const renderItem = (value: Value) => {
  if (typeof value === 'string') {
    const title = `${value
      .split(' ')
      .map(v => `${v.slice(0, 1).toUpperCase()}${value.slice(1)}`)
      .join(' ')}`;
    return (
      <RNPicker.Item
        key={value}
        label={title}
        value={value}
        style={textStyles.base}
      />
    );
  }
  return (
    <RNPicker.Item
      key={value.value}
      label={value.label}
      value={value.value}
      style={textStyles.base}
    />
  );
};

const Picker = (props: Props): React.ReactElement<Props> => {
  const {label, values, nullable, onChange} = props;
  const [value, setValue] = React.useState(getInitialValue(props));
  React.useEffect(() => {
    if (props.value !== value) {
      onChange(value ? value : null);
    }
  });
  const onValueChange = React.useCallback(
    (nextValue: string | null) => {
      setValue(nextValue);
      onChange(nextValue);
    },
    [onChange],
  );
  return (
    <>
      {label && <Text style={_styles.label}>{label}</Text>}
      <RNPicker selectedValue={value} onValueChange={onValueChange}>
        {nullable === true && <RNPicker.Item label="-" value={null} />}
        {values.map(renderItem)}
      </RNPicker>
    </>
  );
};

export default Picker;
