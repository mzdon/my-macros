import React from 'react';

import {Button, SectionList, StyleSheet, Text, View} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import Spacer from 'components/Spacer';
import SwipeableRow from 'components/SwipeableRow';
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
  title: string;
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
      title: meal.description,
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
          rightActions={[
            {
              color: 'purple',
              label: 'Edit',
              onPress: () =>
                onEditConsumedFoodItem(journalEntry._id, mealIndex, index),
            },
            {
              color: 'red',
              label: 'Delete',
              onPress: () => onDeleteConsumedFoodItem(item),
            },
          ]}>
          <View style={_styles.titleContainer}>
            <ConsumedFoodItem item={item} />
          </View>
        </SwipeableRow>
      );
    },
    [onDeleteConsumedFoodItem, onEditConsumedFoodItem],
  );

  const renderSectionHeader = React.useCallback(
    ({section: {title, meal, journalEntry, mealIndex}}: {section: Section}) => (
      <SwipeableRow
        rightActions={[
          {
            color: 'purple',
            label: 'Edit',
            onPress: () => onEditMeal(journalEntry.date, mealIndex),
          },
          {
            color: 'red',
            label: 'Delete',
            onPress: () => onDeleteMeal(meal),
          },
        ]}>
        <View style={_styles.titleContainer}>
          <Text style={_styles.title}>{title}</Text>
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
    />
  );
};

export default JouranlEntryList;
