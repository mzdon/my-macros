import React from 'react';

import {Button, SectionList, StyleSheet} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import Container from 'components/Container';
import ItemSeparator from 'components/ItemSeparator';
import MealHeader from 'components/MealHeader';
import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import ConsumedFoodItemSchema from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import Meal from 'schemas/Meal';
import Spacer from './Spacer';

const _styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

type JournalEntryId = JournalEntry['_id'];

interface Props {
  journalEntry: JournalEntry | null;
  onAddItem: (journalEntryId: JournalEntryId, mealIndex: number) => void;
  onEditMeal: (journalEntryDate: Date, mealIndex: number) => void;
  onDeleteMeal: (meal: Meal) => void;
  onEditConsumedFoodItem: (
    journalEntryId: JournalEntryId,
    mealIndex: number,
    consumedFoodItemIndex: number,
  ) => void;
  onDeleteConsumedFoodItem: (consumedFoodItem: ConsumedFoodItemSchema) => void;
  EmptyComponent: () => React.ReactElement;
}

type Section = {
  meal: Meal;
  mealIndex: number;
  journalEntry: JournalEntry;
  data: ConsumedFoodItemSchema[];
};

function formatSections(journalEntry: JournalEntry | null): Section[] {
  if (!journalEntry) {
    return [];
  }
  const sections: Section[] = [];
  return journalEntry.meals.reduce((result, meal, idx) => {
    const nextResult = [...result];
    nextResult.push({
      meal,
      mealIndex: idx,
      data: meal.items,
      journalEntry,
    });
    return nextResult;
  }, sections);
}

const JouranlEntryList = (props: Props): React.ReactElement<Props> => {
  const {
    onAddItem,
    onEditMeal,
    onDeleteMeal,
    onEditConsumedFoodItem,
    onDeleteConsumedFoodItem,
    EmptyComponent,
  } = props;

  const renderItem = React.useCallback(
    ({
      section,
      item,
      index,
    }: {
      section: Section;
      item: ConsumedFoodItemSchema;
      index: number;
    }) => {
      const {journalEntry, mealIndex} = section;
      return (
        <SwipeableRow
          rightActions={getEditAndDeleteActions({
            onEditPress: () =>
              onEditConsumedFoodItem(journalEntry._id, mealIndex, index),
            onDeletePress: () => onDeleteConsumedFoodItem(item),
          })}>
          <Container style={_styles.rowContainer}>
            <Spacer />
            <ConsumedFoodItem item={item} />
            <Spacer />
          </Container>
        </SwipeableRow>
      );
    },
    [onDeleteConsumedFoodItem, onEditConsumedFoodItem],
  );

  const renderSectionHeader = React.useCallback(
    ({section: {meal, journalEntry, mealIndex}}: {section: Section}) => (
      <>
        <SwipeableRow
          rightActions={getEditAndDeleteActions({
            onEditPress: () => onEditMeal(journalEntry.date, mealIndex),
            onDeletePress: () => onDeleteMeal(meal),
          })}>
          <Container style={_styles.rowContainer}>
            <MealHeader meal={meal} />
          </Container>
        </SwipeableRow>
        <ItemSeparator />
      </>
    ),
    [onDeleteMeal, onEditMeal],
  );

  const renderSectionFooter = React.useCallback(
    ({section}: {section: Section}) => {
      const {journalEntry, mealIndex, data} = section;
      return (
        <>
          {!!data.length && <ItemSeparator />}
          <Button
            title="Add Item"
            onPress={() => onAddItem(journalEntry._id, mealIndex)}
          />
          <ItemSeparator />
        </>
      );
    },
    [onAddItem],
  );

  return (
    <SectionList
      sections={formatSections(props.journalEntry)}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      keyExtractor={item => item._objectId()}
      ListEmptyComponent={EmptyComponent}
      ItemSeparatorComponent={ItemSeparator}
      stickySectionHeadersEnabled={false}
      initialNumToRender={40}
    />
  );
};

export default JouranlEntryList;
