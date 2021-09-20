import React from 'react';

import {Text, StyleSheet, View} from 'react-native';

import Meal from 'schemas/Meal';
import {defaultPadding} from 'styles';

const _styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
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
      <Text style={[_styles.text, _styles.wrappingText]} numberOfLines={1}>
        {description}
      </Text>
      <Text
        style={
          _styles.text
        }>{`${calories}cal ${carbs}c ${protein}p ${fat}f`}</Text>
    </View>
  );
};

export default MealHeader;
