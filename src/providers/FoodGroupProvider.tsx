import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
  ConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {RecoverableError} from 'utils/Errors';
import {
  useGetFoodItemById,
  useGetFoodItemGroupById,
  useGetFoodItemGroupsWithFoodItemId,
} from 'utils/Queries';
import {FoodItemData} from 'schemas/FoodItem';
import {ServingUnitOfMeasurement} from 'types/UnitOfMeasurement';

type FoodGroupStateData = {
  _id?: UUID;
  description: string;
  foodItems: ConsumedFoodItemData[];
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
  updateGroupsWithFoodItem: (foodItemData: FoodItemData) => void;
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
  children,
}: Props) => {
  const {user} = useUserContext();
  const {applyFoodItemGroup, saveConsumedFoodItem} = useJournalContext();
  const getFoodItemById = useGetFoodItemById(realm);
  const getFoodItemGroupById = useGetFoodItemGroupById(realm);
  const getFoodItemGroupsWithFoodItemId =
    useGetFoodItemGroupsWithFoodItemId(realm);

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
        data = getFoodItemGroupById(foodGroupId).getData();
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
      const data: unknown = FoodItemGroup.generate(
        foodGroupData,
        user.realmUserId,
      );
      result = realm.create<FoodItemGroup>(
        FoodItemGroup,
        data as FoodItemGroup,
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
              ConsumedFoodItem.generate(foodItem),
              ...foodGroupData.foodItems.slice(itemIndex + 1),
            ]
          : [...foodGroupData.foodItems, ConsumedFoodItem.generate(foodItem)];
      setFoodGroupData({
        ...foodGroupData,
        foodItems: newFoodItems,
      });
    },
    [foodGroupData],
  );

  const internalSaveConsumedFoodItem = React.useCallback(
    (
      entryId: string,
      mealIdx: number,
      foodItem: InitConsumedFoodItemData,
      itemIdx?: number,
    ) => {
      if (foodGroupData) {
        saveConsumedFoodItemToGroup(entryId, mealIdx, foodItem, itemIdx);
      } else {
        const consumedFoodItem = ConsumedFoodItem.generate(foodItem);
        saveConsumedFoodItem(entryId, mealIdx, consumedFoodItem, itemIdx);
      }
    },
    [foodGroupData, saveConsumedFoodItem, saveConsumedFoodItemToGroup],
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
    (foodItemData: FoodItemData) => {
      if (foodItemData._id === undefined) {
        throw new RecoverableError(
          'No food item id found to search food groups with',
        );
      }
      const foodItemId = foodItemData._id;
      const {groups, groupIdToItemIndexesMap} =
        getFoodItemGroupsWithFoodItemId(foodItemId);
      if (groups.length) {
        realm.write(() => {
          groups.forEach(group => {
            const itemIndexes =
              groupIdToItemIndexesMap[group._id.toHexString()];
            if (itemIndexes !== undefined) {
              itemIndexes.forEach(itemIdx => {
                const oldItem = group.foodItems[itemIdx];
                const newConsumedFoodItemdData: InitConsumedFoodItemData = {
                  itemData: foodItemData,
                  itemId: foodItemData._id,
                  quantity: oldItem.quantity,
                  // TODO: if I can figure out a decent solution for inhereting from enums fix this
                  unitOfMeasurement:
                    oldItem.unitOfMeasurement as unknown as ServingUnitOfMeasurement,
                };
                group.foodItems[itemIdx] = ConsumedFoodItem.generate(
                  newConsumedFoodItemdData,
                ) as ConsumedFoodItem;
              });
            }
          });
        });
      }
    },
    [getFoodItemGroupsWithFoodItemId, realm],
  );

  const contextValue = React.useMemo(() => {
    return {
      foodGroupData,
      updateDescription,
      saveFoodGroup,
      saveConsumedFoodItem: internalSaveConsumedFoodItem,
      removeFoodItemFromGroup,
      applyFoodItemGroup: internalApplyFoodItemGroup,
      updateGroupsWithFoodItem,
    };
  }, [
    foodGroupData,
    internalApplyFoodItemGroup,
    internalSaveConsumedFoodItem,
    removeFoodItemFromGroup,
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
