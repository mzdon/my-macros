import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {UUID} from 'bson';
import {Button, SectionList, Text} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import Spacer from 'components/Spacer';
import {ADD_FOOD_ITEM} from 'navigation/Constants';
import {JournalScreenNavigationProp} from 'navigation/RouteTypes';
import ConsumedFoodItemSchema from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';

interface Props {
  journalEntry: JournalEntry | null;
  EmptyComponent: () => React.ReactElement;
}

type Section = {
  title: string;
  journalEntryId: UUID;
  order: number;
  data: ConsumedFoodItemSchema[];
};
function formatSections(journalEntry: JournalEntry | null): Section[] {
  if (!journalEntry) {
    return [];
  }
  const sections: Section[] = [];
  return journalEntry.meals.reduce((result, meal) => {
    const nextResult = [...result];
    nextResult.push({
      title: meal.description,
      journalEntryId: journalEntry._id,
      order: meal.order,
      data: meal.items,
    });
    return nextResult;
  }, sections);
}

const renderSectionHeader = ({section: {title}}: {section: Section}) => (
  <Text>{title}</Text>
);

const renderItem = ({item}: {item: ConsumedFoodItemSchema}) => (
  <ConsumedFoodItem item={item} />
);

const JouranlEntryList = ({
  journalEntry,
  EmptyComponent,
}: Props): React.ReactElement<Props> => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  const renderSectionFooter = React.useCallback(
    ({section}: {section: Section}) => {
      const {journalEntryId, order} = section;
      return (
        <Button
          title="Add Item"
          onPress={() =>
            navigation.navigate(ADD_FOOD_ITEM, {
              journalEntryId: journalEntryId.toHexString(),
              mealIndex: order,
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
