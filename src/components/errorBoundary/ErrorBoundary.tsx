import React from 'react';

import {Text} from 'react-native';

import CatastrophicErrorBoundary from 'components/errorBoundary/CatastrophicErrorBoundary';
import RecoverableErrorBoundary from 'components/errorBoundary/RecoverableErrorBoundary';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import styles from 'styles';

type Props = React.PropsWithChildren<{}>;
interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
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

    let Component;
    if (error instanceof CatastrophicError) {
      Component = CatastrophicErrorBoundary;
    } else if (error instanceof RecoverableError) {
      Component = RecoverableErrorBoundary;
    }

    if (Component) {
      return <Component error={error}>{this.props.children}</Component>;
    }

    return (
      <>
        <Text style={styles.error}>{error.message}</Text>
      </>
    );
  }
}

export default ErrorBoundary;
