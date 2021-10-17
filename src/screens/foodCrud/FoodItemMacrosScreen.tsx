import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Alert, Button, Text} from 'react-native';

import NumberInput from 'components/NumberInput';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import {ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemMacrosNavigationProp} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import {InitFoodItemData} from 'schemas/FoodItem';

const FoodItemMacrosScreen = (): React.ReactElement => {
  const navigation = useNavigation<FoodItemMacrosNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {newFoodItem, foodItemData, updateFoodItemData, saveFoodItem} =
    useFoodItemContext();
  const {
    carbs = 0,
    protein = 0,
    fat = 0,
    sugar = 0,
    fiber = 0,
  } = foodItemData || {};

  function updater<T>(fieldName: keyof InitFoodItemData) {
    return (value: T) => {
      updateFoodItemData({[fieldName]: value});
    };
  }

  const promptUserToUpdateExistingConsumedFoodItems = React.useCallback(() => {
    Alert.alert(
      'Update Existing Entries?',
      'Would you like to update any existing journal entry containing this food item?',
      [
        {
          text: 'No',
          onPress: () => {
            saveFoodItem();
            foodCrudNavigation.goBack();
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            saveFoodItem(true);
            foodCrudNavigation.goBack();
          },
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  }, [foodCrudNavigation, saveFoodItem]);

  const updateCarbs = updater<number>('carbs');
  const updateProtein = updater<number>('protein');
  const updateFat = updater<number>('fat');
  const updateSugar = updater<number>('sugar');
  const updateFiber = updater<number>('fiber');

  const onNext = React.useCallback(() => {
    if (newFoodItem) {
      saveFoodItem();
      navigation.navigate(ITEM_CONSUMED);
    } else {
      promptUserToUpdateExistingConsumedFoodItems();
    }
  }, [
    navigation,
    newFoodItem,
    promptUserToUpdateExistingConsumedFoodItems,
    saveFoodItem,
  ]);

  React.useLayoutEffect(() => {
    const title = newFoodItem ? 'Next' : 'Save';
    navigation.setOptions({
      headerRight: () => <Button title={title} onPress={onNext} />,
    });
  }, [newFoodItem, navigation, onNext]);

  return (
    <ScreenWrapper>
      <Text>{`New ${foodItemData?.description}`}</Text>
      <Spacer />
      <NumberInput
        label="Carbs"
        placeholder="Carbs"
        value={carbs}
        onChangeText={updateCarbs}
      />
      <Spacer />
      <NumberInput
        label="Protein"
        placeholder="Protein"
        value={protein}
        onChangeText={updateProtein}
      />
      <Spacer />
      <NumberInput
        label="Fat"
        placeholder="Fat"
        value={fat}
        onChangeText={updateFat}
      />
      <Spacer />
      <NumberInput
        label="Sugar"
        placeholder="Sugar"
        value={sugar}
        onChangeText={updateSugar}
      />
      <Spacer />
      <NumberInput
        label="Fiber"
        placeholder="Fiber"
        value={fiber}
        onChangeText={updateFiber}
      />
      <Spacer />
    </ScreenWrapper>
  );
};

export default FoodItemMacrosScreen;
