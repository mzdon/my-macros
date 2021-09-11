import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import PrivateStack from 'navigation/PrivateStack';
import PublicStack from 'navigation/PublicStack';
import {useAuthContext} from 'providers/AuthProvider';

const RootNavigator = () => {
  const {realmUser} = useAuthContext();
  return (
    <NavigationContainer>
      {realmUser === null ? <PublicStack /> : <PrivateStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
