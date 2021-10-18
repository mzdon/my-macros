import React from 'react';

import Text from 'components/Text';
import MacroDefinition from 'schemas/MacroDefinition';

interface Props {
  macros: MacroDefinition;
}

const CurrentMacros = ({macros}: Props): React.ReactElement<Props> => {
  const {calories, carbs, protein, fat, sugar, fiber} = macros;
  return (
    <>
      <Text.SubHeader>Macros</Text.SubHeader>
      <Text>{`Calories: ${calories} cal`}</Text>
      <Text>{`Carbs: ${carbs} g`}</Text>
      <Text>{`Protein: ${protein} g`}</Text>
      <Text>{`Fat: ${fat} g`}</Text>
      <Text>{`Sugar: ${
        sugar !== undefined && sugar !== null ? `${sugar} g` : 'n/a'
      }`}</Text>
      <Text>{`Fiber: ${
        fiber !== undefined && fiber !== null ? `${fiber} g` : 'n/a'
      }`}</Text>
    </>
  );
};

export default CurrentMacros;
