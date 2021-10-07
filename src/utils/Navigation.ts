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

export const useSetFoodCrudNavigationOptions = (
  navigation: StackNavigationProp<DrawerParamList>,
  foodCrudNavigation: {setOptions: FoodCrudScreenNavigationProp['setOptions']},
  options: StackNavigationOptions,
) => {
  React.useLayoutEffect(() => {
    return navigation.addListener('focus', () => {
      foodCrudNavigation.setOptions({
        headerRight: undefined,
        ...options,
      });
    });
  }, [foodCrudNavigation, navigation, options]);
};
