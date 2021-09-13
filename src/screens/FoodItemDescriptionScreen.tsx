import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import BaseTextInput from 'components/BaseTextInput';
import RadioButtons from 'components/RadioButtons';
import Spacer from 'components/Spacer';
import {FOOD_ITEM_MACROS} from 'navigation/Constants';
import {FoodItemDescriptionNavigationProp} from 'navigation/RouteTypes';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {useFoodContext} from 'providers/FoodProvider';
import styles from 'styles';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

const SERVING_UMO_VALUES = [
  UnitOfMeasurement.Grams,
  UnitOfMeasurement.Ounces,
  UnitOfMeasurement.FluidOunces,
  UnitOfMeasurement.Liters,
];

const FoodItemDescriptionScreen = () => {
  const navigation = useNavigation<FoodItemDescriptionNavigationProp>();

  const {foodItemData, updateFoodItemData} = useFoodContext();

  const [state, updater] = useSimpleStateUpdater({
    description: foodItemData?.description || '',
    servingSize: foodItemData?.servingSize || 0,
    servingUnitOfMeasurement:
      foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
    servingSizeNote: foodItemData?.servingSizeNote || '',
    calories: foodItemData?.calories || 0,
  });

  const onNext = React.useCallback(() => {
    updateFoodItemData(state);
    navigation.navigate(FOOD_ITEM_MACROS);
  }, [updateFoodItemData, state, navigation]);

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
    <View style={styles.screen}>
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
        <Button title="Back" onPress={navigation.goBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

export default FoodItemDescriptionScreen;
