import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Text} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import {
  AddMealModalNavigationProp,
  AddMealModalRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';

const AddMealScreen = () => {
  const {createMeal} = useJournalContext();
  const navigation = useNavigation<AddMealModalNavigationProp>();
  const route = useRoute<AddMealModalRouteProp>();
  const {date} = route.params;

  const called = React.useRef(false);
  const onAddMeal = React.useCallback(
    desc => {
      if (called.current) {
        return;
      }
      called.current = true;
      createMeal(date, desc);
      navigation.goBack();
    },
    [createMeal, date, navigation],
  );

  const onAddBreakfast = React.useCallback(
    () => onAddMeal('Breakfast'),
    [onAddMeal],
  );
  const onAddLunch = React.useCallback(() => onAddMeal('Lunch'), [onAddMeal]);
  const onAddDinner = React.useCallback(() => onAddMeal('Dinner'), [onAddMeal]);
  const onAddSnack = React.useCallback(() => onAddMeal('Snack'), [onAddMeal]);

  const [description, setDescription] = React.useState('');
  const onAddCustom = React.useCallback(
    () => onAddMeal(description),
    [onAddMeal, description],
  );

  return (
    <>
      <Text>{`Add Meal on ${date}`}</Text>
      <Button title="Breakfast" onPress={onAddBreakfast} />
      <Button title="Lunch" onPress={onAddLunch} />
      <Button title="Dinner" onPress={onAddDinner} />
      <Button title="Snack" onPress={onAddSnack} />
      <BaseTextInput value={description} onChangeText={setDescription} />
      <Button title="Save" onPress={onAddCustom} />
    </>
  );
};

export default AddMealScreen;
