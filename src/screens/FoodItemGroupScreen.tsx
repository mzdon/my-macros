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
import {useUpdateFoodCrudRoute} from 'utils/Navigation';

const FoodItemGroupScreen = () => {
  const navigation = useNavigation<FoodItemGroupNavigationProp>();
  const updateFoodCrudRoute = useUpdateFoodCrudRoute(navigation);

  const {foodGroupData, saveFoodGroup} = useFoodGroupContext();

  const [description, updateDescription] = React.useState(
    foodGroupData?.description || '',
  );

  const addNewFoodItem = React.useCallback(
    () =>
      updateFoodCrudRoute(FOOD_ITEM_DESCRIPTION, {
        foodItemId: undefined,
      }),
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

  const onSave = React.useCallback(() => {
    saveFoodGroup(description);
  }, [description, saveFoodGroup]);

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
        value={description}
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
