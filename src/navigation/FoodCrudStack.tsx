import React from 'react';

import {useRoute} from '@react-navigation/core';
import {createStackNavigator} from '@react-navigation/stack';

import {withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {
  FoodCrudModalRouteProp,
  FoodCrudStackParamList,
} from 'navigation/RouteTypes';
import FoodGroupProvider, {
  useFoodGroupContext,
} from 'providers/FoodGroupProvider';
import FoodItemProvider from 'providers/FoodItemProvider';
import {useJournalContext} from 'providers/JournalProvider';
import FoodItemDescriptionScreen from 'screens/FoodItemDescriptionScreen';
import FoodItemGroupScreen from 'screens/FoodItemGroupScreen';
import FoodItemMacrosScreen from 'screens/FoodItemMacrosScreen';
import ItemConsumedScreen from 'screens/ItemConsumedScreen';
import LookupOrAddScreen from 'screens/LookupOrAddScreen';

const Stack = createStackNavigator<FoodCrudStackParamList>();

const FoodCrudStack = () => {
  const route = useRoute<FoodCrudModalRouteProp>();
  const {
    journalEntryId,
    mealIndex,
    consumedItemIndex,
    foodItemId,
    foodGroupId,
  } = route.params;

  const {saveConsumedFoodItem} = useFoodGroupContext();
  return (
    <FoodItemProvider
      journalEntryId={journalEntryId}
      mealIndex={mealIndex}
      consumedItemIndex={consumedItemIndex}
      foodItemId={foodItemId}
      foodGroupId={foodGroupId}
      saveConsumedFoodItem={saveConsumedFoodItem}>
      <Stack.Navigator>
        <Stack.Screen
          key="lookup-or-add"
          name={NavConstants.LOOKUP_OR_ADD}
          component={withScreenEnhancers(LookupOrAddScreen)}
        />
        <Stack.Screen
          key="food-item-description"
          name={NavConstants.FOOD_ITEM_DESCRIPTION}
          component={withScreenEnhancers(FoodItemDescriptionScreen)}
        />
        <Stack.Screen
          key="food-item-macros"
          name={NavConstants.FOOD_ITEM_MACROS}
          component={withScreenEnhancers(FoodItemMacrosScreen)}
        />
        <Stack.Screen
          key="food-item-group"
          name={NavConstants.FOOD_ITEM_GROUP}
          component={withScreenEnhancers(FoodItemGroupScreen)}
        />
        <Stack.Screen
          key="item-consumed"
          name={NavConstants.ITEM_CONSUMED}
          component={withScreenEnhancers(ItemConsumedScreen)}
        />
      </Stack.Navigator>
    </FoodItemProvider>
  );
};

const FoodCrudStack2 = () => {
  const route = useRoute<FoodCrudModalRouteProp>();
  const {journalEntryId, mealIndex, foodGroupId, newFoodGroup} = route.params;

  const {applyFoodItemGroup, saveConsumedFoodItem} = useJournalContext();
  return (
    <FoodGroupProvider
      newFoodGroup={!!newFoodGroup}
      journalEntryId={journalEntryId}
      mealIndex={mealIndex}
      foodGroupId={foodGroupId}
      applyFoodItemGroup={applyFoodItemGroup}
      saveConsumedFoodItem={saveConsumedFoodItem}>
      <FoodCrudStack />
    </FoodGroupProvider>
  );
};

export default FoodCrudStack2;
