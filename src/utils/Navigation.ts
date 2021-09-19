import React from 'react';

import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';

import {FOOD_CRUD} from 'navigation/Constants';
import {
  FoodCrudStackParamList,
  PrivateStackParamList,
} from 'navigation/RouteTypes';

export const useUpdateFoodCrudRoute = (
  navigation: NavigationProp<FoodCrudStackParamList>,
) => {
  return React.useCallback(
    (
      routeName: keyof FoodCrudStackParamList,
      params: Partial<PrivateStackParamList['FoodCrud']> = {},
    ) => {
      const state = navigation.getState();
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
          const newRoutes = [...state.routes, {name: routeName}];
          const newFoodCrudRoute = {
            ...foodCrudRoute,
            params: {
              ...foodCrudRoute.params,
              ...params,
              screen: routeName,
            },
            state: {
              ...foodCrudRoute.state,
              index: newRoutes.length - 1,
              routes: newRoutes,
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
};

export const useParentNavigation = () => {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent();
  return stackNavigation;
};
