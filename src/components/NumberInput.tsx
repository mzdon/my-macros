import React from 'react';

import {TextInput as RNTextInput} from 'react-native';

import TextInput, {
  TextInputComponent,
  TextInputProps,
} from 'components/TextInput';
import {useCheckValidNumberFirst} from 'utils/Validators';

export interface NumberInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: number;
  onChangeText: (value: number) => void;
}
type NumberInputComponent = React.ForwardRefExoticComponent<
  NumberInputProps & React.RefAttributes<RNTextInput>
>;
type NumberInputComponents = NumberInputComponent & {
  CoverNumberInput: NumberInputComponent;
};

const createComponent = (
  InnerComponent: TextInputComponent,
): NumberInputComponent => {
  const Component = React.forwardRef<RNTextInput, NumberInputProps>(
    (props: NumberInputProps, ref): React.ReactElement<NumberInputProps> => {
      const {value, onChangeText, ...rest} = props;
      const [internalValue, setInternalValue] = React.useState<string>(
        String(value),
      );
      React.useEffect(() => {
        if (Number(value) !== Number(internalValue)) {
          setInternalValue(String(value));
        }
      }, [internalValue, value]);
      const validOnChangeText = useCheckValidNumberFirst((v: string) => {
        let cleanVal = v;
        // remove leading 0 if the next character is not a decimal point
        if (cleanVal.length > 1 && cleanVal[0] === '0' && cleanVal[1] !== '.') {
          cleanVal = cleanVal.substr(1);
        } else if (cleanVal.length === 0) {
          cleanVal = '0';
        }
        setInternalValue(cleanVal);
        onChangeText(Number(cleanVal));
      });
      return (
        <InnerComponent
          ref={ref}
          {...rest}
          keyboardType="numeric"
          value={internalValue}
          onChangeText={validOnChangeText}
        />
      );
    },
  );
  return Component;
};

const Base = createComponent(TextInput) as NumberInputComponents;
Base.CoverNumberInput = createComponent(TextInput.CoverTextInput);

export default Base;
