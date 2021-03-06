import React from 'react';

import {SectionList, StyleSheet, TextStyle} from 'react-native';
import {withRealm} from 'react-realm-context';
import Realm, {Results} from 'realm';

import Container from 'components/Container';
import ItemSeparator from 'components/ItemSeparator';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import SwipeableRow, {
  MIN_HEIGHT,
  getEditAndDeleteActions,
} from 'components/SwipeableRow';
import Text from 'components/Text';
import {
  FOOD_CRUD,
  FOOD_ITEM_DESCRIPTION,
  FOOD_ITEM_GROUP,
} from 'navigation/Constants';
import {useUserContext} from 'providers/UserProvider';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {useNestedScreenNavigate, useParentNavigation} from 'utils/Navigation';
import {
  useDeleteItem,
  useGetFoodItemGroups,
  useGetFoodItemGroupsWithFoodItemId,
  useGetFoodItems,
  useGetJournalEntriesWithFoodItemId,
} from 'utils/Queries';

const commonStyle: TextStyle = {
  justifyContent: 'center',
};

const _styles = StyleSheet.create({
  headerContainer: {
    minHeight: MIN_HEIGHT,
    ...commonStyle,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    ...commonStyle,
  },
});

interface Props {
  realm: Realm;
}

interface FoodItemData {
  data: FoodItem;
  payload: {
    screen: string;
    foodItemId: string;
  };
}

interface FoodItemGroupData {
  data: FoodItemGroup;
  payload: {
    screen: string;
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
  <>
    <Container style={_styles.headerContainer}>
      <Text.SubHeader>{title}</Text.SubHeader>
    </Container>
    <ItemSeparator />
  </>
);

const renderSectionFooter = ({section}: {section: Section}) => {
  let text = null;
  if (section.data.length === 0) {
    const isGroups = section.title.toLowerCase().includes('group');
    text = (
      <Container>
        <Spacer />
        <Text>{`No ${isGroups ? 'Groups' : 'Items'}`}</Text>
        <Spacer />
      </Container>
    );
  }
  return (
    <>
      {text}
      <ItemSeparator />
    </>
  );
};

const FoodSelectorScreen = ({realm}: Props): React.ReactElement<Props> => {
  const parentNavigation = useParentNavigation();
  const foodCrudNavigate = useNestedScreenNavigate(parentNavigation, FOOD_CRUD);
  const getFoodItems = useGetFoodItems(realm);
  const getFoodItemGroups = useGetFoodItemGroups(realm);
  const getFoodItemGroupsWithFoodItemId =
    useGetFoodItemGroupsWithFoodItemId(realm);
  const getJournalEntriesWithFoodItemId =
    useGetJournalEntriesWithFoodItemId(realm);

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
        foodCrudNavigate(screen, rest);
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
          <Container style={_styles.textContainer}>
            <Text>{data.description}</Text>
          </Container>
        </SwipeableRow>
      );
    },
    [deleteFoodItem, deleteFoodItemGroup, foodCrudNavigate],
  );

  const foodItems = getFoodItems().sorted('description');
  const foodItemGroups = getFoodItemGroups().sorted('description');
  const sections = getSections(foodItems, foodItemGroups);

  return (
    <ScreenWrapper>
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        renderItem={renderItem}
        keyExtractor={item => item.data._objectId()}
        ItemSeparatorComponent={ItemSeparator}
        initialNumToRender={40}
      />
    </ScreenWrapper>
  );
};

export default withRealm(FoodSelectorScreen);
