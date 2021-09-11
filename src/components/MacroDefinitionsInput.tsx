import React from 'react';

import BaseTextInput from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import styles from 'styles';
import {MacroDefinitionStrings} from 'types/MacroDefinition';
import {checkValidNumberFirst} from 'utils/Validators';

interface Props {
  value: MacroDefinitionStrings;
  onChange: (val: MacroDefinitionStrings) => void;
}

const MacroDefinitionsInput = (props: Props): React.ReactElement<Props> => {
  const {value, onChange} = props;
  const {calories, carbs, protein, fat, sugar, fiber} = value;

  const onUpdate = (property: string) => {
    return (val: string) => {
      onChange({
        ...value,
        [property]: val,
      });
    };
  };

  return (
    <>
      <BaseTextInput
        label="Calories (grams)"
        placeholder="Calories"
        value={calories}
        style={!calories && styles.inputError}
        onChangeText={checkValidNumberFirst(onUpdate('calories'))}
      />
      <Spacer />
      <BaseTextInput
        label="Carbohydrates (grams)"
        placeholder="Carbohydrates"
        value={carbs}
        style={!carbs && styles.inputError}
        onChangeText={checkValidNumberFirst(onUpdate('carbs'))}
      />
      <Spacer />
      <BaseTextInput
        label="Protein (grams)"
        placeholder="Protein"
        value={protein}
        style={!protein && styles.inputError}
        onChangeText={checkValidNumberFirst(onUpdate('protein'))}
      />
      <Spacer />
      <BaseTextInput
        label="Fats (grams)"
        placeholder="Fats"
        value={fat}
        style={!fat && styles.inputError}
        onChangeText={checkValidNumberFirst(onUpdate('fat'))}
      />
      <Spacer />
      <BaseTextInput
        label="Sugar (grams/optional)"
        placeholder="Sugar"
        value={sugar}
        onChangeText={checkValidNumberFirst(onUpdate('sugar'))}
      />
      <Spacer />
      <BaseTextInput
        label="Fiber (grams/optional)"
        placeholder="Fiber"
        value={fiber}
        onChangeText={checkValidNumberFirst(onUpdate('fiber'))}
      />
      <Spacer />
    </>
  );
};

export default MacroDefinitionsInput;
