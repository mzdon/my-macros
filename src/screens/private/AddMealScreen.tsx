import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import {
  AddMealScreenNavigationProp,
  AddMealScreenRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';
import styles from 'styles';
import moment from 'moment';

const AddMealScreen = () => {
  const navigation = useNavigation<AddMealScreenNavigationProp>();
  const route = useRoute<AddMealScreenRouteProp>();
  const {date: dateParam, mealIndex} = route.params;

  const date = React.useMemo(() => new Date(dateParam), [dateParam]);

  const {saveMeal} = useJournalContext();

  const called = React.useRef(false);
  const onAddMeal = React.useCallback(
    desc => {
      if (called.current) {
        return;
      }
      called.current = true;
      saveMeal(date, desc, mealIndex);
      navigation.goBack();
    },
    [saveMeal, date, mealIndex, navigation],
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: '',
      headerRight: () => <Button title="Save" onPress={onAddCustom} />,
    });
  }, [navigation, onAddCustom]);

  return (
    <View style={styles.screen}>
      <Text>{`Add Meal on ${moment(date).format('ddd MM DD YYYY')}`}</Text>
      <Button title="Breakfast" onPress={onAddBreakfast} />
      <Button title="Lunch" onPress={onAddLunch} />
      <Button title="Dinner" onPress={onAddDinner} />
      <Button title="Snack" onPress={onAddSnack} />
      <BaseTextInput value={description} onChangeText={setDescription} />
    </View>
  );
};

export default AddMealScreen;
