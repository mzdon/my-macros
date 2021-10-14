import React from 'react';

import CatastrophicErrorBoundary from 'components/errorBoundary/CatastrophicErrorBoundary';
import RecoverableErrorBoundary from 'components/errorBoundary/RecoverableErrorBoundary';
import {JustChildrenProps} from 'types/Common';
import {RecoverableError} from 'utils/Errors';

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<JustChildrenProps, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    const {error} = this.state;

    if (!error) {
      return this.props.children;
    }

    if (error instanceof RecoverableError) {
      return (
        <RecoverableErrorBoundary error={error}>
          {this.props.children}
        </RecoverableErrorBoundary>
      );
    }

    return (
      <CatastrophicErrorBoundary
        error={error}
        onReset={() => this.setState({error: null})}>
        {this.props.children}
      </CatastrophicErrorBoundary>
    );
  }
}

export default ErrorBoundary;
