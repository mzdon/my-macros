import React from 'react';

import {SectionList, StyleSheet, Text, View} from 'react-native';
import {withRealm} from 'react-realm-context';
import Realm from 'realm';

import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import {FOOD_ITEM_DESCRIPTION, FOOD_ITEM_GROUP} from 'navigation/Constants';
import {
  Screen,
  useFoodCrudNavigationContext,
} from 'providers/FoodCrudNavigationProvider';
import {useUserContext} from 'providers/UserProvider';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import styles from 'styles';
import {useDeleteItem} from 'utils/Queries';

const _styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

interface Props {
  realm: Realm;
}

interface FoodItemData {
  data: FoodItem;
  payload: {
    screen: Screen;
    foodItemId: string;
  };
}

interface FoodItemGroupData {
  data: FoodItemGroup;
  payload: {
    screen: Screen;
    foodGroupId: string;
  };
}

interface Section {
  title: string;
  data: Array<FoodItemData | FoodItemGroupData>;
}

const getSections = (realm: Realm): Section[] => {
  const foodItems = realm.objects<FoodItem>('FoodItem').sorted('description');
  const foodItemGroups = realm
    .objects<FoodItemGroup>('FoodItemGroup')
    .sorted('description');
  return [
    {
      title: 'Food Items',
      data: foodItems.map(foodItem => ({
        data: foodItem,
        payload: {
          screen: FOOD_ITEM_DESCRIPTION,
          foodItemId: foodItem._id.toHexString(),
        },
      })),
    },
    {
      title: 'Food Item Groups',
      data: foodItemGroups.map(foodGroup => ({
        data: foodGroup,
        payload: {
          screen: FOOD_ITEM_GROUP,
          foodGroupId: foodGroup._id.toHexString(),
        },
      })),
    },
  ];
};

const renderSectionHeader = ({section: {title}}: {section: Section}) => (
  <Text style={_styles.header}>{title}</Text>
);

const FoodSelectorScreen = ({realm}: Props): React.ReactElement<Props> => {
  const foodCrudNavigation = useFoodCrudNavigationContext();

  const {user} = useUserContext();
  const beforeDeleteFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      user.deleteFoodItem(foodItem);
    },
    [user],
  );
  const deleteFoodItem = useDeleteItem<FoodItem>(realm, beforeDeleteFoodItem);
  const beforeDeleteFoodItemGroup = React.useCallback(
    (foodItemGroup: FoodItemGroup) => {
      user.deleteFoodItemGroup(foodItemGroup);
    },
    [user],
  );
  const deleteFoodItemGroup = useDeleteItem<FoodItemGroup>(
    realm,
    beforeDeleteFoodItemGroup,
  );

  const renderItem = React.useCallback(
    ({item}: {item: FoodItemData | FoodItemGroupData}) => {
      const {data, payload} = item;
      const onEdit = () => {
        const {screen, ...rest} = payload;
        foodCrudNavigation.navigate(screen, rest);
      };
      const onDelete = () => {
        if (data instanceof FoodItem) {
          deleteFoodItem(data);
        } else {
          deleteFoodItemGroup(data);
        }
      };
      return (
        <SwipeableRow
          rightActions={getEditAndDeleteActions({
            onEditPress: onEdit,
            onDeletePress: onDelete,
          })}>
          <Text>{data.description}</Text>
        </SwipeableRow>
      );
    },
    [deleteFoodItem, deleteFoodItemGroup, foodCrudNavigation],
  );

  return (
    <View style={styles.screen}>
      <SectionList
        sections={getSections(realm)}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={item => item.data._objectId()}
        initialNumToRender={40}
      />
    </View>
  );
};

export default withRealm(FoodSelectorScreen);
