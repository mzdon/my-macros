import React from 'react';

import 'react-native-gesture-handler';
import {UIManager} from 'react-native';

import ErrorBoundary from 'components/errorBoundary/ErrorBoundary';
import RootNavigator from 'navigation/RootNavigator';
import AuthProvider from 'providers/AuthProvider';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
