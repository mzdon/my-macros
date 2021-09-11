import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import AddFoodItemModal from 'modals/addFoodItemModal/AddFoodItemModal';
import AddMealModal from 'modals/AddMealModal';
import {withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {PrivateStackParamList} from 'navigation/RouteTypes';
import JournalProvider from 'providers/JournalProvider';
import RealmProvider from 'providers/RealmProvider';
import UserProvider, {useUserContext} from 'providers/UserProvider';
import User from 'schemas/User';
import DateSelectorScreen from 'screens/DateSelectorScreen';
import FoodJournalScreen from 'screens/FoodJournalScreen';
import ProfileScreen from 'screens/ProfileScreen';
import UserInfoScreen from 'screens/userInfo/UserInfoScreen';

const getInitialRouteName = (user: User | undefined) => {
  if (user && !user.hasRequiredData()) {
    return NavConstants.USER_INFO;
  }
};

const Stack = createStackNavigator<PrivateStackParamList>();

const PrivateStack = () => {
  const {user} = useUserContext();
  return (
    <Stack.Navigator initialRouteName={getInitialRouteName(user)}>
      <Stack.Group>
        <Stack.Screen
          key="journal"
          name={NavConstants.JOURNAL}
          initialParams={{date: new Date().toDateString()}}
          component={withScreenEnhancers(FoodJournalScreen)}
        />
        <Stack.Screen
          key="date-selector"
          name={NavConstants.DATE_SELECTOR}
          component={withScreenEnhancers(DateSelectorScreen)}
        />
        <Stack.Screen
          key="profile"
          name={NavConstants.PROFILE}
          component={withScreenEnhancers(ProfileScreen)}
        />
        <Stack.Screen
          key="user-info"
          name={NavConstants.USER_INFO}
          component={withScreenEnhancers(UserInfoScreen)}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen
          key="add-meal"
          name={NavConstants.ADD_MEAL}
          component={withScreenEnhancers(AddMealModal)}
        />
        <Stack.Screen
          key="add-food-item"
          name={NavConstants.ADD_FOOD_ITEM}
          component={withScreenEnhancers(AddFoodItemModal)}
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
