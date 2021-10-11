import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import BaseTextInput from 'components/BaseTextInput';
import RadioButtons from 'components/RadioButtons';
import Spacer from 'components/Spacer';
import {FOOD_ITEM_MACROS} from 'navigation/Constants';
import {FoodItemDescriptionNavigationProp} from 'navigation/RouteTypes';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import styles from 'styles';
import {InitFoodItemData} from 'schemas/FoodItem';
import {Errors, NameExistsError} from 'utils/Errors';
import {
  isValidRequiredNumber,
  isValidRequiredString,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

const SERVING_UMO_VALUES = [
  UnitOfMeasurement.Grams,
  UnitOfMeasurement.Ounces,
  UnitOfMeasurement.FluidOunces,
  UnitOfMeasurement.Liters,
];

const FoodItemDescriptionScreen = () => {
  const navigation = useNavigation<FoodItemDescriptionNavigationProp>();
  const {
    foodItemData,
    updateFoodItemData,
    checkForExistingFoodItemDescription,
  } = useFoodItemContext();
  const {
    description = '',
    servingSize = 0,
    servingUnitOfMeasurement = UnitOfMeasurement.Grams,
    servingSizeNote = '',
    calories = 0,
  } = foodItemData || {};

  const [internalFieldErrors, setInternalFieldErrors] = React.useState<
    Errors<InitFoodItemData>
  >({});

  function updater<T>(fieldName: keyof InitFoodItemData) {
    return (value: T) => {
      updateFoodItemData({[fieldName]: value});
    };
  }

  const onUpdateDescription = updater('description');
  const updateDescription = React.useCallback(
    (val: string) => {
      if (internalFieldErrors.description) {
        const newState = {...internalFieldErrors};
        delete newState.description;
        setInternalFieldErrors(newState);
      }
      onUpdateDescription(val);
    },
    [internalFieldErrors, onUpdateDescription],
  );
  const updateServingSize = updater<number>('servingSize');
  const onUpdateUnitOfMeasurement = updater<UnitOfMeasurement>(
    'servingUnitOfMeasurement',
  );
  const updateUnitOfMeasurement = (value: string | null) => {
    onUpdateUnitOfMeasurement(value as UnitOfMeasurement);
  };
  const updateServingNote = updater('servingSizeNote');
  const updateCalories = updater<number>('calories');

  const fieldValidators = React.useMemo(
    () => ({
      description: {
        isValid: isValidRequiredString,
        message: requiredErrorMessage('Description'),
        value: description,
        onChange: updateDescription,
      },
      servingSize: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Serving Size'),
        value: servingSize,
        onChange: updateServingSize,
      },
      calories: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Calories'),
        value: calories,
        onChange: updateCalories,
      },
    }),
    [
      calories,
      description,
      servingSize,
      updateCalories,
      updateDescription,
      updateServingSize,
    ],
  );

  const onNext = React.useCallback(() => {
    try {
      checkForExistingFoodItemDescription(foodItemData);
      navigation.navigate(FOOD_ITEM_MACROS);
    } catch (e) {
      if (e instanceof NameExistsError) {
        setInternalFieldErrors({
          ...internalFieldErrors,
          description: e.message,
        });
      }
    }
  }, [
    checkForExistingFoodItemDescription,
    internalFieldErrors,
    foodItemData,
    navigation,
  ]);

  const before = React.useMemo(
    () => ({
      onNext,
    }),
    [onNext],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Next" onPress={validateBefore.onNext} />
      ),
    });
  }, [navigation, validateBefore.onNext]);

  return (
    <View style={styles.screen}>
      <Text>{`${foodItemData?.newFoodItem ? 'New' : 'Edit'} Item`}</Text>
      <Spacer />
      <BaseTextInput
        label="Description"
        placeholder="New item description..."
        value={description}
        onChangeText={onChange.description}
        error={internalFieldErrors.description || errors.description}
      />
      <Spacer />
      <BaseNumberInput
        label="Serving Size"
        placeholder="What's the serving size?"
        value={servingSize}
        onChangeText={onChange.servingSize}
        error={errors.servingSize}
      />
      <Spacer />
      <RadioButtons
        value={servingUnitOfMeasurement}
        values={SERVING_UMO_VALUES}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
      <BaseTextInput
        label="Serving Size Note"
        placeholder="Aribitrary info like '3 cakes'"
        value={servingSizeNote}
        onChangeText={updateServingNote}
      />
      <Spacer />
      <BaseNumberInput
        label="Calories"
        placeholder="Calories"
        value={calories}
        onChangeText={onChange.calories}
        error={errors.calories}
      />
      <Spacer />
    </View>
  );
};

export default FoodItemDescriptionScreen;
