import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text} from 'react-native';

import NumberInput from 'components/NumberInput';
import Picker from 'components/Picker';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import {FOOD_ITEM_GROUP} from 'navigation/Constants';
import {ItemConsumedNavigationProp} from 'navigation/RouteTypes';
import {
  FoodItemContextValue,
  useFoodItemContext,
} from 'providers/FoodItemProvider';
import {
  DrinkUnitsOfMeasurement,
  FoodUnitsOfMeasurement,
  ServingUnitOfMeasurement,
  UnitOfMeasurement,
} from 'types/UnitOfMeasurement';
import {useSimpleStateUpdater} from 'utils/State';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {
  isValidRequiredNumber,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

interface ConsumedItemState {
  quantity: number;
  unitOfMeasurement: ServingUnitOfMeasurement;
}

const getInitialState = (
  foodItemData: FoodItemContextValue['foodItemData'],
) => ({
  quantity: foodItemData?.servingSize || 0,
  unitOfMeasurement: ServingUnitOfMeasurement.Servings,
});

const ItemConsumed = (): React.ReactElement => {
  const navigation = useNavigation<ItemConsumedNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {foodGroupData} = useFoodGroupContext();
  const {foodItemData, saveConsumedFoodItem} = useFoodItemContext();

  const [state, updater, setState] = useSimpleStateUpdater<ConsumedItemState>(
    getInitialState(foodItemData),
  );

  React.useEffect(() => {
    setState(getInitialState(foodItemData));
  }, [foodItemData, setState]);

  const updateQuantity = updater<number>('quantity');
  const onUpdateUnitOfMeasurement =
    updater<ServingUnitOfMeasurement>('unitOfMeasurement');
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as ServingUnitOfMeasurement);
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

  const fOrD = isFoodOrDrink(
    foodItemData?.servingUnitOfMeasurement || UnitOfMeasurement.Grams,
  );
  const uomValues = {
    [FoodItemType.Food]: FoodUnitsOfMeasurement,
    [FoodItemType.Drink]: DrinkUnitsOfMeasurement,
  }[fOrD];
  const uomPlusServings = [ServingUnitOfMeasurement.Servings, ...uomValues];

  const {description, servingSize, servingUnitOfMeasurement, servingSizeNote} =
    foodItemData || {};
  const quantityLabel = `Quantity (1 serving = ${servingSize}${servingUnitOfMeasurement}${
    servingSizeNote ? ` or ${servingSizeNote}` : ''
  })`;

  return (
    <ScreenWrapper>
      <Text>{`How much ${description} did you eat?`}</Text>
      <Spacer />
      <NumberInput
        label={quantityLabel}
        placeholder="Quantity"
        value={state.quantity}
        onChangeText={onChange.quantity}
        error={errors.quantity}
      />
      <Spacer />
      <Picker
        value={state.unitOfMeasurement}
        values={uomPlusServings}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
    </ScreenWrapper>
  );
};

export default ItemConsumed;
