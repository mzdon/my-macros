import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {Button, StyleSheet} from 'react-native';

import Container from 'components/Container';
import ScreenWrapper from 'components/ScreenWrapper';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import {
  AddMealScreenNavigationProp,
  AddMealScreenRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';
import {
  isValidRequiredString,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';
import Spacer from 'components/Spacer';

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  stretchInput: {
    alignSelf: 'stretch',
  },
});

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

  const fieldValidators = React.useMemo(
    () => ({
      description: {
        isValid: isValidRequiredString,
        message: requiredErrorMessage('Description'),
        value: description,
        onChange: setDescription,
      },
    }),
    [description],
  );

  const before = React.useMemo(
    () => ({
      onAddCustom,
    }),
    [onAddCustom],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Add Meal',
      headerRight: () => (
        <Button title="Save" onPress={validateBefore.onAddCustom} />
      ),
    });
  }, [navigation, onAddCustom, validateBefore.onAddCustom]);

  return (
    <ScreenWrapper>
      <Container style={_styles.container}>
        <Spacer />
        <Text.PageHeader>{`Add Meal on ${moment(date).format(
          'ddd MM DD YYYY',
        )}`}</Text.PageHeader>
        <Button title="Breakfast" onPress={onAddBreakfast} />
        <Button title="Lunch" onPress={onAddLunch} />
        <Button title="Dinner" onPress={onAddDinner} />
        <Button title="Snack" onPress={onAddSnack} />
        <TextInput
          placeholder="Custom meal description..."
          value={description}
          onChangeText={onChange.description}
          error={errors.description}
          style={_styles.stretchInput}
        />
      </Container>
    </ScreenWrapper>
  );
};

export default AddMealScreen;
