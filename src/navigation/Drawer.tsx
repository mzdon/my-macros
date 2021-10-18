import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import {pageHeaderStyle, withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {DrawerParamList} from 'navigation/RouteTypes';
import FoodJournalScreen from 'screens/drawer/FoodJournalScreen';
import FoodSelectorScreen from 'screens/drawer/FoodSelectorScreen';
import ProfileScreen from 'screens/drawer/ProfileScreen';
import {today} from 'utils/Date';

const DrawerNav = createDrawerNavigator<DrawerParamList>();

const Drawer = () => (
  <DrawerNav.Navigator
    screenOptions={{swipeEnabled: false, headerStyle: pageHeaderStyle}}>
    <DrawerNav.Screen
      key="journal"
      name={NavConstants.JOURNAL}
      initialParams={{date: today().getTime()}}
      component={withScreenEnhancers(FoodJournalScreen)}
      options={{title: 'Journal'}}
    />
    <DrawerNav.Screen
      key="food-editor"
      name={NavConstants.FOOD_EDITOR}
      component={withScreenEnhancers(FoodSelectorScreen)}
      options={{title: 'Food Editor'}}
    />
    <DrawerNav.Screen
      key="profile"
      name={NavConstants.PROFILE}
      component={withScreenEnhancers(ProfileScreen)}
      options={{title: 'Profile'}}
    />
  </DrawerNav.Navigator>
);

export default Drawer;
