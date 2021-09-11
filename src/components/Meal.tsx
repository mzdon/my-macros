import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {UUID} from 'bson';
import {Button, StyleSheet, Text, View} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import {ADD_FOOD_ITEM} from 'navigation/Constants';
import {JournalScreenNavigationProp} from 'navigation/RouteTypes';
import Meal from 'schemas/Meal';
import {defaultPadding} from 'styles';

const _styles = StyleSheet.create({
  container: {paddingHorizontal: defaultPadding},
});

interface Props {
  journalEntryId: UUID;
  meal: Meal;
}

const MealComponent = ({
  journalEntryId,
  meal,
}: Props): React.ReactElement<Props> => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  return (
    <View style={_styles.container}>
      <Text>{meal.description}</Text>
      {meal.items.map((item, i) => (
        <ConsumedFoodItem key={`item-${i}`} item={item} />
      ))}
      <Button
        title="Add Item"
        onPress={() =>
          navigation.navigate(ADD_FOOD_ITEM, {
            journalEntryId: journalEntryId.toHexString(),
            mealIndex: meal.order,
          })
        }
      />
    </View>
  );
};

export default MealComponent;
