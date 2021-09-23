import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, View} from 'react-native';

import JouranlEntryList from 'components/JournalEntryList';
import Spacer from 'components/Spacer';
import Stats from 'components/Stats';
import {ADD_MEAL, ITEM_CONSUMED, LOOKUP_OR_ADD} from 'navigation/Constants';
import {
  FoodCrudScreenNavigationProp,
  JournalScreenRouteProp,
} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import styles from 'styles';
import JournalEntry from 'schemas/JournalEntry';
import {useParentNavigation} from 'utils/Navigation';

interface Props {
  date: string;
}

const AddMealButton = ({date}: Props) => {
  const navigation = useNavigation<FoodCrudScreenNavigationProp>();
  return (
    <Button
      title="Add Meal"
      onPress={() => navigation.navigate(ADD_MEAL, {date})}
    />
  );
};

const FoodJournalScreen = () => {
  const {
    params: {date},
  } = useRoute<JournalScreenRouteProp>();
  const {user} = useUserContext();
  const {todaysEntry, deleteMeal, deleteConsumedFoodItem} = useJournalContext();
  const navigation = useParentNavigation();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const AddMealButtonFunction = React.useCallback(
    () => <AddMealButton date={date} />,
    [date],
  );

  React.useLayoutEffect(() => {
    foodCrudNavigation.setOptions({
      title: date,
      headerRight: AddMealButtonFunction,
    });
  }, [date, AddMealButtonFunction, foodCrudNavigation]);

  const addItem = React.useCallback(
    (journalEntryId: JournalEntry['_id'], mealIndex: number) =>
      foodCrudNavigation.navigate(LOOKUP_OR_ADD, {
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
      }),
    [foodCrudNavigation],
  );

  const editMeal = React.useCallback(
    (journalEntryDate: Date, mealIndex: number) =>
      navigation?.navigate(ADD_MEAL, {
        date: journalEntryDate.toDateString(),
        mealIndex,
      }),
    [navigation],
  );

  const editConsumedFoodItem = React.useCallback(
    (
      journalEntryId: JournalEntry['_id'],
      mealIndex: number,
      consumedItemIndex: number,
    ) =>
      foodCrudNavigation.navigate(ITEM_CONSUMED, {
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
        consumedItemIndex,
      }),
    [foodCrudNavigation],
  );

  const macros = user.getCurrentMacros();

  return (
    <View style={styles.screen}>
      <Stats macros={macros} meals={todaysEntry?.meals} />
      <Spacer />
      <JouranlEntryList
        journalEntry={todaysEntry}
        onAddItem={addItem}
        onEditMeal={editMeal}
        onDeleteMeal={deleteMeal}
        onEditConsumedFoodItem={editConsumedFoodItem}
        onDeleteConsumedFoodItem={deleteConsumedFoodItem}
        EmptyComponent={AddMealButtonFunction}
      />
    </View>
  );
};

export default FoodJournalScreen;
