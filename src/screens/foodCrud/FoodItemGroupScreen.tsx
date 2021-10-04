import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, FlatList, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import ConsumedFoodItem from 'components/ConsumedFoodItem';
import LookupFoodItem from 'components/LookupFoodItem';
import Spacer from 'components/Spacer';
import SwipeableRow, {
  getDeleteAction,
  getEditAndDeleteActions,
} from 'components/SwipeableRow';
import {FOOD_ITEM_DESCRIPTION, ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemGroupNavigationProp} from 'navigation/RouteTypes';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {InitConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
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

  const {
    description = '',
    foodItems = [],
    nonEditableFoodItems = [],
  } = foodGroupData || {};
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
    (consumedItem: InitConsumedFoodItemData, index: number) => {
      foodCrudNavigation.navigate(ITEM_CONSUMED, {
        foodItemId: consumedItem.item._id?.toHexString(),
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
    ({item}) => {
      return (
        <SwipeableRow
          rightActions={getEditAndDeleteActions({
            onEditPress: () => editFoodItem(item, item.index),
            onDeletePress: () => removeFoodItemFromGroup(item.index),
          })}>
          <ConsumedFoodItem initItem={item} />
        </SwipeableRow>
      );
    },
    [editFoodItem, removeFoodItemFromGroup],
  );

  const renderNonEditableItem = React.useCallback(
    ({item}) => {
      return (
        <SwipeableRow
          rightActions={[
            getDeleteAction(() => removeFoodItemFromGroup(item.index)),
          ]}>
          <ConsumedFoodItem item={item} />
        </SwipeableRow>
      );
    },
    [removeFoodItemFromGroup],
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
      {!!nonEditableFoodItems.length && (
        <FlatList
          data={nonEditableFoodItems}
          ListHeaderComponent={<Text>Non-Editable Food Items</Text>}
          renderItem={renderNonEditableItem}
          keyExtractor={(_item, idx) => `nonEditableConsumedItem-${idx}`}
        />
      )}
    </View>
  );
};

export default FoodItemGroupScreen;
