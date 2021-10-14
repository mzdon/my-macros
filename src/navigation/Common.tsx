import React from 'react';

import ErrorBoundary from 'components/errorBoundary/ErrorBoundary';
import {backgroundColor, pageLineColor} from 'styles';
import {StackHeaderOptions} from '@react-navigation/stack/lib/typescript/src/types';

export const withScreenEnhancers = <P extends Object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export const pageHeaderStyle: StackHeaderOptions['headerStyle'] = {
  backgroundColor: backgroundColor,
  borderBottomWidth: 2,
  borderBottomColor: pageLineColor,
};
