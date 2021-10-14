import React from 'react';

import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {Results} from 'realm';

import Text from 'components/Text';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {defaultPadding, screenHeight} from 'styles';

const _styles = StyleSheet.create({
  outerConntainer: {
    zIndex: 1,
    shadowColor: 'grey',
    shadowOffset: {
      height: 3,
      width: 3,
    },
    shadowOpacity: 0.5,
  },
  innerContainer: {
    position: 'absolute',
    width: '100%',
    maxHeight: screenHeight * 0.6,
    borderWidth: 1,
    backgroundColor: '#FFFF99',
    borderColor: '#FFFF99',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: 'black',
  },
  item: {
    padding: defaultPadding * 0.33,
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
      <Text style={_styles.item}>{label}</Text>
    </Pressable>
  );
};

interface Props<T> {
  items: Results<T> | null;
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
