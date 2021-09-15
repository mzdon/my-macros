import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import JournalEntry from 'schemas/JournalEntry';
import {RecoverableError} from 'utils/Errors';

type ConsumedFoodItemDataProvided = Pick<
  ConsumedFoodItemData,
  'quantity' | 'unitOfMeasurement'
>;

export interface FoodContextValue {
  foodItemData: Partial<FoodItemData> | null;
  saveFoodItem: (data: Partial<FoodItemData>) => void;
  updateFoodItemData: (data: Partial<FoodItemData>) => void;
  saveConsumedFoodItem: (
    consumedFoodItemData: ConsumedFoodItemDataProvided,
    foodItemId?: string,
  ) => void;
}

const FoodContext = React.createContext<FoodContextValue | null>(null);

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
    data: ConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
}>;

/**
 * The FoodProvider serves the following cases:
 * [1] Add a consumed food item to a journal entry meal
 *    - journalEntryId, mealIndex, foodItemId
 * [2] Update a consumed food item on a journal entry meal
 *    - journalEntryId, mealIndex, consumedItemIndex
 * [3] Add new food item and then [1]
 *    - journalEntryId, mealIndex
 * [4] Edit an existing food item and prompt the user on whether or not this impacts all previous consumed food items
 *    - foodItemId
 * // FOLLOWING ITEMS PENDING... NOT SURE HOW I'LL DO THESE... MAYBE NEED THEIR OWN STACK AND PROVIDER ??
 * [5] Add a consumed food item group to a journal entry meal
 *    - jouranlEntryId, mealIndex, foodGroupId
 * [6] Add a new food item group and then [3] ??
 *    - journalEntryId, mealIndex ??
 * [7] Edit an exist food item group ??
 *    - foodGroupId ??
 */
const FoodProvider = ({
  realm,
  journalEntryId,
  mealIndex,
  consumedItemIndex,
  foodItemId,
  // foodGroupId,
  saveConsumedFoodItem,
  children,
}: Props): React.ReactElement<Props> => {
  const [foodItemData, setFoodItemData] =
    React.useState<Partial<FoodItemData> | null>(null);

  const updateFoodItemData = React.useCallback(
    (data: Partial<FoodItemData>) => {
      setFoodItemData({
        ...(foodItemData || {}),
        ...data,
      });
    },
    [foodItemData],
  );

  const onSaveConsumedFoodItem = React.useCallback(
    (data: ConsumedFoodItemData) => {
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
    const getFoodItemById = (id: string): FoodItem => {
      const foodItem = realm.objectForPrimaryKey<FoodItem>(
        'FoodItem',
        new UUID(id),
      );
      if (!foodItem) {
        throw new RecoverableError(`No Food Item found with id: ${id}`);
      }
      return foodItem;
    };

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
      return getFoodItemById(consumedItem.itemId.toHexString());
    };

    let data: Partial<FoodItemData>;
    if (foodItemId) {
      // case [1], [5]
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
      // case [4]
      data = {};
    }

    console.log('setFoodItemData in useEffect');
    setFoodItemData(data);
  }, [consumedItemIndex, foodItemId, journalEntryId, mealIndex, realm]);

  const writeFoodItemToRealm = (data: Partial<FoodItemData>): FoodItem => {
    let result;
    realm.write(() => {
      result = realm.create(
        FoodItem,
        FoodItem.generate(data),
        UpdateMode.Modified,
      );
    });
    // @ts-ignore
    return result;
  };

  const saveFoodItem = (data: Partial<FoodItemData>) => {
    if (!foodItemData) {
      throw new RecoverableError('No food item data save');
    }
    if (journalEntryId) {
      // if we are adding a new food item, just update state
      updateFoodItemData(data);
    } else if (foodItemId) {
      // if we are editing an existing food item, save it to realm
      writeFoodItemToRealm({
        ...foodItemData,
        ...data,
      });
    }
  };

  const internalSaveConsumedFoodItem = (data: ConsumedFoodItemDataProvided) => {
    if (!foodItemData) {
      throw new RecoverableError(
        'No food item data save to consumed food item',
      );
    }
    let payload = {
      item: foodItemData,
      ...data,
    };
    if (!foodItemData._id) {
      payload.item = writeFoodItemToRealm(foodItemData);
    }
    onSaveConsumedFoodItem(payload);
  };

  return (
    <FoodContext.Provider
      value={{
        foodItemData,
        saveFoodItem,
        updateFoodItemData,
        saveConsumedFoodItem: internalSaveConsumedFoodItem,
      }}>
      {children}
    </FoodContext.Provider>
  );
};

export default withRealm(FoodProvider);

export const useFoodContext = () => {
  const foodContext = React.useContext(FoodContext);
  if (foodContext === null) {
    throw new Error(
      'No FoodContext value found. Was useFoodContext() called outside of a FoodProvider?',
    );
  }
  return foodContext;
};
