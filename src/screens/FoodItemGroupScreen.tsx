import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import ConsumedFoodItem from 'components/ConsumedFoodItem';
import LookupFoodItem from 'components/LookupFoodItem';
import Spacer from 'components/Spacer';
import {FOOD_ITEM_DESCRIPTION, ITEM_CONSUMED} from 'navigation/Constants';
import {FoodItemGroupNavigationProp} from 'navigation/RouteTypes';
import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import FoodItem from 'schemas/FoodItem';
import styles from 'styles';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';

const FoodItemGroupScreen = () => {
  const navigation = useNavigation<FoodItemGroupNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {foodGroupData, updateDescription, saveFoodGroup} =
    useFoodGroupContext();

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

  const onSave = React.useCallback(() => {
    saveFoodGroup();
    foodCrudNavigation.goBack();
  }, [foodCrudNavigation, saveFoodGroup]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={onSave} />,
    });
  }, [navigation, onSave]);

  return (
    <View style={styles.screen}>
      <Text>{`${foodGroupData?._id ? 'Edit' : 'New'} Item Group`}</Text>
      <Spacer />
      <BaseTextInput
        label="Description"
        placeholder="New group description..."
        value={foodGroupData?.description || ''}
        onChangeText={updateDescription}
      />
      <Spacer />
      <LookupFoodItem
        addNewFoodItem={addNewFoodItem}
        selectFoodItem={selectFoodItem}
      />
      {foodGroupData?.foodItems.map((item, idx) => (
        <ConsumedFoodItem key={`consumedItem-${idx}`} initItem={item} />
      ))}
    </View>
  );
};

export default FoodItemGroupScreen;
