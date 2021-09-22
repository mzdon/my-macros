import React from 'react';

import {Button, SectionList, StyleSheet, View} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import MealHeader from 'components/MealHeader';
import Spacer from 'components/Spacer';
import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import ConsumedFoodItemSchema from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import Meal from 'schemas/Meal';

const _styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
          <View style={_styles.titleContainer}>
            <ConsumedFoodItem item={item} />
          </View>
        </SwipeableRow>
      );
    },
    [onDeleteConsumedFoodItem, onEditConsumedFoodItem],
  );

  const renderSectionHeader = React.useCallback(
    ({section: {meal, journalEntry, mealIndex}}: {section: Section}) => (
      <SwipeableRow
        rightActions={getEditAndDeleteActions({
          onEditPress: () => onEditMeal(journalEntry.date, mealIndex),
          onDeletePress: () => onDeleteMeal(meal),
        })}>
        <View style={_styles.titleContainer}>
          <MealHeader meal={meal} />
        </View>
      </SwipeableRow>
    ),
    [onDeleteMeal, onEditMeal],
  );

  const renderSectionFooter = React.useCallback(
    ({section}: {section: Section}) => {
      const {journalEntry, mealIndex} = section;
      return (
        <Button
          title="Add Item"
          onPress={() => onAddItem(journalEntry._id, mealIndex)}
        />
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
      ItemSeparatorComponent={Spacer}
      stickySectionHeadersEnabled={false}
      initialNumToRender={40}
    />
  );
};

export default JouranlEntryList;
