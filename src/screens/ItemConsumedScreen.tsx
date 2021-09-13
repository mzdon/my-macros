import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import RadioButtons from 'components/RadioButtons';
import {ItemConsumedNavigationProp} from 'navigation/RouteTypes';
import {useFoodContext} from 'providers/FoodProvider';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';
import styles from 'styles';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

const UOM_VALUES = {
  [FoodItemType.Food]: [
    UnitOfMeasurement.Grams,
    UnitOfMeasurement.Ounces,
    Servings,
  ],
  [FoodItemType.Drink]: [
    UnitOfMeasurement.FluidOunces,
    UnitOfMeasurement.Liters,
    Servings,
  ],
};

const ItemConsumed = (): React.ReactElement => {
  const navigation = useNavigation<ItemConsumedNavigationProp>();

  const {foodItemData, saveConsumedFoodItem} = useFoodContext();

  const [state, updater] = useSimpleStateUpdater({
    quantity: foodItemData?.servingSize || 0,
    unitOfMeasurement:
      foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
  });

  const onNext = React.useCallback(() => {
    saveConsumedFoodItem(state);
    const parentNavigator = navigation.getParent();
    if (parentNavigator) {
      parentNavigator.goBack();
    } else {
      navigation.popToTop();
    }
  }, [navigation, saveConsumedFoodItem, state]);

  const updateQuantity = updater<number>('quantity');
  const onUpdateUnitOfMeasurement =
    updater<UnitOfMeasurement>('unitOfMeasurement');
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as UnitOfMeasurement);
  };

  const uomValues =
    UOM_VALUES[
      isFoodOrDrink(
        foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
      )
    ];

  const item = foodItemData || {};
  const {servingSize, servingUnitOfMeasurement, servingSizeNote} = item;
  const quantityLabel = `Quantity (1 serving = ${servingSize}${servingUnitOfMeasurement}${
    servingSizeNote ? ` or ${servingSizeNote}` : ''
  })`;

  return (
    <View style={styles.screen}>
      <Text>{`How much ${item.description} did you eat?`}</Text>
      <Spacer />
      <BaseNumberInput
        label={quantityLabel}
        placeholder="Quantity"
        value={state.quantity}
        onChangeText={updateQuantity}
      />
      <Spacer />
      <RadioButtons
        value={state.unitOfMeasurement}
        values={uomValues}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
      <View style={_styles.buttonContainer}>
        <Button title="Back" onPress={navigation.goBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

export default ItemConsumed;
