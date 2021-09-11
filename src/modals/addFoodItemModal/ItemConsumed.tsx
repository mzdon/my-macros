import React from 'react';

import {Button, StyleSheet, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import RadioButtons from 'components/RadioButtons';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';

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

interface Props {
  consumedFoodItem: ConsumedFoodItemData;
  onGoBack: () => void;
  onAddItemConsumed: (foodItem: ConsumedFoodItemData) => void;
}

const ItemConsumed = ({
  consumedFoodItem,
  onGoBack,
  onAddItemConsumed,
}: Props) => {
  const [state, updater] = useSimpleStateUpdater({
    quantity: consumedFoodItem.quantity,
    unitOfMeasurement: consumedFoodItem.unitOfMeasurement,
  });

  const onNext = React.useCallback(() => {
    const {quantity, unitOfMeasurement} = state;
    consumedFoodItem.quantity = quantity;
    consumedFoodItem.unitOfMeasurement = unitOfMeasurement;
    onAddItemConsumed(consumedFoodItem);
  }, [consumedFoodItem, state, onAddItemConsumed]);

  const updateQuantity = updater<number>('quantity');
  const onUpdateUnitOfMeasurement =
    updater<UnitOfMeasurement>('unitOfMeasurement');
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as UnitOfMeasurement);
  };

  const uomValues =
    UOM_VALUES[isFoodOrDrink(consumedFoodItem.item.servingUnitOfMeasurement)];

  const {item} = consumedFoodItem;
  const {servingSize, servingUnitOfMeasurement, servingSizeNote} = item;
  const quantityLabel = `Quantity (1 serving = ${servingSize}${servingUnitOfMeasurement}${
    servingSizeNote ? ` or ${servingSizeNote}` : ''
  })`;

  return (
    <>
      <Text>{`How much ${consumedFoodItem.item.description} did you eat?`}</Text>
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
        <Button title="Back" onPress={onGoBack} />
        <Button title="Next" onPress={onNext} />
      </View>
    </>
  );
};

export default ItemConsumed;
