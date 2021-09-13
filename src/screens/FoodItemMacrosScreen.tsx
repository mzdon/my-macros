import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemMacrosNavigationProp} from 'navigation/RouteTypes';
import {useFoodContext} from 'providers/FoodProvider';
import {useSimpleStateUpdater} from 'utils/State';
import styles from 'styles';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

const FoodItemMacrosScreen = (): React.ReactElement => {
  const navigation = useNavigation<FoodItemMacrosNavigationProp>();

  const {foodItemData, saveFoodItem} = useFoodContext();

  const [state, updater] = useSimpleStateUpdater({
    carbs: foodItemData?.carbs || 0,
    protein: foodItemData?.protein || 0,
    fat: foodItemData?.fat || 0,
    sugar: foodItemData?.sugar || 0,
    fiber: foodItemData?.fiber || 0,
  });

  const onNext = React.useCallback(() => {
    saveFoodItem(state);
    navigation.navigate(ITEM_CONSUMED);
  }, [saveFoodItem, state, navigation]);

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
        <Button title="Back" onPress={navigation.goBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

export default FoodItemMacrosScreen;
