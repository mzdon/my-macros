import React from 'react';

import {StyleSheet, View} from 'react-native';

import Text from 'components/Text';
import Meal from 'schemas/Meal';
import MacroDefinition from 'schemas/MacroDefinition';
import {round} from 'utils/Math';

const _styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  inner: {flex: 1},
});

interface Props {
  macros: MacroDefinition;
  meals: Meal[] | undefined;
}

interface Macros {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
}

function getStats(macros: MacroDefinition, meals: Meal[] | undefined) {
  let consumed: Macros = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
  };
  let remaining: Macros = {
    calories: macros.calories,
    carbs: macros.carbs,
    protein: macros.protein,
    fat: macros.fat,
    sugar: macros.sugar || 0,
    fiber: macros.fiber || 0,
  };
  if (meals) {
    const results = meals.reduce(
      (result: {consumed: Macros; remaining: Macros}, meal: Meal) => {
        const nextConsumed = {...result.consumed};
        const nextRemaining = {...result.remaining};
        const mealMacros = meal.getMacros();
        nextConsumed.calories += mealMacros.calories;
        nextConsumed.carbs += mealMacros.carbs;
        nextConsumed.protein += mealMacros.protein;
        nextConsumed.fat += mealMacros.fat;
        nextConsumed.sugar += mealMacros.sugar || 0;
        nextConsumed.fiber += mealMacros.fiber || 0;
        nextRemaining.calories -= mealMacros.calories;
        nextRemaining.carbs -= mealMacros.carbs;
        nextRemaining.protein -= mealMacros.protein;
        nextRemaining.fat -= mealMacros.fat;
        nextRemaining.sugar -= mealMacros.sugar || 0;
        nextRemaining.fiber -= mealMacros.fiber || 0;
        return {consumed: nextConsumed, remaining: nextRemaining};
      },
      {consumed, remaining},
    );
    consumed = results.consumed;
    remaining = results.remaining;
  }
  return {consumed, remaining};
}

const optionalMacrosRemaining = (
  title: string,
  value: number,
  target: number | null,
) => {
  let result = `${title}: `;
  if (!target) {
    result += 'n/a';
  } else {
    result += `${round(value)}g`;
  }
  return result;
};

const Stats = ({macros, meals}: Props): React.ReactElement<Props> => {
  const {consumed, remaining} = getStats(macros, meals);
  return (
    <View style={_styles.container}>
      <View style={_styles.inner}>
        <Text.SubHeader>Consumed</Text.SubHeader>
        <Text>{`Calories: ${round(consumed.calories)}`}</Text>
        <Text>{`Carbs: ${round(consumed.carbs)}g`}</Text>
        <Text>{`Protein: ${round(consumed.protein)}g`}</Text>
        <Text>{`Fat: ${round(consumed.fat)}g`}</Text>
        <Text>{`Sugar ${round(consumed.sugar)}g`}</Text>
        <Text>{`Fiber ${round(consumed.fiber)}g`}</Text>
      </View>
      <View style={_styles.inner}>
        <Text.SubHeader>Remaining</Text.SubHeader>
        <Text>{`Calories: ${round(remaining.calories)}`}</Text>
        <Text>{`Carbs: ${round(remaining.carbs)}g`}</Text>
        <Text>{`Protein: ${round(remaining.protein)}g`}</Text>
        <Text>{`Fat: ${round(remaining.fat)}g`}</Text>
        <Text>
          {optionalMacrosRemaining('Sugar', consumed.sugar, macros.sugar)}
        </Text>
        <Text>
          {optionalMacrosRemaining('Fiber', consumed.fiber, macros.fiber)}
        </Text>
      </View>
    </View>
  );
};

export default Stats;
