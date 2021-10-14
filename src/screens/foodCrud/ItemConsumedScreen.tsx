import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import RadioButtons from 'components/RadioButtons';
import {FOOD_ITEM_GROUP} from 'navigation/Constants';
import {ItemConsumedNavigationProp} from 'navigation/RouteTypes';
import {
  FoodItemContextValue,
  useFoodItemContext,
} from 'providers/FoodItemProvider';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {
  isValidRequiredNumber,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

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

const getInitialState = (
  foodItemData: FoodItemContextValue['foodItemData'],
) => ({
  quantity: foodItemData?.servingSize || 0,
  unitOfMeasurement:
    foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
});

const ItemConsumed = (): React.ReactElement => {
  const navigation = useNavigation<ItemConsumedNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {foodGroupData} = useFoodGroupContext();
  const {foodItemData, saveConsumedFoodItem} = useFoodItemContext();

  const [state, updater, setState] = useSimpleStateUpdater(
    getInitialState(foodItemData),
  );

  React.useEffect(() => {
    setState(getInitialState(foodItemData));
  }, [foodItemData, setState]);

  const updateQuantity = updater<number>('quantity');
  const onUpdateUnitOfMeasurement =
    updater<UnitOfMeasurement>('unitOfMeasurement');
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as UnitOfMeasurement);
  };

  const fieldValidators = React.useMemo(
    () => ({
      quantity: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Quantity'),
        value: state.quantity,
        onChange: updateQuantity,
      },
    }),
    [state.quantity, updateQuantity],
  );

  const onSave = React.useCallback(() => {
    saveConsumedFoodItem(state);
    if (!foodGroupData) {
      foodCrudNavigation.goBack();
    } else {
      foodCrudNavigation.navigate(FOOD_ITEM_GROUP);
    }
  }, [foodCrudNavigation, foodGroupData, saveConsumedFoodItem, state]);

  const before = React.useMemo(
    () => ({
      onSave,
    }),
    [onSave],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Save" onPress={validateBefore.onSave} />
      ),
    });
  }, [navigation, validateBefore.onSave]);

  const uomValues =
    UOM_VALUES[
      isFoodOrDrink(
        foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
      )
    ];

  const {description, servingSize, servingUnitOfMeasurement, servingSizeNote} =
    foodItemData || {};
  const quantityLabel = `Quantity (1 serving = ${servingSize}${servingUnitOfMeasurement}${
    servingSizeNote ? ` or ${servingSizeNote}` : ''
  })`;

  return (
    <ScreenWrapper>
      <Text>{`How much ${description} did you eat?`}</Text>
      <Spacer />
      <BaseNumberInput
        label={quantityLabel}
        placeholder="Quantity"
        value={state.quantity}
        onChangeText={onChange.quantity}
        error={errors.quantity}
      />
      <Spacer />
      <RadioButtons
        value={state.unitOfMeasurement}
        values={uomValues}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
    </ScreenWrapper>
  );
};

export default ItemConsumed;
