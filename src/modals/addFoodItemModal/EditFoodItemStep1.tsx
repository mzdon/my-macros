import React from 'react';

import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import BaseTextInput from 'components/BaseTextInput';
import RadioButtons from 'components/RadioButtons';
import Spacer from 'components/Spacer';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import {useSimpleStateUpdater} from 'utils/State';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

interface Props {
  foodItem: FoodItem | FoodItemData;
  onGoBack: () => void;
  onUpdateFoodItem: (foodItem: FoodItemData) => void;
}

const SERVING_UMO_VALUES = [
  UnitOfMeasurement.Grams,
  UnitOfMeasurement.Ounces,
  UnitOfMeasurement.FluidOunces,
  UnitOfMeasurement.Liters,
];

const EditFoodItemStep1 = ({foodItem, onGoBack, onUpdateFoodItem}: Props) => {
  const [state, updater] = useSimpleStateUpdater({
    description: foodItem.description,
    servingSize: foodItem.servingSize,
    servingUnitOfMeasurement: foodItem.servingUnitOfMeasurement,
    servingSizeNote: foodItem.servingSizeNote,
    calories: foodItem.calories,
  });

  const onNext = React.useCallback(() => {
    const {
      description,
      servingSize,
      servingSizeNote,
      servingUnitOfMeasurement,
      calories,
    } = state;
    foodItem.description = description;
    foodItem.servingSize = servingSize;
    foodItem.servingUnitOfMeasurement = servingUnitOfMeasurement;
    foodItem.servingSizeNote = servingSizeNote;
    foodItem.calories = calories;
    onUpdateFoodItem(foodItem);
  }, [foodItem, state, onUpdateFoodItem]);

  // TODO: Warn if a food item exists with the same description
  const updateDescription = updater('description');
  const updateServingSize = updater<number>('servingSize');
  const onUpdateUnitOfMeasurement = updater<UnitOfMeasurement>(
    'servingUnitOfMeasurement',
  );
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as UnitOfMeasurement);
  };
  const updateServingNote = updater('servingSizeNote');
  const updateCalories = updater<number>('calories');

  return (
    <>
      <Text>New Item</Text>
      <Spacer />
      <BaseTextInput
        label="Description"
        placeholder="New item description..."
        value={state.description}
        onChangeText={updateDescription}
      />
      <Spacer />
      <BaseNumberInput
        label="Serving Size"
        placeholder="What's the serving size?"
        value={state.servingSize}
        onChangeText={updateServingSize}
      />
      <Spacer />
      <RadioButtons
        value={state.servingUnitOfMeasurement}
        values={SERVING_UMO_VALUES}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
      <BaseTextInput
        label="Serving Size Note"
        placeholder="Aribitrary info like '3 cakes'"
        value={state.servingSizeNote}
        onChangeText={updateServingNote}
      />
      <Spacer />
      <BaseNumberInput
        label="Calories"
        placeholder="Calories"
        value={state.calories}
        onChangeText={updateCalories}
      />
      <Spacer />
      <View style={_styles.buttonContainer}>
        <Button title="Back" onPress={onGoBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </>
  );
};

export default EditFoodItemStep1;
