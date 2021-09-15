import React from 'react';

import {CommonActions, useNavigation} from '@react-navigation/native';
import {Button, StyleSheet, View} from 'react-native';
import {RealmQuery} from 'react-realm-context';

import BaseTextInput from 'components/BaseTextInput';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import {
  FOOD_CRUD,
  FOOD_ITEM_DESCRIPTION,
  ITEM_CONSUMED,
  LOOKUP_OR_ADD,
} from 'navigation/Constants';
import {LookupOrAddNavigationProp} from 'navigation/RouteTypes';
import FoodItem from 'schemas/FoodItem';
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
  const selectFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.dispatch(navState => {
          const foodCrudRouteIndex = navState.routes.findIndex(
            route => route.name === FOOD_CRUD,
          );
          if (foodCrudRouteIndex === -1) {
            console.log('No food crud route');
            return {type: 'noop'};
          }

          const foodCrudRoute = navState.routes[foodCrudRouteIndex];
          const newFoodCrudRoute = {
            ...foodCrudRoute,
            params: {
              ...foodCrudRoute.params,
              screen: ITEM_CONSUMED,
              foodItemId: foodItem._id.toHexString(),
            },
            state: {
              ...foodCrudRoute.state,
              index: 1,
              routes: [{name: LOOKUP_OR_ADD}, {name: ITEM_CONSUMED}],
            },
          };

          const newState = {
            ...navState,
            routes: [
              ...navState.routes.slice(0, foodCrudRouteIndex),
              newFoodCrudRoute,
              ...navState.routes.slice(foodCrudRouteIndex + 1),
            ],
          };

          return CommonActions.reset(newState);
        });
      }
    },
    [navigation],
  );
  // const addNewFoodItemGroup = React.useCallback(
  //   () => navigation.navigate(FOOD_ITEM_GROUP_DESCRIPTION),
  //   [navigation],
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
