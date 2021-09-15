import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, View} from 'react-native';

import JouranlEntryList from 'components/JournalEntryList';
import Spacer from 'components/Spacer';
import Stats from 'components/Stats';
import {
  ADD_MEAL,
  DATE_SELECTOR,
  FOOD_CRUD,
  ITEM_CONSUMED,
  LOOKUP_OR_ADD,
} from 'navigation/Constants';
import {
  JournalScreenNavigationProp,
  JournalScreenRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import styles from 'styles';
import JournalEntry from 'schemas/JournalEntry';

const ChangeDateButton = () => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  return (
    <Button
      title="Change Date"
      onPress={() => navigation.navigate(DATE_SELECTOR)}
    />
  );
};

interface Props {
  date: string;
}

const AddMealButton = ({date}: Props) => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
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
  const navigation = useNavigation<JournalScreenNavigationProp>();

  const AddMealButtonFunction = React.useCallback(
    () => <AddMealButton date={date} />,
    [date],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: date,
      headerLeft: () => <ChangeDateButton />,
      headerRight: AddMealButtonFunction,
    });
  }, [navigation, date, AddMealButtonFunction]);

  const addItem = React.useCallback(
    (journalEntryId: JournalEntry['_id'], mealIndex: number) =>
      navigation.navigate(FOOD_CRUD, {
        screen: LOOKUP_OR_ADD,
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
      }),
    [navigation],
  );

  const editMeal = React.useCallback(
    (journalEntryDate: Date, mealIndex: number) =>
      navigation.navigate(ADD_MEAL, {
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
      navigation.navigate(FOOD_CRUD, {
        screen: ITEM_CONSUMED,
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
        consumedItemIndex,
      }),
    [navigation],
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
