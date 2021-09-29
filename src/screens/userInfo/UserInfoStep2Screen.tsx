import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';

import BaseNumberInput from 'components/BaseNumberInput';
import Spacer from 'components/Spacer';
import {
  UserInfoNavigationProp,
  UserInfoStep2NavigationProp,
} from 'navigation/RouteTypes';
import {useUserInfoContext} from 'providers/UserInfoProvider';
import styles from 'styles';
import {DRAWER} from 'navigation/Constants';
import {
  isValidRequiredNumber,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

const UserInfoStep2Screen = (): React.ReactElement => {
  const navigation = useNavigation<UserInfoStep2NavigationProp>();
  const {userData, updateUserData, saveUser} = useUserInfoContext();
  const {macroDefinition} = userData;
  const {calories, carbs, protein, fat, sugar, fiber} = macroDefinition;

  const updater = React.useCallback(
    (k: string) => (val: number) =>
      updateUserData({macroDefinition: {...macroDefinition, [k]: val}}),
    [macroDefinition, updateUserData],
  );

  const {
    updateCalories,
    updateCarbs,
    updateProtein,
    updateFat,
    updateSugar,
    updateFiber,
  } = React.useMemo(
    () => ({
      updateCalories: updater('calories'),
      updateCarbs: updater('carbs'),
      updateProtein: updater('protein'),
      updateFat: updater('fat'),
      updateSugar: updater('sugar'),
      updateFiber: updater('fiber'),
    }),
    [updater],
  );

  const fieldValidators = React.useMemo(
    () => ({
      calories: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('calories'),
        value: calories,
        onChange: updateCalories,
      },
      carbs: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('carbs'),
        value: carbs,
        onChange: updateCarbs,
      },
      protein: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('protein'),
        value: protein,
        onChange: updateProtein,
      },
      fat: {
        isValid: isValidRequiredNumber,
        message: requiredErrorMessage('fat'),
        value: fat,
        onChange: updateFat,
      },
    }),
    [
      calories,
      carbs,
      fat,
      protein,
      updateCalories,
      updateCarbs,
      updateFat,
      updateProtein,
    ],
  );

  const before = React.useMemo(
    () => ({
      onSave: () => {
        saveUser();
        navigation.getParent<UserInfoNavigationProp>().replace(DRAWER);
      },
    }),
    [navigation, saveUser],
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

  return (
    <View style={styles.screen}>
      <BaseNumberInput
        label="Calories (grams)"
        placeholder="Calories"
        value={calories}
        onChangeText={onChange.calories}
        error={errors.calories}
      />
      <Spacer />
      <BaseNumberInput
        label="Carbohydrates (grams)"
        placeholder="Carbohydrates"
        value={carbs}
        onChangeText={onChange.carbs}
        error={errors.carbs}
      />
      <Spacer />
      <BaseNumberInput
        label="Protein (grams)"
        placeholder="Protein"
        value={protein}
        onChangeText={onChange.protein}
        error={errors.protein}
      />
      <Spacer />
      <BaseNumberInput
        label="Fats (grams)"
        placeholder="Fats"
        value={fat}
        onChangeText={onChange.fat}
        error={errors.fat}
      />
      <Spacer />
      <BaseNumberInput
        label="Sugar (grams/optional)"
        placeholder="Sugar"
        value={sugar || 0}
        onChangeText={updateSugar}
      />
      <Spacer />
      <BaseNumberInput
        label="Fiber (grams/optional)"
        placeholder="Fiber"
        value={fiber || 0}
        onChangeText={updateFiber}
      />
      <Spacer />
    </View>
  );
};

export default UserInfoStep2Screen;
