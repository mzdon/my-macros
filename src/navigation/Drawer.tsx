import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import {withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {DrawerParamList, DrawerNavigationProp} from 'navigation/RouteTypes';
import FoodCrudNavigationProvider from 'providers/FoodCrudNavigationProvider';
import FoodJournalScreen from 'screens/drawer/FoodJournalScreen';
import FoodSelectorScreen from 'screens/drawer/FoodSelectorScreen';
import ProfileScreen from 'screens/drawer/ProfileScreen';
import {today} from 'utils/Date';

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
          initialParams={{date: today().getTime()}}
          component={withScreenEnhancers(FoodJournalScreen)}
          options={{title: 'Journal'}}
        />
        <DrawerNav.Screen
          key="food-editor"
          name={NavConstants.FOOD_EDITOR}
          component={withScreenEnhancers(FoodSelectorScreen)}
          options={{title: 'Food Editor'}}
          listeners={{
            focus: e => {
              console.log(e);
              navigation.setOptions({
                headerTitle: 'Food Editor',
                headerRight: undefined,
              });
            },
          }}
        />
        <DrawerNav.Screen
          key="profile"
          name={NavConstants.PROFILE}
          component={withScreenEnhancers(ProfileScreen)}
          options={{title: 'Profile'}}
          listeners={{
            focus: e => {
              console.log(e);
              navigation.setOptions({
                headerTitle: 'Profile',
                headerRight: undefined,
              });
            },
          }}
        />
      </DrawerNav.Navigator>
    </FoodCrudNavigationProvider>
  );
};

export default Drawer;
