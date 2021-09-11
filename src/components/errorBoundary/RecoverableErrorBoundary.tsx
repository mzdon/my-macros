import React from 'react';

import {Text} from 'react-native';

import styles from 'styles';

type Props = React.PropsWithChildren<{error?: Error}>;

const RecoverableErrorBoundary = ({
  error,
  children,
}: Props): React.ReactElement<Props> => (
  <>
    {!!error && <Text style={styles.error}>{error.message}</Text>}
    {children}
  </>
);

export default RecoverableErrorBoundary;
