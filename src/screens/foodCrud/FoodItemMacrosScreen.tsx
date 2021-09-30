import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemMacrosNavigationProp} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import styles from 'styles';
import {InitFoodItemData} from 'schemas/FoodItem';

const FoodItemMacrosScreen = (): React.ReactElement => {
  const navigation = useNavigation<FoodItemMacrosNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {journalEntryId, foodItemData, updateFoodItemData, saveFoodItem} =
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

  const onNext = React.useCallback(() => {
    saveFoodItem();
    if (journalEntryId) {
      navigation.navigate(ITEM_CONSUMED);
    } else {
      foodCrudNavigation.goBack();
    }
  }, [foodCrudNavigation, journalEntryId, navigation, saveFoodItem]);

  React.useLayoutEffect(() => {
    const title = journalEntryId ? 'Next' : 'Save';
    navigation.setOptions({
      headerRight: () => <Button title={title} onPress={onNext} />,
    });
  }, [journalEntryId, navigation, onNext]);

  const updateCarbs = updater<number>('carbs');
  const updateProtein = updater<number>('protein');
  const updateFat = updater<number>('fat');
  const updateSugar = updater<number>('sugar');
  const updateFiber = updater<number>('fiber');

  return (
    <View style={styles.screen}>
      <Text>{`New ${foodItemData?.description}`}</Text>
      <Spacer />
      <BaseNumberInput
        label="Carbs"
        placeholder="Carbs"
        value={carbs}
        onChangeText={updateCarbs}
      />
      <Spacer />
      <BaseNumberInput
        label="Protein"
        placeholder="Protein"
        value={protein}
        onChangeText={updateProtein}
      />
      <Spacer />
      <BaseNumberInput
        label="Fat"
        placeholder="Fat"
        value={fat}
        onChangeText={updateFat}
      />
      <Spacer />
      <BaseNumberInput
        label="Sugar"
        placeholder="Sugar"
        value={sugar}
        onChangeText={updateSugar}
      />
      <Spacer />
      <BaseNumberInput
        label="Fiber"
        placeholder="Fiber"
        value={fiber}
        onChangeText={updateFiber}
      />
      <Spacer />
    </View>
  );
};

export default FoodItemMacrosScreen;
