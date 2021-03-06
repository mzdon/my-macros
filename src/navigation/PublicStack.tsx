import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {withScreenEnhancers} from 'navigation/Common';
import {WELCOME} from 'navigation/Constants';
import {PublicStackParamList} from 'navigation/RouteTypes';
import WelcomeScreen from 'screens/public/WelcomeScreen';

const Stack = createStackNavigator<PublicStackParamList>();

const PublicStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        key="welcome"
        name={WELCOME}
        component={withScreenEnhancers(WelcomeScreen)}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default PublicStack;
