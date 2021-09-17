import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useGetFoodItemById} from 'providers/FoodItemProvider';
import {useUserContext} from 'providers/UserProvider';
import {InitConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {RecoverableError} from 'utils/Errors';

type FoodGroupStateData = {
  _id?: UUID;
  description: string;
  foodItems: InitConsumedFoodItemData[];
} | null;

export interface FoodGroupContextValue {
  foodGroupData: FoodGroupStateData;
  saveFoodGroup: (description: string) => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIdx: number,
    item: InitConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  removeFoodItemFromGroup: (itemIndex: number) => void;
  applyFoodItemGroup: (group: FoodItemGroup) => void;
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

  const [foodGroupData, setFoodGroupData] =
    React.useState<FoodGroupStateData>(null);

  React.useEffect(() => {
    if (!foodGroupData) {
      const getFoodGroupById = (id: string) => {
        const result = realm.objectForPrimaryKey<FoodItemGroup>(
          'FoodItemGroup',
          new UUID(id),
        );
        if (!result) {
          throw new RecoverableError(`No FoodItemGroup found for id: ${id}`);
        }
        return result;
      };

      let data: FoodGroupStateData = null;
      if (foodGroupId) {
        const dehydratedData = getFoodGroupById(foodGroupId).getData();
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
  }, [foodGroupData, foodGroupId, getFoodItemById, newFoodGroup, realm]);

  const saveFoodGroup = (description: string) => {
    if (!foodGroupData) {
      throw new RecoverableError('No food group data to save');
    }
    let result;
    realm.write(() => {
      result = realm.create<FoodItemGroup>(
        FoodItemGroup,
        // @ts-ignore TODO
        FoodItemGroup.generate({
          foodItems: foodGroupData.foodItems,
          description,
        }),
        UpdateMode.Modified,
      );
      user.addFoodItemGroup(result);
    });
    if (!foodGroupId) {
      // @ts-ignore
      internalApplyFoodItemGroup(result);
    }
  };

  const saveConsumedFoodItemToGroup = (
    _entryId: string,
    _mealIdx: number,
    foodItem: InitConsumedFoodItemData,
    _itemIndex?: number,
  ) => {
    if (!foodGroupData) {
      throw new RecoverableError('No food group data to add a food item to');
    }
    setFoodGroupData({
      ...foodGroupData,
      foodItems: [...foodGroupData.foodItems, foodItem],
    });
  };

  const removeFoodItemFromGroup = (itemIndex: number) => {
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
  };

  const internalApplyFoodItemGroup = (group: FoodItemGroup) => {
    if (!journalEntryId || mealIndex === undefined) {
      throw new RecoverableError(
        'No journal entry or meal specified to apply food item group to',
      );
    }
    applyFoodItemGroup(journalEntryId, mealIndex, group);
  };

  return (
    <FoodGroupContext.Provider
      value={{
        foodGroupData,
        saveFoodGroup,
        saveConsumedFoodItem: foodGroupData
          ? saveConsumedFoodItemToGroup
          : saveConsumedFoodItem,
        removeFoodItemFromGroup,
        applyFoodItemGroup: internalApplyFoodItemGroup,
      }}>
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
