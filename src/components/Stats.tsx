import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

import Meal from 'schemas/Meal';
import MacroDefinition from 'schemas/MacroDefinition';

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

const optionalMacrosConsumed = (
  title: string,
  value: number,
  target: number | null,
) => {
  let result = `${title}: ${value}`;
  if (target) {
    result += `/${target}`;
  }
  return result;
};

const optionalMacrosRemaining = (
  title: string,
  value: number,
  target: number | null,
) => {
  let result = `${title}: `;
  if (!target) {
    result += 'n/a';
  } else {
    result += `${value}/${target}`;
  }
  return result;
};

const Stats = ({macros, meals}: Props): React.ReactElement<Props> => {
  const {consumed, remaining} = getStats(macros, meals);
  return (
    <View style={_styles.container}>
      <View style={_styles.inner}>
        <Text>Macros Consumed</Text>
        <Text>{`Calories: ${consumed.calories}/${macros.calories}`}</Text>
        <Text>{`Carbs: ${consumed.carbs}/${macros.carbs}`}</Text>
        <Text>{`Protein: ${consumed.protein}/${macros.protein}`}</Text>
        <Text>{`Fat: ${consumed.fat}/${macros.fat}`}</Text>
        <Text>
          {optionalMacrosConsumed('Sugar', consumed.sugar, macros.sugar)}
        </Text>
        <Text>
          {optionalMacrosConsumed('Fiber', consumed.fiber, macros.fiber)}
        </Text>
      </View>
      <View style={_styles.inner}>
        <Text>Macros Remaining</Text>
        <Text>{`Calories: ${remaining.calories}/${macros.calories}`}</Text>
        <Text>{`Carbs: ${remaining.carbs}/${macros.carbs}`}</Text>
        <Text>{`Protein: ${remaining.protein}/${macros.protein}`}</Text>
        <Text>{`Fat: ${remaining.fat}/${macros.fat}`}</Text>
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
