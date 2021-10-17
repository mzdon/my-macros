import React from 'react';

import {StyleSheet} from 'react-native';
import ModalSelector from 'react-native-modal-selector';

import Text, {textStyles} from 'components/Text';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  label: {
    color: 'grey',
  },
  container: {
    borderColor: pageLineColor,
    borderWidth: 2,
  },
});

interface Value {
  key?: number;
  label: string;
  value: string;
}

interface Props {
  label?: string;
  value: string;
  values: (string | Value)[];
  onChange: (value: string) => void;
}

const getData = (values: Props['values']) => {
  return values.map((v, i) => {
    if (typeof v === 'string') {
      return {key: i, label: v, value: v};
    }
    return {key: i, label: v.label, value: v.value};
  });
};

const Picker = (props: Props): React.ReactElement<Props> => {
  const {label, value, values, onChange} = props;

  const onValueChange = React.useCallback(
    (nextValue: Value) => {
      onChange(nextValue.value);
    },
    [onChange],
  );

  const data = React.useMemo(() => getData(values), [values]);

  return (
    <>
      {label && <Text style={_styles.label}>{label}</Text>}
      <ModalSelector
        data={data}
        initValue={value}
        onChange={onValueChange}
        selectStyle={_styles.container}
        initValueTextStyle={textStyles.base}
        selectTextStyle={textStyles.base}
      />
    </>
  );
};

export default Picker;
