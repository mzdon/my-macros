import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';

import LookupFoodItem from 'components/LookupFoodItem';
import LookupFoodItemGroup from 'components/LookupFoodItemGroup';
import Spacer from 'components/Spacer';
import {
  FOOD_ITEM_DESCRIPTION,
  FOOD_ITEM_GROUP,
  ITEM_CONSUMED,
} from 'navigation/Constants';
import {LookupOrAddNavigationProp} from 'navigation/RouteTypes';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import styles from 'styles';
import {useUpdateFoodCrudRoute} from 'utils/Navigation';

const LookupOrAddScreen = (): React.ReactElement => {
  const navigation = useNavigation<LookupOrAddNavigationProp>();
  const updateFoodCrudRoute = useUpdateFoodCrudRoute(navigation);
  const {applyFoodItemGroup} = useFoodGroupContext();

  const addNewFoodItem = React.useCallback(
    () => updateFoodCrudRoute(FOOD_ITEM_DESCRIPTION),
    [updateFoodCrudRoute],
  );
  const selectFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      updateFoodCrudRoute(ITEM_CONSUMED, {
        foodItemId: foodItem._id.toHexString(),
      });
    },
    [updateFoodCrudRoute],
  );
  const addNewFoodItemGroup = React.useCallback(() => {
    updateFoodCrudRoute(FOOD_ITEM_GROUP, {
      newFoodGroup: true,
    });
  }, [updateFoodCrudRoute]);
  const selectFoodItemGroup = React.useCallback(
    (foodItemGroup: FoodItemGroup) => {
      applyFoodItemGroup(foodItemGroup);
      navigation.goBack();
    },
    [applyFoodItemGroup, navigation],
  );

  return (
    <View style={styles.screen}>
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
    </View>
  );
};

export default LookupOrAddScreen;
