import React from 'react';

import {CommonActions, useNavigation} from '@react-navigation/native';
import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import RadioButtons from 'components/RadioButtons';
import {FOOD_ITEM_GROUP} from 'navigation/Constants';
import {ItemConsumedNavigationProp} from 'navigation/RouteTypes';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';
import styles from 'styles';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';

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

  const {foodGroupData} = useFoodGroupContext();
  const {foodItemData, saveConsumedFoodItem} = useFoodItemContext();

  const [state, updater] = useSimpleStateUpdater({
    quantity: foodItemData?.servingSize || 0,
    unitOfMeasurement:
      foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
  });

  const onSave = React.useCallback(() => {
    saveConsumedFoodItem(state);
    const parentNavigator = navigation.getParent();
    if (parentNavigator && !foodGroupData) {
      console.log('parentNavigator.goBack');
      parentNavigator.goBack();
    } else {
      const navState = navigation.getState();
      const key =
        navState.routes.find(route => route.name === FOOD_ITEM_GROUP)?.key ||
        '';
      navigation.dispatch(CommonActions.navigate({name: FOOD_ITEM_GROUP, key}));
    }
  }, [foodGroupData, navigation, saveConsumedFoodItem, state]);

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
        <Button title="Save" onPress={onSave} />
      </View>
    </View>
  );
};

export default ItemConsumed;
