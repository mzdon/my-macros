import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {withScreenEnhancers} from 'navigation/Common';
import * as NavConstants from 'navigation/Constants';
import {UserInfoStackParamList} from 'navigation/RouteTypes';
import UserInfoProvider from 'providers/UserInfoProvider';
import UserInfoStep1Screen from 'screens/userInfo/UserInfoStep1Screen';
import UserInfoStep2Screen from 'screens/userInfo/UserInfoStep2Screen';

const Stack = createStackNavigator<UserInfoStackParamList>();

const UserInfoStack = () => (
  <UserInfoProvider>
    <Stack.Navigator>
      <Stack.Screen
        key="user-info-step-1"
        name={NavConstants.USER_INFO_STEP_1}
        component={withScreenEnhancers(UserInfoStep1Screen)}
      />
      <Stack.Screen
        key="user-info-step-2"
        name={NavConstants.USER_INFO_STEP_2}
        component={withScreenEnhancers(UserInfoStep2Screen)}
      />
    </Stack.Navigator>
  </UserInfoProvider>
);

export default UserInfoStack;
