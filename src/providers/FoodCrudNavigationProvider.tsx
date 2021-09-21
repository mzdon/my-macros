import React from 'react';

import {NavigatorScreenParams} from '@react-navigation/native';
import {StackNavigationOptions} from '@react-navigation/stack';

import {
  DrawerNavigationProp,
  FoodCrudStackParamList,
  FoodCrudScreenNavigationProp,
  PrivateStackParamList,
} from 'navigation/RouteTypes';
import {FOOD_CRUD} from 'navigation/Constants';
import {RecoverableError} from 'utils/Errors';

export type Screen = NavigatorScreenParams<FoodCrudStackParamList>['screen'];
export type Params = Partial<PrivateStackParamList['FoodCrud']>;

interface FoodCrudNavigationContextValue {
  navigate: (screen: Screen, params?: Params) => void;
  setOptions: (options: StackNavigationOptions) => void;
  goBack: () => void;
}

const FoodCrudNavigationContext =
  React.createContext<FoodCrudNavigationContextValue | null>(null);

type Props = React.PropsWithChildren<{
  navigation: DrawerNavigationProp | FoodCrudScreenNavigationProp;
}>;

const FoodCrudNavigationProvider = ({
  navigation,
  children,
}: Props): React.ReactElement<Props> => {
  const navigate = React.useCallback(
    (screen: Screen, params: Params = {}) => {
      const navState = navigation.getState();
      if (!navState) {
        throw new RecoverableError(
          'No navigation state found on private stack navigator',
        );
      }
      const foodCrudRoute = navState.routes.find(
        route => route.name === FOOD_CRUD,
      );
      const newParams = {
        ...(foodCrudRoute?.params || {}),
        ...params,
        screen,
      };
      // @ts-ignore
      navigation.navigate(FOOD_CRUD, newParams);
    },
    [navigation],
  );
  return (
    <FoodCrudNavigationContext.Provider
      value={{
        navigate,
        setOptions: navigation.setOptions,
        goBack: navigation.goBack,
      }}>
      {children}
    </FoodCrudNavigationContext.Provider>
  );
};

export default FoodCrudNavigationProvider;

export const useFoodCrudNavigationContext =
  (): FoodCrudNavigationContextValue => {
    const foodCrudNavigationContextValue = React.useContext(
      FoodCrudNavigationContext,
    );
    if (foodCrudNavigationContextValue === null) {
      throw new Error(
        'No FoodCrudNavigationContext value found. Was useFoodCrudNavigationContext() called outside of a FoodCrudNavigationProvider?',
      );
    }
    return foodCrudNavigationContextValue;
  };
