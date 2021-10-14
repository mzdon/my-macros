import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {pageHeaderStyle, withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {
  FoodCrudScreenRouteProp,
  FoodCrudScreenNavigationProp,
  FoodCrudStackParamList,
} from 'navigation/RouteTypes';
import FoodCrudNavigationProvider from 'providers/FoodCrudNavigationProvider';
import FoodGroupProvider from 'providers/FoodGroupProvider';
import FoodItemProvider from 'providers/FoodItemProvider';
import FoodItemDescriptionScreen from 'screens/foodCrud/FoodItemDescriptionScreen';
import FoodItemGroupScreen from 'screens/foodCrud/FoodItemGroupScreen';
import FoodItemMacrosScreen from 'screens/foodCrud/FoodItemMacrosScreen';
import ItemConsumedScreen from 'screens/foodCrud/ItemConsumedScreen';
import LookupOrAddScreen from 'screens/foodCrud/LookupOrAddScreen';

const Stack = createStackNavigator<FoodCrudStackParamList>();

const InnerFoodCrudStack = () => {
  const route = useRoute<FoodCrudScreenRouteProp>();
  const {journalEntryId, mealIndex, consumedItemIndex, foodItemId} =
    route.params;

  return (
    <FoodItemProvider
      journalEntryId={journalEntryId}
      mealIndex={mealIndex}
      consumedItemIndex={consumedItemIndex}
      foodItemId={foodItemId}>
      <Stack.Navigator screenOptions={{headerStyle: pageHeaderStyle}}>
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

const FoodCrudStack = () => {
  const navigation = useNavigation<FoodCrudScreenNavigationProp>();
  const route = useRoute<FoodCrudScreenRouteProp>();
  const {journalEntryId, mealIndex, foodGroupId, newFoodGroup} = route.params;

  return (
    <FoodCrudNavigationProvider navigation={navigation}>
      <FoodGroupProvider
        newFoodGroup={!!newFoodGroup}
        journalEntryId={journalEntryId}
        mealIndex={mealIndex}
        foodGroupId={foodGroupId}>
        <InnerFoodCrudStack />
      </FoodGroupProvider>
    </FoodCrudNavigationProvider>
  );
};

export default FoodCrudStack;
