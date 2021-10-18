import React from 'react';

import {useNavigation} from '@react-navigation/native';

import LookupFoodItem from 'components/LookupFoodItem';
import LookupFoodItemGroup from 'components/LookupFoodItemGroup';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import {
  FOOD_CRUD,
  FOOD_ITEM_DESCRIPTION,
  FOOD_ITEM_GROUP,
  ITEM_CONSUMED,
} from 'navigation/Constants';
import {LookupOrAddNavigationProp} from 'navigation/RouteTypes';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {useNestedScreenNavigate, useParentNavigation} from 'utils/Navigation';

const LookupOrAddScreen = (): React.ReactElement => {
  const navigation = useNavigation<LookupOrAddNavigationProp>();
  const parentNavigation = useParentNavigation();
  const foodCrudNavigate = useNestedScreenNavigate(parentNavigation, FOOD_CRUD);
  const {applyFoodItemGroup} = useFoodGroupContext();

  const addNewFoodItem = React.useCallback(
    () => navigation.navigate(FOOD_ITEM_DESCRIPTION),
    [navigation],
  );
  const selectFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      foodCrudNavigate(ITEM_CONSUMED, {
        foodItemId: foodItem._id.toHexString(),
      });
    },
    [foodCrudNavigate],
  );
  const addNewFoodItemGroup = React.useCallback(() => {
    foodCrudNavigate(FOOD_ITEM_GROUP, {
      newFoodGroup: true,
    });
  }, [foodCrudNavigate]);
  const selectFoodItemGroup = React.useCallback(
    (foodItemGroup: FoodItemGroup) => {
      applyFoodItemGroup(foodItemGroup);
      navigation.goBack();
    },
    [applyFoodItemGroup, navigation],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Lookup Or Add',
    });
  });

  return (
    <ScreenWrapper>
      <Spacer />
      <LookupFoodItem
        addNewFoodItem={addNewFoodItem}
        selectFoodItem={selectFoodItem}
      />
      <Spacer />
      <LookupFoodItemGroup
        addNewFoodItemGroup={addNewFoodItemGroup}
        selectFoodItemGroup={selectFoodItemGroup}
      />
      <Spacer />
    </ScreenWrapper>
  );
};

export default LookupOrAddScreen;
