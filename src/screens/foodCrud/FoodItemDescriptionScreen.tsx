import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text} from 'react-native';

import NumberInput from 'components/NumberInput';
import Picker from 'components/Picker';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import TextInput from 'components/TextInput';
import {FOOD_ITEM_MACROS} from 'navigation/Constants';
import {FoodItemDescriptionNavigationProp} from 'navigation/RouteTypes';
import {
  AllUnitsOfMeasurement,
  UnitOfMeasurement,
} from 'types/UnitOfMeasurement';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import {InitFoodItemData} from 'schemas/FoodItem';
import {Errors, NameExistsError} from 'utils/Errors';
import {
  isValidRequiredNumber,
  isValidRequiredString,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

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
    }),
    [description, servingSize, updateDescription, updateServingSize],
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
    <ScreenWrapper>
      <Text>{`${foodItemData?.newFoodItem ? 'New' : 'Edit'} Item`}</Text>
      <Spacer />
      <TextInput
        label="Description"
        placeholder="New item description..."
        value={description}
        onChangeText={onChange.description}
        error={internalFieldErrors.description || errors.description}
      />
      <Spacer />
      <NumberInput
        label="Serving Size"
        placeholder="What's the serving size?"
        value={servingSize}
        onChangeText={onChange.servingSize}
        error={errors.servingSize}
      />
      <Spacer />
      <Picker
        label="Unit of Measurement"
        value={servingUnitOfMeasurement}
        values={AllUnitsOfMeasurement}
        onChange={updateUnitOfMeasurement}
      />
      <Spacer />
      <TextInput
        label="Serving Size Note"
        placeholder="Aribitrary info like '3 cakes'"
        value={servingSizeNote}
        onChangeText={updateServingNote}
      />
      <Spacer />
      <NumberInput
        label="Calories"
        placeholder="Calories"
        value={calories}
        onChangeText={updateCalories}
      />
      <Spacer />
    </ScreenWrapper>
  );
};

export default FoodItemDescriptionScreen;
