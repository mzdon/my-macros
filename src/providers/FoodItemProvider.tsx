import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useUserContext} from 'providers/UserProvider';
import {InitConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {InitFoodItemData} from 'schemas/FoodItem';
import JournalEntry from 'schemas/JournalEntry';
import {RecoverableError} from 'utils/Errors';
import {useGetFoodItemById} from 'utils/Queries';

type ConsumedFoodItemDataProvided = Pick<
  InitConsumedFoodItemData,
  'quantity' | 'unitOfMeasurement'
>;

export interface FoodItemContextValue {
  foodItemData: Partial<InitFoodItemData> | null;
  saveFoodItem: (data: Partial<InitFoodItemData>) => void;
  updateFoodItemData: (data: Partial<InitFoodItemData>) => void;
  saveConsumedFoodItem: (
    consumedFoodItemData: ConsumedFoodItemDataProvided,
    foodItemId?: string,
  ) => void;
}

const FoodItemContext = React.createContext<FoodItemContextValue | null>(null);

type Props = React.PropsWithChildren<{
  realm: Realm;
  journalEntryId: string | undefined;
  mealIndex: number | undefined;
  consumedItemIndex: number | undefined;
  foodItemId: string | undefined;
  foodGroupId: string | undefined;
  saveConsumedFoodItem: (
    journalEntryId: string,
    mealIndex: number,
    data: InitConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
}>;

/**
 * The FoodItemProvider serves the following cases:
 * [1] Add a consumed food item to a journal entry meal
 *    - journalEntryId, mealIndex, foodItemId
 * [2] Update a consumed food item on a journal entry meal
 *    - journalEntryId, mealIndex, consumedItemIndex
 * [3] Add new food item and then [1]
 *    - journalEntryId, mealIndex
 * [4] Edit an existing food item and prompt the user on whether or not this impacts all previous consumed food items
 *    - foodItemId
 */
const FoodItemProvider = ({
  realm,
  journalEntryId,
  mealIndex,
  consumedItemIndex,
  foodItemId,
  saveConsumedFoodItem,
  children,
}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();
  const getFoodItemById = useGetFoodItemById(realm);

  const [foodItemData, setFoodItemData] =
    React.useState<Partial<InitFoodItemData> | null>(null);

  const updateFoodItemData = React.useCallback(
    (data: Partial<InitFoodItemData>) => {
      setFoodItemData({
        ...(foodItemData || {}),
        ...data,
      });
    },
    [foodItemData],
  );

  const onSaveConsumedFoodItem = React.useCallback(
    (data: InitConsumedFoodItemData) => {
      if (journalEntryId === undefined || mealIndex === undefined) {
        throw new RecoverableError(
          'No journal entry id or meal id to create a consumed item for',
        );
      }
      saveConsumedFoodItem(journalEntryId, mealIndex, data, consumedItemIndex);
    },
    [journalEntryId, mealIndex, saveConsumedFoodItem, consumedItemIndex],
  );

  React.useEffect(() => {
    const getExistingFoodItemFromConsumedFoodItem = (
      jeId: string,
      mIdx: number,
      cIdx: number,
    ) => {
      const entry = realm.objectForPrimaryKey<JournalEntry>(
        'JournalEntry',
        new UUID(jeId),
      );
      if (!entry) {
        return null;
      }
      const consumedItem = entry.meals[mIdx]?.items[cIdx];
      if (!consumedItem) {
        return null;
      }
      return getFoodItemById(consumedItem.itemId);
    };

    let data: Partial<InitFoodItemData>;
    if (foodItemId) {
      // case [1], [4]
      data = getFoodItemById(foodItemId).getData();
    } else if (journalEntryId && mealIndex !== undefined && consumedItemIndex) {
      // case [2]
      const foodItem = getExistingFoodItemFromConsumedFoodItem(
        journalEntryId,
        mealIndex,
        consumedItemIndex,
      );
      if (!foodItem) {
        throw new RecoverableError(
          `No food item found using journalEntryId: ${journalEntryId}, mealIndex: ${mealIndex}, consumedItemIndex: ${consumedItemIndex}`,
        );
      }
      data = foodItem.getData();
    } else {
      // case [3]
      data = {};
    }

    setFoodItemData(data);
  }, [
    consumedItemIndex,
    foodItemId,
    getFoodItemById,
    journalEntryId,
    mealIndex,
    realm,
  ]);

  const writeFoodItemToRealm = React.useCallback(
    (data: InitFoodItemData): FoodItem => {
      let result;
      realm.write(() => {
        result = realm.create<FoodItem>(
          FoodItem,
          FoodItem.generate(data),
          UpdateMode.Modified,
        );
        user.addFoodItem(result);
      });
      // @ts-ignore
      return result;
    },
    [realm, user],
  );

  const saveFoodItem = React.useCallback(
    (data: Partial<InitFoodItemData>) => {
      if (!foodItemData) {
        throw new RecoverableError('No food item data save');
      }
      if (journalEntryId) {
        // if we are adding a new food item, just update state
        updateFoodItemData(data);
      } else if (foodItemId) {
        const validItem = FoodItem.verifyInitFoodItemData(foodItemData);
        if (!validItem) {
          throw new RecoverableError(
            'Some food item data appears to be missing in order to create a consumed food item',
          );
        }
        // if we are editing an existing food item, save it to realm
        writeFoodItemToRealm({
          ...validItem,
          ...data,
        });
      }
    },
    [
      foodItemData,
      foodItemId,
      journalEntryId,
      updateFoodItemData,
      writeFoodItemToRealm,
    ],
  );

  const internalSaveConsumedFoodItem = React.useCallback(
    (data: ConsumedFoodItemDataProvided) => {
      if (!foodItemData) {
        throw new RecoverableError(
          'No food item data save to consumed food item',
        );
      }
      const validItem = FoodItem.verifyInitFoodItemData(foodItemData);
      if (!validItem) {
        throw new RecoverableError(
          'Some food item data appears to be missing in order to create a consumed food item',
        );
      }
      let payload = {
        item: validItem,
        ...data,
      };
      if (!payload.item._id) {
        payload.item = writeFoodItemToRealm(payload.item);
      }
      onSaveConsumedFoodItem(payload);
    },
    [foodItemData, onSaveConsumedFoodItem, writeFoodItemToRealm],
  );

  return (
    <FoodItemContext.Provider
      value={{
        foodItemData,
        saveFoodItem,
        updateFoodItemData,
        saveConsumedFoodItem: internalSaveConsumedFoodItem,
      }}>
      {children}
    </FoodItemContext.Provider>
  );
};

export default withRealm(FoodItemProvider);

export const useFoodItemContext = () => {
  const foodItemContext = React.useContext(FoodItemContext);
  if (foodItemContext === null) {
    throw new Error(
      'No FoodItemContext value found. Was useFoodItemContext() called outside of a FoodItemProvider?',
    );
  }
  return foodItemContext;
};