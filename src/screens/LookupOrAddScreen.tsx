import React from 'react';

import {useNavigation} from '@react-navigation/core';
import {Button, StyleSheet, View} from 'react-native';
import {RealmQuery} from 'react-realm-context';

import BaseTextInput from 'components/BaseTextInput';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import {FOOD_ITEM_DESCRIPTION, ITEM_CONSUMED} from 'navigation/Constants';
import {LookupOrAddNavigationProp} from 'navigation/RouteTypes';
import styles from 'styles';

const _styles = StyleSheet.create({
  buttonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
});

const LookupOrAddScreen = (): React.ReactElement => {
  const navigation = useNavigation<LookupOrAddNavigationProp>();

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
    () => navigation.navigate(FOOD_ITEM_DESCRIPTION),
    [navigation],
  );
  const selectFoodItem = React.useCallback(() => {
    navigation.navigate(ITEM_CONSUMED);
  }, [navigation]);
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
            <SearchResults items={results} onPress={selectFoodItem} />
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

export default LookupOrAddScreen;
