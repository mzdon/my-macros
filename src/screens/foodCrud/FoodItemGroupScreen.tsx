import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, FlatList, Text} from 'react-native';

import ConsumedFoodItem from 'components/ConsumedFoodItem';
import LookupFoodItem from 'components/LookupFoodItem';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import TextInput from 'components/TextInput';
import {
  FOOD_CRUD,
  FOOD_ITEM_DESCRIPTION,
  ITEM_CONSUMED,
} from 'navigation/Constants';
import {FoodItemGroupNavigationProp} from 'navigation/RouteTypes';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem from 'schemas/FoodItem';
import styles from 'styles';
import {
  isValidRequiredString,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';
import {useNestedScreenNavigate, useParentNavigation} from 'utils/Navigation';

const FoodItemGroupScreen = () => {
  const navigation = useNavigation<FoodItemGroupNavigationProp>();
  const parentNavigation = useParentNavigation();
  const foodCrudNavigate = useNestedScreenNavigate(parentNavigation, FOOD_CRUD);

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

  const [internalError, setInternalError] = React.useState('');

  const addNewFoodItem = React.useCallback(() => {
    if (internalError) {
      setInternalError('');
    }
    foodCrudNavigate(FOOD_ITEM_DESCRIPTION, {
      foodItemId: undefined,
    });
  }, [foodCrudNavigate, internalError]);
  const selectFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      foodCrudNavigate(ITEM_CONSUMED, {
        foodItemId: foodItem._id.toHexString(),
      });
    },
    [foodCrudNavigate],
  );
  const editFoodItem = React.useCallback(
    (index: number) => {
      foodCrudNavigate(ITEM_CONSUMED, {
        consumedItemIndex: index,
      });
    },
    [foodCrudNavigate],
  );

  const onSave = React.useCallback(() => {
    if (!foodGroupData?.foodItems.length) {
      setInternalError('Please add some food items first!');
      return;
    }
    saveFoodGroup();
    parentNavigation.goBack();
  }, [parentNavigation, foodGroupData?.foodItems.length, saveFoodGroup]);

  const fieldValidators = React.useMemo(
    () => ({
      description: {
        isValid: isValidRequiredString,
        message: requiredErrorMessage('Description'),
        value: description,
        onChange: onUpdateDescription,
      },
    }),
    [description, onUpdateDescription],
  );

  const before = React.useMemo(
    () => ({
      onSave,
    }),
    [onSave],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Save" onPress={validateBefore.onSave} />
      ),
    });
  }, [navigation, validateBefore.onSave]);

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
    <ScreenWrapper>
      <Text>{`${foodGroupData?._id ? 'Edit' : 'New'} Item Group`}</Text>
      <Spacer />
      <TextInput
        label="Description"
        placeholder="Group description..."
        value={description}
        onChangeText={onChange.description}
        error={errors.description}
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
      <Spacer />
      {!!internalError && <Text style={styles.error}>{internalError}</Text>}
    </ScreenWrapper>
  );
};

export default FoodItemGroupScreen;
