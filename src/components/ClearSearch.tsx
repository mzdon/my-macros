import React from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Text from 'components/Text';
import {pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -1,
    right: 0,
  },
  text: {
    paddingHorizontal: 8,
    fontSize: 20,
    color: pageLineColor,
  },
});

interface Props {
  onPress: React.Dispatch<React.SetStateAction<string>>;
}

const ClearSearch = ({onPress}: Props): React.ReactElement<Props> => {
  const clearSearch = React.useCallback(() => {
    onPress('');
  }, [onPress]);
  return (
    <View style={_styles.container}>
      <TouchableOpacity onPress={clearSearch}>
        <Text style={_styles.text}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClearSearch;
