import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {pageHeaderStyle, withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import Drawer from 'navigation/Drawer';
import FoodCrudStack from 'navigation/FoodCrudStack';
import UserInfoStack from 'navigation/UserInfoStack';
import {PrivateStackParamList} from 'navigation/RouteTypes';
import JournalProvider from 'providers/JournalProvider';
import RealmProvider from 'providers/RealmProvider';
import UserProvider, {useUserContext} from 'providers/UserProvider';
import User from 'schemas/User';
import AddMealScreen from 'screens/private/AddMealScreen';

const getInitialRouteName = (user: User | undefined) => {
  if (user && !user.hasRequiredData()) {
    return NavConstants.USER_INFO;
  }
};

const Stack = createStackNavigator<PrivateStackParamList>();

const PrivateStack = () => {
  const {user} = useUserContext();
  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName(user)}
      screenOptions={{headerStyle: pageHeaderStyle}}>
      <Stack.Group>
        <Stack.Screen
          key="drawer"
          name={NavConstants.DRAWER}
          component={Drawer}
        />
        <Stack.Screen
          key="user-info"
          name={NavConstants.USER_INFO}
          component={UserInfoStack}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen
          key="add-meal"
          name={NavConstants.ADD_MEAL}
          component={withScreenEnhancers(AddMealScreen)}
        />
        <Stack.Screen
          key="food-crud"
          name={NavConstants.FOOD_CRUD}
          component={FoodCrudStack}
          options={{headerShown: false}}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default () => (
  <RealmProvider>
    <UserProvider>
      <JournalProvider>
        <PrivateStack />
      </JournalProvider>
    </UserProvider>
  </RealmProvider>
);
