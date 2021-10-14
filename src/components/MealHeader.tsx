import React from 'react';

import {StyleSheet, View} from 'react-native';

import Text from 'components/Text';
import Meal from 'schemas/Meal';
import {defaultPadding} from 'styles';

const _styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrappingText: {
    paddingRight: defaultPadding,
  },
});

interface Props {
  meal: Meal;
}

const MealHeader = ({meal}: Props): React.ReactElement<Props> => {
  const {description} = meal;
  const {calories, carbs, protein, fat} = meal.getMacros();
  return (
    <View style={_styles.container}>
      <Text.SubHeader style={_styles.wrappingText} numberOfLines={1}>
        {description}
      </Text.SubHeader>
      <Text.SubHeader>{`${calories}cal ${carbs}c ${protein}p ${fat}f`}</Text.SubHeader>
    </View>
  );
};

export default MealHeader;
