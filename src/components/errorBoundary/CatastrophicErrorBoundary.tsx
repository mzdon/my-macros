import React from 'react';

import {Button, Text, View} from 'react-native';

import styles from 'styles';

type Props = React.PropsWithChildren<{
  error?: Error;
  onReset: () => void;
}>;

const CatastrophicErrorBoundary = ({
  error,
  onReset,
  children,
}: Props): React.ReactElement<Props> => {
  if (error) {
    return (
      <View style={styles.screen}>
        <Text style={styles.error}>{error.message}</Text>
        <Button title="Reset" onPress={onReset} />
      </View>
    );
  }

  return <>{children}</>;
};

export default CatastrophicErrorBoundary;
