import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/routers';
import {StackNavigationProp} from '@react-navigation/stack';

import {RecoverableError} from 'utils/Errors';

export const useParentNavigation = <
  CurrentNav extends StackNavigationProp<ParamListBase>,
  ParentNav extends StackNavigationProp<ParamListBase>,
>() => {
  const navigation = useNavigation<CurrentNav>();
  const stackNavigation = navigation.getParent<ParentNav>();
  return stackNavigation;
};

export const useNestedScreenNavigate = <
  Nav extends StackNavigationProp<ParamListBase>,
>(
  navigation: Nav | undefined,
  parentScreen: string,
) => {
  if (navigation === undefined) {
    throw new RecoverableError(
      'No navigation passed to useNestedScreenNavigate',
    );
  }
  return React.useCallback(
    (screen, params) => {
      const navState = navigation.getState();
      if (!navState) {
        throw new RecoverableError(
          'No navigation state found on private stack navigator',
        );
      }
      const foodCrudRoute = navState.routes.find(
        route => route.name === parentScreen,
      );
      const newParams = {
        ...(foodCrudRoute?.params || {}),
        ...params,
        screen,
      };
      navigation.navigate(parentScreen, newParams);
    },
    [navigation, parentScreen],
  );
};
