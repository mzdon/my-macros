import React from 'react';

import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import {useSimpleStateUpdater} from 'utils/State';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

interface Props {
  foodItem: FoodItem | FoodItemData;
  onGoBack: () => void;
  onUpdateFoodItem: (foodItem: FoodItemData) => void;
}

const EditFoodItemStep2 = ({foodItem, onGoBack, onUpdateFoodItem}: Props) => {
  const [state, updater] = useSimpleStateUpdater({
    carbs: foodItem.carbs,
    protein: foodItem.protein,
    fat: foodItem.fat,
    sugar: foodItem.sugar,
    fiber: foodItem.fiber,
  });

  const onNext = React.useCallback(() => {
    const {carbs, protein, fat, sugar, fiber} = state;
    foodItem.carbs = carbs;
    foodItem.protein = protein;
    foodItem.fat = fat;
    foodItem.sugar = sugar;
    foodItem.fiber = fiber;
    onUpdateFoodItem(foodItem);
  }, [foodItem, state, onUpdateFoodItem]);

  const updateCarbs = updater<number>('carbs');
  const updateProtein = updater<number>('protein');
  const updateFat = updater<number>('fat');
  const updateSugar = updater<number>('sugar');
  const updateFiber = updater<number>('fiber');

  return (
    <>
      <Text>{`New ${foodItem.description}`}</Text>
      <Spacer />
      <BaseNumberInput
        label="Carbs"
        placeholder="Carbs"
        value={state.carbs}
        onChangeText={updateCarbs}
      />
      <Spacer />
      <BaseNumberInput
        label="Protein"
        placeholder="Protein"
        value={state.protein}
        onChangeText={updateProtein}
      />
      <Spacer />
      <BaseNumberInput
        label="Fat"
        placeholder="Fat"
        value={state.fat}
        onChangeText={updateFat}
      />
      <Spacer />
      <BaseNumberInput
        label="Sugar"
        placeholder="Sugar"
        value={state.sugar}
        onChangeText={updateSugar}
      />
      <Spacer />
      <BaseNumberInput
        label="Fiber"
        placeholder="Fiber"
        value={state.fiber}
        onChangeText={updateFiber}
      />
      <Spacer />
      <View style={_styles.buttonContainer}>
        <Button title="Back" onPress={onGoBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </>
  );
};

export default EditFoodItemStep2;
