import React from 'react';

import {Button, StyleSheet, View} from 'react-native';
import {RealmQuery} from 'react-realm-context';

import BaseTextInput from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import SearchResults from 'modals/addFoodItemModal/SearchResults';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import styles from 'styles';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

interface Props {
  addFoodItem: (item: FoodItemData) => void;
  setFoodItem: (item: FoodItem) => void;
  // addFoodItemGroup: (group: FoodItemGroupData) => void;
  // setFoodItemGroup: (group: FoodItemGroup) => void;
}

const LookupOrAdd = ({
  addFoodItem,
  setFoodItem,
}: Props): React.ReactElement<Props> => {
  const [state, setState] = React.useState({
    foodSearch: '',
    groupSearch: '',
  });
  const updateFoodSearch = React.useCallback(
    (val: string) => {
      setState({
        ...state,
        foodSearch: val,
      });
    },
    [state, setState],
  );
  // const updateGroupSearch = React.useCallback(
  //   (val: string) => {
  //     setState({
  //       ...state,
  //       groupSearch: val,
  //     });
  //   },
  //   [state, setState],
  // );

  const addNewFoodItem = React.useCallback(
    () => addFoodItem(FoodItem.generate()),
    [addFoodItem],
  );
  // const addNewFoodItemGroup = React.useCallback(
  //   () => addFoodItemGroup(new FoodItemGroup({})),
  //   [addFoodItemGroup],
  // );

  // const setExistingFoodItemGroup = React.useCallback(
  //   (foodItemGroup: FoodItemGroup) => addFoodItemGroup(foodItemGroup),
  //   [addFoodItemGroup],
  // );

  const foodFilter = `description CONTAINS[c] "${state.foodSearch}"`;
  // const groupFilter = `description CONTAINS[c] "${state.groupSearch}"`;

  return (
    <View style={styles.screen}>
      <BaseTextInput
        placeholder="Lookup Food Item..."
        value={state.foodSearch}
        onChangeText={updateFoodSearch}
      />
      {!!state.foodSearch && (
        <RealmQuery type="FoodItem" filter={foodFilter} sort="description">
          {({results}) => (
            <SearchResults items={results} onPress={setFoodItem} />
          )}
        </RealmQuery>
      )}
      <Spacer />
      {/* <BaseTextInput
        placeholder="Lookup Food Item Group..."
        value={state.groupSearch}
        onChangeText={updateGroupSearch}
      />
      {!!state.groupSearch && (
        <RealmQuery
          type="FoodItemGroup"
          filter={groupFilter}
          sort="description">
          {({results}) => (
            <SearchResults items={results} onPress={setExistingFoodItemGroup} />
          )}
        </RealmQuery>
      )}
      <Spacer /> */}
      <View style={_styles.buttonContainer}>
        <Button title="New Food Item" onPress={addNewFoodItem} />
        {/* <Button title="New Food Item Group" onPress={addNewFoodItemGroup} /> */}
      </View>
    </View>
  );
};

export default LookupOrAdd;
