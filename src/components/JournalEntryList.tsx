import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {UUID} from 'bson';
import {Button, SectionList, StyleSheet, Text, View} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import Spacer from 'components/Spacer';
import SwipeableRow from 'components/SwipeableRow';
import {
  ADD_MEAL,
  FOOD_CRUD,
  ITEM_CONSUMED,
  LOOKUP_OR_ADD,
} from 'navigation/Constants';
import {JournalScreenNavigationProp} from 'navigation/RouteTypes';
import ConsumedFoodItemSchema from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import Meal from 'schemas/Meal';
import {useJournalContext} from 'providers/JournalProvider';
import {RecoverableError} from 'utils/Errors';

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

interface Props {
  journalEntry: JournalEntry | null;
  EmptyComponent: () => React.ReactElement;
}

type Section = {
  title: string;
  meal: Meal;
  mealIndex: number;
  journalEntryId: UUID;
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
      journalEntryId: journalEntry._id,
    });
    return nextResult;
  }, sections);
}

const JouranlEntryList = ({
  journalEntry,
  EmptyComponent,
}: Props): React.ReactElement<Props> => {
  const navigation = useNavigation<JournalScreenNavigationProp>();

  const {deleteConsumedFoodItem, deleteMeal} = useJournalContext();

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
      const {journalEntryId, mealIndex} = section;
      return (
        <SwipeableRow
          rightActions={[
            {
              color: 'purple',
              label: 'Edit',
              onPress: () =>
                navigation.navigate(FOOD_CRUD, {
                  screen: ITEM_CONSUMED,
                  journalEntryId: journalEntryId.toHexString(),
                  mealIndex,
                  itemIndex: index,
                }),
            },
            {
              color: 'red',
              label: 'Delete',
              onPress: () => deleteConsumedFoodItem(item),
            },
          ]}>
          <View style={_styles.titleContainer}>
            <ConsumedFoodItem item={item} />
          </View>
        </SwipeableRow>
      );
    },
    [deleteConsumedFoodItem, navigation],
  );

  const renderSectionHeader = React.useCallback(
    ({section: {title, meal, mealIndex}}: {section: Section}) => (
      <SwipeableRow
        rightActions={[
          {
            color: 'purple',
            label: 'Edit',
            onPress: () => {
              if (!journalEntry) {
                throw new RecoverableError(
                  'No journal entry found in JournalEntryList',
                );
              }
              navigation.navigate(ADD_MEAL, {
                date: journalEntry.date.toDateString(),
                mealIndex,
              });
            },
          },
          {
            color: 'red',
            label: 'Delete',
            onPress: () => deleteMeal(meal),
          },
        ]}>
        <View style={_styles.titleContainer}>
          <Text style={_styles.title}>{title}</Text>
        </View>
      </SwipeableRow>
    ),
    [deleteMeal, journalEntry, navigation],
  );

  const renderSectionFooter = React.useCallback(
    ({section}: {section: Section}) => {
      const {journalEntryId, mealIndex} = section;
      return (
        <Button
          title="Add Item"
          onPress={() =>
            navigation.navigate(FOOD_CRUD, {
              screen: LOOKUP_OR_ADD,
              journalEntryId: journalEntryId.toHexString(),
              mealIndex,
            })
          }
        />
      );
    },
    [navigation],
  );

  return (
    <SectionList
      sections={formatSections(journalEntry)}
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
