import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';

import {
  DrawerParamList,
  FoodCrudScreenNavigationProp,
} from 'navigation/RouteTypes';

export const useParentNavigation = () => {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent();
  return stackNavigation;
};

export const useSetFoodCrudNavigationOptionsOnFocus = (
  navigation: StackNavigationProp<DrawerParamList>,
  foodCrudNavigation: {setOptions: FoodCrudScreenNavigationProp['setOptions']},
  options: StackNavigationOptions,
) => {
  React.useLayoutEffect(() => {
    const setOptions = () =>
      foodCrudNavigation.setOptions({
        headerRight: undefined,
        ...options,
      });
    setOptions();
    return navigation.addListener('focus', () => setOptions);
  }, [foodCrudNavigation, navigation, options]);
};
