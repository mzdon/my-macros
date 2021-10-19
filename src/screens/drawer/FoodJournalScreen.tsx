import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import {Button, LayoutAnimation, StyleSheet} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

import Container from 'components/Container';
import JouranlEntryList from 'components/JournalEntryList';
import ItemSeparator from 'components/ItemSeparator';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import Stats from 'components/Stats';
import {
  ADD_MEAL,
  FOOD_CRUD,
  ITEM_CONSUMED,
  LOOKUP_OR_ADD,
} from 'navigation/Constants';
import {
  FoodCrudScreenNavigationProp,
  JournalScreenRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import JournalEntry from 'schemas/JournalEntry';
import {defaultPadding} from 'styles';
import {isSameDay} from 'utils/Date';
import {CatastrophicError} from 'utils/Errors';
import {useParentNavigation, useNestedScreenNavigate} from 'utils/Navigation';

const _styles = StyleSheet.create({
  calendarContainer: {
    paddingHorizontal: defaultPadding,
  },
  calendar: {
    height: 80,
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
  const navigation = useNavigation();
  const parentNavigation = useParentNavigation();
  const foodCrudNavigate = useNestedScreenNavigate(parentNavigation, FOOD_CRUD);

  const [date, setDate] = React.useState(new Date(initialDate));
  const onSetDate = React.useCallback((selectedDate: moment.Moment) => {
    setDate(selectedDate.toDate());
  }, []);
  const [showCalendarStrip, setShowCalendarStrip] = React.useState(false);

  const toggleCalendarStrip = React.useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setShowCalendarStrip(!showCalendarStrip);
  }, [showCalendarStrip]);

  // header buttons
  const AddMealButtonFunction = React.useCallback(
    () => <AddMealButton date={date} />,
    [date],
  );
  const DateHeaderTitle = React.useCallback(() => {
    const icon = showCalendarStrip ? '\u25B2' : '\u25BC';
    return (
      <Button
        title={`${moment(date).format('ddd MMM DD YYYY')} ${icon}`}
        onPress={toggleCalendarStrip}
      />
    );
  }, [date, showCalendarStrip, toggleCalendarStrip]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: DateHeaderTitle,
      headerRight: AddMealButtonFunction,
    });
  });

  const addItem = React.useCallback(
    (journalEntryId: JournalEntry['_id'], mealIndex: number) =>
      foodCrudNavigate(LOOKUP_OR_ADD, {
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
      }),
    [foodCrudNavigate],
  );

  const editMeal = React.useCallback(
    (journalEntryDate: Date, mealIndex: number) =>
      parentNavigation?.navigate(ADD_MEAL, {
        date: journalEntryDate.getTime(),
        mealIndex,
      }),
    [parentNavigation],
  );

  const editConsumedFoodItem = React.useCallback(
    (
      journalEntryId: JournalEntry['_id'],
      mealIndex: number,
      consumedItemIndex: number,
    ) =>
      foodCrudNavigate(ITEM_CONSUMED, {
        journalEntryId: journalEntryId.toHexString(),
        mealIndex,
        consumedItemIndex,
      }),
    [foodCrudNavigate],
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
    <ScreenWrapper>
      <Spacer />
      {showCalendarStrip && (
        <>
          <Container>
            <CalendarStrip
              style={_styles.calendar}
              maxDayComponentSize={48}
              highlightDateContainerStyle={_styles.selectedDateContainer}
              scrollable
              selectedDate={date}
              onDateSelected={onSetDate}
              markedDates={markedDates}
            />
          </Container>
          <ItemSeparator />
          <Spacer />
        </>
      )}
      <Container>
        <Stats macros={macros} meals={viewedEntry?.meals} />
      </Container>
      <Spacer />
      <ItemSeparator />
      <JouranlEntryList
        journalEntry={viewedEntry}
        onAddItem={addItem}
        onEditMeal={editMeal}
        onDeleteMeal={deleteMeal}
        onEditConsumedFoodItem={editConsumedFoodItem}
        onDeleteConsumedFoodItem={deleteConsumedFoodItem}
        EmptyComponent={AddMealButtonFunction}
      />
    </ScreenWrapper>
  );
};

export default FoodJournalScreen;
