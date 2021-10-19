import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import NumberInput from 'components/NumberInput';
import Picker from 'components/Picker';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import Text from 'components/Text';
import {FOOD_ITEM_GROUP} from 'navigation/Constants';
import {ItemConsumedNavigationProp} from 'navigation/RouteTypes';
import {
  // FoodItemContextValue,
  useFoodItemContext,
} from 'providers/FoodItemProvider';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {
  DrinkUnitsOfMeasurement,
  FoodUnitsOfMeasurement,
  ServingUnitOfMeasurement,
  UnitOfMeasurement,
} from 'types/UnitOfMeasurement';
import {FoodItemType, isFoodOrDrink} from 'utils/FoodItem';
import {useParentNavigation} from 'utils/Navigation';
import {useSimpleStateUpdater} from 'utils/State';
import {
  isValidRequiredNumber,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';
import Container from 'components/Container';

interface ConsumedItemState {
  quantity: number;
  unitOfMeasurement: ServingUnitOfMeasurement;
}

// TODO: if editing, use existing
// otherwise 1 serving
const getInitialState = () =>
  // foodItemData: FoodItemContextValue['foodItemData'],
  ({
    quantity: 1,
    unitOfMeasurement: ServingUnitOfMeasurement.Servings,
  });

const ItemConsumed = (): React.ReactElement => {
  const navigation = useNavigation<ItemConsumedNavigationProp>();
  const parentNavigation = useParentNavigation();

  const {foodGroupData} = useFoodGroupContext();
  const {foodItemData, saveConsumedFoodItem} = useFoodItemContext();

  const [state, updater, setState] = useSimpleStateUpdater<ConsumedItemState>(
    getInitialState(),
  );

  React.useEffect(() => {
    setState(getInitialState());
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
      parentNavigation.goBack();
    } else {
      navigation.navigate(FOOD_ITEM_GROUP);
    }
  }, [
    foodGroupData,
    navigation,
    parentNavigation,
    saveConsumedFoodItem,
    state,
  ]);

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
      <Container>
        <Spacer />
        <Text.SubHeader>{`How much ${description} did you eat?`}</Text.SubHeader>
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
      </Container>
    </ScreenWrapper>
  );
};

export default ItemConsumed;
