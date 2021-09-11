import React from 'react';

import ErrorBoundary from 'components/errorBoundary/ErrorBoundary';

export const withScreenEnhancers = <P extends Object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};
