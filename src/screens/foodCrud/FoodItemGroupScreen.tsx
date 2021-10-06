import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, FlatList, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import ConsumedFoodItem from 'components/ConsumedFoodItem';
import LookupFoodItem from 'components/LookupFoodItem';
import Spacer from 'components/Spacer';
import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import {FOOD_ITEM_DESCRIPTION, ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemGroupNavigationProp} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem from 'schemas/FoodItem';
import styles from 'styles';

const FoodItemGroupScreen = () => {
  const navigation = useNavigation<FoodItemGroupNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {
    foodGroupData,
    updateDescription,
    saveFoodGroup,
    removeFoodItemFromGroup,
  } = useFoodGroupContext();

  const {description = '', foodItems = []} = foodGroupData || {};
  const onUpdateDescription = React.useCallback(
    (val: string) => updateDescription(val),
    [updateDescription],
  );

  const addNewFoodItem = React.useCallback(
    () =>
      foodCrudNavigation.navigate(FOOD_ITEM_DESCRIPTION, {
        foodItemId: undefined,
      }),
    [foodCrudNavigation],
  );
  const selectFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      foodCrudNavigation.navigate(ITEM_CONSUMED, {
        foodItemId: foodItem._id.toHexString(),
      });
    },
    [foodCrudNavigation],
  );
  const editFoodItem = React.useCallback(
    (index: number) => {
      foodCrudNavigation.navigate(ITEM_CONSUMED, {
        consumedItemIndex: index,
      });
    },
    [foodCrudNavigation],
  );

  const onSave = React.useCallback(() => {
    saveFoodGroup();
    foodCrudNavigation.goBack();
  }, [foodCrudNavigation, saveFoodGroup]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={onSave} />,
    });
  }, [navigation, onSave]);

  const renderItem = React.useCallback(
    ({item, index}: {item: ConsumedFoodItemData; index: number}) => {
      return (
        <SwipeableRow
          rightActions={getEditAndDeleteActions({
            onEditPress: () => editFoodItem(index),
            onDeletePress: () => removeFoodItemFromGroup(index),
          })}>
          <ConsumedFoodItem item={item} />
        </SwipeableRow>
      );
    },
    [editFoodItem, removeFoodItemFromGroup],
  );

  return (
    <View style={styles.screen}>
      <Text>{`${foodGroupData?._id ? 'Edit' : 'New'} Item Group`}</Text>
      <Spacer />
      <BaseTextInput
        label="Description"
        placeholder="Group description..."
        value={description}
        onChangeText={onUpdateDescription}
      />
      <Spacer />
      <LookupFoodItem
        addNewFoodItem={addNewFoodItem}
        selectFoodItem={selectFoodItem}
      />
      <FlatList
        data={foodItems}
        ListHeaderComponent={<Text>Food Items</Text>}
        renderItem={renderItem}
        keyExtractor={(_item, idx) => `consumedItem-${idx}`}
      />
    </View>
  );
};

export default FoodItemGroupScreen;
