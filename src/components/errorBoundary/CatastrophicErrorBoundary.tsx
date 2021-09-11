import React from 'react';

import {Text} from 'react-native';

import styles from 'styles';

type Props = React.PropsWithChildren<{error?: Error}>;

const CatastrophicErrorBoundary = ({
  error,
  children,
}: Props): React.ReactElement<Props> => {
  if (error) {
    return (
      <>
        <Text style={styles.error}>{error.message}</Text>
      </>
    );
  }

  return <>{children}</>;
};

export default CatastrophicErrorBoundary;
