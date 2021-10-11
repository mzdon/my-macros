import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Alert, Button, Text, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemMacrosNavigationProp} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useFoodItemContext} from 'providers/FoodItemProvider';
import styles from 'styles';
import {InitFoodItemData} from 'schemas/FoodItem';
import {
  isValidRequiredNumber,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

const FoodItemMacrosScreen = (): React.ReactElement => {
  const navigation = useNavigation<FoodItemMacrosNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {newFoodItem, foodItemData, updateFoodItemData, saveFoodItem} =
    useFoodItemContext();
  const {
    carbs = 0,
    protein = 0,
    fat = 0,
    sugar = 0,
    fiber = 0,
  } = foodItemData || {};

  function updater<T>(fieldName: keyof InitFoodItemData) {
    return (value: T) => {
      updateFoodItemData({[fieldName]: value});
    };
  }

  const promptUserToUpdateExistingConsumedFoodItems = React.useCallback(() => {
    Alert.alert(
      'Update Existing Entries?',
      'Would you like to update any existing journal entry containing this food item?',
      [
        {
          text: 'No',
          onPress: () => {
            saveFoodItem();
            foodCrudNavigation.goBack();
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            saveFoodItem(true);
            foodCrudNavigation.goBack();
          },
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  }, [foodCrudNavigation, saveFoodItem]);

  const updateCarbs = updater<number>('carbs');
  const updateProtein = updater<number>('protein');
  const updateFat = updater<number>('fat');
  const updateSugar = updater<number>('sugar');
  const updateFiber = updater<number>('fiber');

  const fieldValidators = React.useMemo(
    () => ({
      carbs: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Carbs'),
        value: carbs,
        onChange: updateCarbs,
      },
      protien: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Protein'),
        value: protein,
        onChange: updateProtein,
      },
      fat: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('Fat'),
        value: fat,
        onChange: updateFat,
      },
    }),
    [carbs, fat, protein, updateCarbs, updateFat, updateProtein],
  );

  const onNext = React.useCallback(() => {
    if (newFoodItem) {
      saveFoodItem();
      navigation.navigate(ITEM_CONSUMED);
    } else {
      promptUserToUpdateExistingConsumedFoodItems();
    }
  }, [
    navigation,
    newFoodItem,
    promptUserToUpdateExistingConsumedFoodItems,
    saveFoodItem,
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
    const title = newFoodItem ? 'Next' : 'Save';
    navigation.setOptions({
      headerRight: () => (
        <Button title={title} onPress={validateBefore.onNext} />
      ),
    });
  }, [newFoodItem, navigation, validateBefore.onNext]);

  return (
    <View style={styles.screen}>
      <Text>{`New ${foodItemData?.description}`}</Text>
      <Spacer />
      <BaseNumberInput
        label="Carbs"
        placeholder="Carbs"
        value={carbs}
        onChangeText={onChange.carbs}
        error={errors.carbs}
      />
      <Spacer />
      <BaseNumberInput
        label="Protein"
        placeholder="Protein"
        value={protein}
        onChangeText={onChange.protien}
        error={errors.protien}
      />
      <Spacer />
      <BaseNumberInput
        label="Fat"
        placeholder="Fat"
        value={fat}
        onChangeText={onChange.fat}
        error={errors.fat}
      />
      <Spacer />
      <BaseNumberInput
        label="Sugar"
        placeholder="Sugar"
        value={sugar}
        onChangeText={updateSugar}
      />
      <Spacer />
      <BaseNumberInput
        label="Fiber"
        placeholder="Fiber"
        value={fiber}
        onChangeText={updateFiber}
      />
      <Spacer />
    </View>
  );
};

export default FoodItemMacrosScreen;
