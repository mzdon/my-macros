import React from 'react';

import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Results} from 'realm';

import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {screenHeight} from 'styles';

const _styles = StyleSheet.create({
  outerConntainer: {
    zIndex: 1,
  },
  innerContainer: {
    position: 'absolute',
    width: '100%',
    maxHeight: screenHeight * 0.6,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: 'black',
  },
});

interface ResultProps {
  label: string;
  onPress: () => void;
}

const Result = ({
  label,
  onPress,
}: ResultProps): React.ReactElement<ResultProps> => {
  return (
    <Pressable onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
};

interface Props<T> {
  items: Results<T>;
  onPress: (item: T) => void;
}

function SearchResults<T extends FoodItem | FoodItemGroup>({
  items,
  onPress,
}: Props<T>): React.ReactElement<Props<T>> {
  const renderItem = ({item}: {item: T}) => {
    const pressCallback = () => {
      onPress(item);
    };
    return (
      <>
        <Result
          key={item._id.toHexString()}
          label={item.description}
          onPress={pressCallback}
        />
      </>
    );
  };

  return (
    <View style={_styles.outerConntainer}>
      <FlatList
        style={_styles.innerContainer}
        data={items}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No Results...</Text>}
        ItemSeparatorComponent={() => <View style={_styles.divider} />}
        keyExtractor={(item: T) => item._id.toHexString()}
      />
    </View>
  );
}

export default SearchResults;
