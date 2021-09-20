import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
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
import styles from 'styles';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';

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

  const onSave = React.useCallback(() => {
    saveConsumedFoodItem(state);
    if (!foodGroupData) {
      foodCrudNavigation.goBack();
    } else {
      // const navState = navigation.getState();
      // const key =
      //   navState.routes.find(route => route.name === FOOD_ITEM_GROUP)?.key ||
      //   '';
      // navigation.dispatch(CommonActions.navigate({name: FOOD_ITEM_GROUP, key}));
      foodCrudNavigation.navigate(FOOD_ITEM_GROUP);
    }
  }, [foodCrudNavigation, foodGroupData, saveConsumedFoodItem, state]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={onSave} />,
    });
  }, [navigation, onSave]);

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

  const {description, servingSize, servingUnitOfMeasurement, servingSizeNote} =
    foodItemData || {};
  const quantityLabel = `Quantity (1 serving = ${servingSize}${servingUnitOfMeasurement}${
    servingSizeNote ? ` or ${servingSizeNote}` : ''
  })`;

  return (
    <View style={styles.screen}>
      <Text>{`How much ${description} did you eat?`}</Text>
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
    </View>
  );
};

export default ItemConsumed;
