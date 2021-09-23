import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import {withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {DrawerParamList, DrawerNavigationProp} from 'navigation/RouteTypes';
import FoodCrudNavigationProvider from 'providers/FoodCrudNavigationProvider';
import DateSelectorScreen from 'screens/drawer/DateSelectorScreen';
import FoodJournalScreen from 'screens/drawer/FoodJournalScreen';
import FoodSelectorScreen from 'screens/drawer/FoodSelectorScreen';
import ProfileScreen from 'screens/drawer/ProfileScreen';

const DrawerNav = createDrawerNavigator<DrawerParamList>();

const Drawer = () => {
  const navigation = useNavigation<DrawerNavigationProp>();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          title="|||"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
      ),
    });
  });

  return (
    <FoodCrudNavigationProvider navigation={navigation}>
      <DrawerNav.Navigator
        screenOptions={{headerShown: false, swipeEnabled: false}}>
        <DrawerNav.Screen
          key="journal"
          name={NavConstants.JOURNAL}
          initialParams={{date: new Date().toDateString()}}
          component={withScreenEnhancers(FoodJournalScreen)}
        />
        <DrawerNav.Screen
          key="food-editor"
          name={NavConstants.FOOD_EDITOR}
          component={withScreenEnhancers(FoodSelectorScreen)}
        />
        <DrawerNav.Screen
          key="date-selector"
          name={NavConstants.DATE_SELECTOR}
          component={withScreenEnhancers(DateSelectorScreen)}
        />
        <DrawerNav.Screen
          key="profile"
          name={NavConstants.PROFILE}
          component={withScreenEnhancers(ProfileScreen)}
        />
      </DrawerNav.Navigator>
    </FoodCrudNavigationProvider>
  );
};

export default Drawer;
