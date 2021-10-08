import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import {withRealm} from 'react-realm-context';
import Realm, {Results} from 'realm';

import SwipeableRow, {getEditAndDeleteActions} from 'components/SwipeableRow';
import {FOOD_ITEM_DESCRIPTION, FOOD_ITEM_GROUP} from 'navigation/Constants';
import {FoodEditorScreenNavigationProp} from 'navigation/RouteTypes';
import {
  Screen,
  useFoodCrudNavigationContext,
} from 'providers/FoodCrudNavigationProvider';
import {useUserContext} from 'providers/UserProvider';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import styles from 'styles';
import {
  useDeleteItem,
  useGetFoodItemGroups,
  useGetFoodItemGroupsWithFoodItemId,
  useGetFoodItems,
  useGetJournalEntriesWithFoodItemId,
} from 'utils/Queries';
import {useSetFoodCrudNavigationOptions} from 'utils/Navigation';

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

const getSections = (
  foodItems: Results<FoodItem>,
  foodItemGroups: Results<FoodItemGroup>,
): Section[] => {
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

const renderSectionFooter = ({section}: {section: Section}) => {
  if (section.data.length === 0) {
    const isGroups = section.title.toLowerCase().includes('group');
    return <Text>{`No ${isGroups ? 'Groups' : 'Items'}`}</Text>;
  }
  return null;
};

const headerOptions = {
  headerTitle: 'Food Editor',
};

const FoodSelectorScreen = ({realm}: Props): React.ReactElement<Props> => {
  const navigation = useNavigation<FoodEditorScreenNavigationProp>();
  const foodCrudNavigation = useFoodCrudNavigationContext();
  const getFoodItems = useGetFoodItems(realm);
  const getFoodItemGroups = useGetFoodItemGroups(realm);
  const getFoodItemGroupsWithFoodItemId =
    useGetFoodItemGroupsWithFoodItemId(realm);
  const getJournalEntriesWithFoodItemId =
    useGetJournalEntriesWithFoodItemId(realm);

  useSetFoodCrudNavigationOptions(
    navigation,
    foodCrudNavigation,
    headerOptions,
  );

  const {user} = useUserContext();
  const beforeDeleteFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      user.deleteFoodItem(foodItem);
      const {groups, groupIdToItemIndexesMap} = getFoodItemGroupsWithFoodItemId(
        foodItem._id,
      );
      if (groups.length) {
        groups.forEach(group => {
          const indexes = groupIdToItemIndexesMap[group._id.toHexString()];
          indexes.forEach(itemIdx => {
            group.foodItems[itemIdx].itemId = null;
          });
        });
      }
      const {entries, journalIdToPathMap} = getJournalEntriesWithFoodItemId(
        foodItem._id,
      );
      if (entries.length) {
        entries.forEach(entry => {
          const paths = journalIdToPathMap[entry._id.toHexString()];
          paths.forEach(([mealIdx, itemIdx]) => {
            entry.meals[mealIdx].items[itemIdx].itemId = null;
          });
        });
      }
    },
    [getFoodItemGroupsWithFoodItemId, getJournalEntriesWithFoodItemId, user],
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

  const foodItems = getFoodItems().sorted('description');
  const foodItemGroups = getFoodItemGroups().sorted('description');
  const sections = getSections(foodItems, foodItemGroups);

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        renderItem={renderItem}
        keyExtractor={item => item.data._objectId()}
        initialNumToRender={40}
      />
    </View>
  );
};

export default withRealm(FoodSelectorScreen);
