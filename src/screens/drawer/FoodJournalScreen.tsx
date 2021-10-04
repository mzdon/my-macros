import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {Button, LayoutAnimation, StyleSheet, View} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

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
import {isSameDay} from 'utils/Date';
import {useParentNavigation} from 'utils/Navigation';
import {CatastrophicError} from 'utils/Errors';

const _styles = StyleSheet.create({
  calendar: {
    height: 100,
  },
  selectedDateContainer: {
    backgroundColor: 'pink',
  },
});

interface Props {
  date: Date;
}

const AddMealButton = ({date}: Props) => {
  const navigation = useNavigation<FoodCrudScreenNavigationProp>();
  return (
    <Button
      title="Add Meal"
      onPress={() => navigation.navigate(ADD_MEAL, {date: date.getTime()})}
    />
  );
};

const FoodJournalScreen = () => {
  const {
    params: {date: initialDate},
  } = useRoute<JournalScreenRouteProp>();
  const {user} = useUserContext();
  const {entries, deleteMeal, deleteConsumedFoodItem} = useJournalContext();
  const navigation = useParentNavigation();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const [date, setDate] = React.useState(new Date(initialDate));
  const onSetDate = React.useCallback((selectedDate: moment.Moment) => {
    setDate(selectedDate.toDate());
  }, []);
  const [showCalendarStrip, setShowCalendarStrip] = React.useState(false);

  const toggleCalendarStrip = React.useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setShowCalendarStrip(!showCalendarStrip);
  }, [showCalendarStrip]);

  const AddMealButtonFunction = React.useCallback(
    () => <AddMealButton date={date} />,
    [date],
  );

  const DateHeaderTitle = React.useCallback(() => {
    const icon = showCalendarStrip ? '\u25B2' : '\u25BC';
    return (
      <Button
        title={`${moment(date).format('ddd MM DD YYYY')} ${icon}`}
        onPress={toggleCalendarStrip}
      />
    );
  }, [date, showCalendarStrip, toggleCalendarStrip]);

  React.useLayoutEffect(() => {
    foodCrudNavigation.setOptions({
      headerTitle: DateHeaderTitle,
      headerRight: AddMealButtonFunction,
    });
  }, [AddMealButtonFunction, foodCrudNavigation, DateHeaderTitle]);

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
        date: journalEntryDate.getTime(),
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

  const viewedEntry = React.useMemo(() => {
    return entries.find(entry => isSameDay(entry.date, date)) || null;
  }, [date, entries]);
  const macros = user.getCurrentMacros();
  const markedDates = React.useMemo(() => {
    return entries.map(entry => ({date: entry.date, dots: [{color: 'blue'}]}));
  }, [entries]);

  if (!macros) {
    throw new CatastrophicError('No macros were found!');
  }

  return (
    <View style={styles.screen}>
      {showCalendarStrip && (
        <CalendarStrip
          style={_styles.calendar}
          highlightDateContainerStyle={_styles.selectedDateContainer}
          scrollable
          selectedDate={date}
          onDateSelected={onSetDate}
          markedDates={markedDates}
        />
      )}
      <Stats macros={macros} meals={viewedEntry?.meals} />
      <Spacer />
      <JouranlEntryList
        journalEntry={viewedEntry}
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
