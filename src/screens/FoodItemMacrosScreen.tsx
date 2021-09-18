import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemMacrosNavigationProp} from 'navigation/RouteTypes';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import {useSimpleStateUpdater} from 'utils/State';
import styles from 'styles';
import {useUpdateFoodCrudRoute} from 'utils/Navigation';

const FoodItemMacrosScreen = (): React.ReactElement => {
  const navigation = useNavigation<FoodItemMacrosNavigationProp>();
  const updateFoodCrudRoute = useUpdateFoodCrudRoute(navigation);

  const {foodItemData, saveFoodItem} = useFoodItemContext();

  const [state, updater] = useSimpleStateUpdater({
    carbs: foodItemData?.carbs || 0,
    protein: foodItemData?.protein || 0,
    fat: foodItemData?.fat || 0,
    sugar: foodItemData?.sugar || 0,
    fiber: foodItemData?.fiber || 0,
  });

  const onNext = React.useCallback(() => {
    saveFoodItem(state);
    updateFoodCrudRoute(ITEM_CONSUMED);
  }, [saveFoodItem, state, updateFoodCrudRoute]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Next" onPress={onNext} />,
    });
  }, [navigation, onNext]);

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
    </View>
  );
};

export default FoodItemMacrosScreen;
