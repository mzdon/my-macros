import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {RecoverableError} from 'utils/Errors';
import {useGetFoodItemById, useGetFoodItemGroupById} from 'utils/Queries';
import {InitFoodItemData} from 'schemas/FoodItem';

type FoodGroupStateData = {
  _id?: UUID;
  description: string;
  foodItems: InitConsumedFoodItemData[];
} | null;

export interface FoodGroupContextValue {
  foodGroupData: FoodGroupStateData;
  updateDescription: (description: string) => void;
  saveFoodGroup: () => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIdx: number,
    item: InitConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  removeFoodItemFromGroup: (itemIndex: number) => void;
  applyFoodItemGroup: (group: FoodItemGroup) => void;
  updateGroupsWithFoodItem: (foodItemData: InitFoodItemData) => void;
}

const FoodGroupContext = React.createContext<FoodGroupContextValue | null>(
  null,
);

type Props = React.PropsWithChildren<{
  realm: Realm;
  journalEntryId: string | undefined;
  mealIndex: number | undefined;
  foodGroupId: string | undefined;
  newFoodGroup: boolean;
  saveConsumedFoodItem: (
    journalEntryId: string,
    mealIndex: number,
    data: InitConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  applyFoodItemGroup: (
    entryId: string,
    mealIdx: number,
    group: FoodItemGroup,
  ) => void;
}>;

/*
 * The FoodGroupProvider serves the following cases:
 * [1] Add a consumed food item group to a journal entry meal
 *    - jouranlEntryId, mealIndex, foodGroupId
 * [2] Add a new food item group and then [1]
 *    - journalEntryId, mealIndex, newGroup
 * [3] Edit an exist food item group
 *    - foodGroupId
 */
const FoodGroupProvider = ({
  realm,
  journalEntryId,
  mealIndex,
  foodGroupId,
  newFoodGroup,
  applyFoodItemGroup,
  saveConsumedFoodItem,
  children,
}: Props) => {
  const {user} = useUserContext();
  const getFoodItemById = useGetFoodItemById(realm);
  const getFoodItemGroupById = useGetFoodItemGroupById(realm);

  const [foodGroupData, setFoodGroupData] =
    React.useState<FoodGroupStateData>(null);

  const updateDescription = React.useCallback(
    (description: string) => {
      if (!foodGroupData) {
        throw new RecoverableError('Food group item data not initialized');
      }
      setFoodGroupData({
        ...foodGroupData,
        description,
      });
    },
    [foodGroupData],
  );

  React.useEffect(() => {
    if (!foodGroupData) {
      let data: FoodGroupStateData = null;
      if (foodGroupId) {
        const dehydratedData = getFoodItemGroupById(foodGroupId).getData();
        data = {
          _id: dehydratedData._id,
          description: dehydratedData.description,
          foodItems: dehydratedData.foodItems.map(consumedItem => ({
            ...consumedItem,
            item: getFoodItemById(consumedItem.item._id),
          })),
        };
      } else if (newFoodGroup) {
        data = {
          description: '',
          foodItems: [],
        };
      }
      setFoodGroupData(data);
    }
  }, [
    foodGroupData,
    foodGroupId,
    getFoodItemById,
    getFoodItemGroupById,
    newFoodGroup,
    realm,
  ]);

  const internalApplyFoodItemGroup = React.useCallback(
    (group: FoodItemGroup) => {
      if (!journalEntryId || mealIndex === undefined) {
        throw new RecoverableError(
          'No journal entry or meal specified to apply food item group to',
        );
      }
      applyFoodItemGroup(journalEntryId, mealIndex, group);
    },
    [applyFoodItemGroup, journalEntryId, mealIndex],
  );

  const saveFoodGroup = React.useCallback(() => {
    if (!foodGroupData) {
      throw new RecoverableError('No food group data to save');
    }
    let result;
    realm.write(() => {
      result = realm.create<FoodItemGroup>(
        FoodItemGroup,
        // @ts-ignore TODO
        FoodItemGroup.generate(foodGroupData),
        UpdateMode.Modified,
      );
      user.addFoodItemGroup(result);
    });
    if (!foodGroupId) {
      // @ts-ignore
      internalApplyFoodItemGroup(result);
    }
  }, [foodGroupData, foodGroupId, internalApplyFoodItemGroup, realm, user]);

  const saveConsumedFoodItemToGroup = React.useCallback(
    (
      _entryId: string,
      _mealIdx: number,
      foodItem: InitConsumedFoodItemData,
      itemIndex?: number,
    ) => {
      if (!foodGroupData) {
        throw new RecoverableError('No food group data to add a food item to');
      }
      const newFoodItems =
        itemIndex !== undefined
          ? [
              ...foodGroupData.foodItems.slice(0, itemIndex),
              foodItem,
              ...foodGroupData.foodItems.slice(itemIndex + 1),
            ]
          : [...foodGroupData.foodItems, foodItem];
      setFoodGroupData({
        ...foodGroupData,
        foodItems: newFoodItems,
      });
    },
    [foodGroupData],
  );

  const removeFoodItemFromGroup = React.useCallback(
    (itemIndex: number) => {
      if (!foodGroupData) {
        throw new RecoverableError('No food group data to add a food item to');
      }
      setFoodGroupData({
        ...foodGroupData,
        foodItems: [
          ...foodGroupData.foodItems.slice(0, itemIndex),
          ...foodGroupData.foodItems.slice(itemIndex + 1),
        ],
      });
    },
    [foodGroupData],
  );

  const updateGroupsWithFoodItem = React.useCallback(
    (foodItemData: InitFoodItemData) => {
      if (foodItemData._id === undefined) {
        throw new RecoverableError(
          'No food item id found to search food groups with',
        );
      }
      const foodItemId = foodItemData._id;
      const groupIdToItemIdxMap: Record<string, number> = {};
      const groups = realm.objects<FoodItemGroup>('FoodItemGroup').filter(
        (g: FoodItemGroup) =>
          !!g.foodItems.find((i, iIdx) => {
            const idMatch = i.itemId.equals(foodItemId);
            if (idMatch) {
              groupIdToItemIdxMap[g._id.toHexString()] = iIdx;
              return true;
            }
            return false;
          }),
      );
      if (groups.length) {
        realm.write(() => {
          groups.forEach(group => {
            const itemIdx = groupIdToItemIdxMap[group._id.toHexString()];
            if (itemIdx !== undefined) {
              const oldItem = group.foodItems[itemIdx];
              const newConsumedFoodItemdData: InitConsumedFoodItemData = {
                item: foodItemData,
                quantity: oldItem.quantity,
                unitOfMeasurement: oldItem.unitOfMeasurement,
              };
              group.foodItems[itemIdx] = ConsumedFoodItem.generate(
                newConsumedFoodItemdData,
              ) as ConsumedFoodItem;
            }
          });
        });
      }
    },
    [realm],
  );

  const contextValue = React.useMemo(() => {
    return {
      foodGroupData,
      updateDescription,
      saveFoodGroup,
      saveConsumedFoodItem: foodGroupData
        ? saveConsumedFoodItemToGroup
        : saveConsumedFoodItem,
      removeFoodItemFromGroup,
      applyFoodItemGroup: internalApplyFoodItemGroup,
      updateGroupsWithFoodItem,
    };
  }, [
    foodGroupData,
    internalApplyFoodItemGroup,
    removeFoodItemFromGroup,
    saveConsumedFoodItem,
    saveConsumedFoodItemToGroup,
    saveFoodGroup,
    updateDescription,
    updateGroupsWithFoodItem,
  ]);

  return (
    <FoodGroupContext.Provider value={contextValue}>
      {children}
    </FoodGroupContext.Provider>
  );
};

export default withRealm(FoodGroupProvider);

export const useFoodGroupContext = () => {
  const foodGroupContext = React.useContext(FoodGroupContext);
  if (foodGroupContext === null) {
    throw new Error(
      'No FoodGroupContext value found. Was useFoodGroupContext() called outside of a FoodGroupProvider?',
    );
  }
  return foodGroupContext;
};
