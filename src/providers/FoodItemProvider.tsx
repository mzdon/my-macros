import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useFoodGroupContext} from 'providers/FoodGroupProvider';
import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import {InitConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {InitFoodItemData, FoodItemData} from 'schemas/FoodItem';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {NameExistsError, RecoverableError} from 'utils/Errors';
import {
  useGetFoodItemById,
  useGetFoodItems,
  useGetJournalEntryById,
} from 'utils/Queries';

type ConsumedFoodItemDataProvided = Pick<
  InitConsumedFoodItemData,
  'quantity' | 'unitOfMeasurement'
>;

interface FoodDataState extends InitFoodItemData {
  newFoodItem: boolean;
}

export interface FoodItemContextValue {
  newFoodItem: boolean;
  foodItemData: FoodDataState | null;
  saveFoodItem: (updateReferences?: boolean) => void;
  updateFoodItemData: (data: Partial<InitFoodItemData>) => void;
  saveConsumedFoodItem: (
    consumedFoodItemData: ConsumedFoodItemDataProvided,
    foodItemId?: string,
  ) => void;
  checkForExistingFoodItemDescription: (data: InitFoodItemData | null) => void;
}

const FoodItemContext = React.createContext<FoodItemContextValue | null>(null);

type Props = React.PropsWithChildren<{
  realm: Realm;
  journalEntryId: string | undefined;
  mealIndex: number | undefined;
  consumedItemIndex: number | undefined;
  foodItemId: string | undefined;
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
 * [5] Update a consumed food item on a food item group
 *    - counsumedItemIndex, foodGroupData
 */
const FoodItemProvider = ({
  realm,
  journalEntryId,
  mealIndex,
  consumedItemIndex,
  foodItemId,
  children,
}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();
  const getJournalEntryById = useGetJournalEntryById(realm);
  const getFoodItemById = useGetFoodItemById(realm);
  const getFoodItems = useGetFoodItems(realm);
  const {updateEntriesWithFoodItem} = useJournalContext();
  const {foodGroupData, saveConsumedFoodItem, updateGroupsWithFoodItem} =
    useFoodGroupContext();

  const [foodItemData, setFoodItemData] = React.useState<FoodDataState | null>(
    null,
  );

  const updateFoodItemData = React.useCallback(
    (data: Partial<InitFoodItemData>) => {
      if (!foodItemData) {
        throw new RecoverableError('Food item data state not initialized yet');
      }
      const nextData = {
        ...foodItemData,
        ...data,
      };
      setFoodItemData(nextData);
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
      const entry = getJournalEntryById(jeId);
      const consumedItem = entry.meals[mIdx]?.items[cIdx];
      if (!consumedItem || !consumedItem.itemId) {
        return consumedItem.getData();
      }
      return getFoodItemById(consumedItem.itemId).getData();
    };

    let data: FoodDataState;
    if (foodItemId) {
      // case [1], [4]
      data = {
        ...getFoodItemById(foodItemId).getData(),
        newFoodItem: false,
        userId: user._id,
      };
    } else if (
      journalEntryId &&
      mealIndex !== undefined &&
      consumedItemIndex !== undefined
    ) {
      // case [2]
      data = {
        ...getExistingFoodItemFromConsumedFoodItem(
          journalEntryId,
          mealIndex,
          consumedItemIndex,
        ),
        newFoodItem: false,
        userId: user._id,
      };
    } else if (consumedItemIndex !== undefined && foodGroupData) {
      // case [5]
      data = {
        ...foodGroupData.foodItems[consumedItemIndex],
        newFoodItem: false,
        userId: user._id,
      };
    } else {
      // case [3]
      data = {
        description: '',
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        sugar: 0,
        fiber: 0,
        servingSize: 0,
        servingUnitOfMeasurement: UnitOfMeasurement.Grams,
        servingSizeNote: '',
        newFoodItem: true,
        userId: user._id,
      };
    }

    setFoodItemData(data);
  }, [
    consumedItemIndex,
    foodGroupData,
    foodItemId,
    getFoodItemById,
    getJournalEntryById,
    journalEntryId,
    mealIndex,
    realm,
    user,
  ]);

  const checkForExistingFoodItemDescription = React.useCallback(
    (data: InitFoodItemData | null) => {
      if (!data || !data.description) {
        return;
      }
      const existing = getFoodItems().filtered(
        'description == $0 && _id != $1',
        data.description,
        data._id,
      );
      if (existing.length > 0) {
        throw new NameExistsError();
      }
    },
    [getFoodItems],
  );

  const writeFoodItemToRealm = React.useCallback(
    (data: InitFoodItemData): FoodItem => {
      checkForExistingFoodItemDescription(data);
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
    [checkForExistingFoodItemDescription, realm, user],
  );

  const saveFoodItem = React.useCallback(
    (updateReferences: boolean = false) => {
      if (!foodItemData) {
        throw new RecoverableError('No food item data to save');
      }
      if (foodItemId) {
        const validItemData = FoodItem.verifyInitFoodItemData(foodItemData);
        if (!validItemData) {
          throw new RecoverableError(
            'Some food item data appears to be missing in order to create a consumed food item',
          );
        }
        const validItem: FoodItemData = {
          ...validItemData,
          _id: new UUID(foodItemId),
        };
        writeFoodItemToRealm(validItem);
        if (updateReferences) {
          updateGroupsWithFoodItem(validItem);
          updateEntriesWithFoodItem(validItem);
        }
      }
    },
    [
      foodItemData,
      foodItemId,
      updateEntriesWithFoodItem,
      updateGroupsWithFoodItem,
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
      const {newFoodItem, ...rest} = foodItemData;
      const validItem = FoodItem.verifyInitFoodItemData(rest);
      if (!validItem) {
        throw new RecoverableError(
          'Some food item data appears to be missing in order to create a consumed food item',
        );
      }
      let payload: InitConsumedFoodItemData = {
        itemData: validItem,
        ...data,
      };
      if (newFoodItem) {
        const foodItem = writeFoodItemToRealm(payload.itemData);
        payload.itemId = foodItem._id;
      }
      onSaveConsumedFoodItem(payload);
    },
    [foodItemData, onSaveConsumedFoodItem, writeFoodItemToRealm],
  );

  const contextValue = React.useMemo(() => {
    return {
      newFoodItem: !!journalEntryId,
      foodItemData,
      saveFoodItem,
      updateFoodItemData,
      saveConsumedFoodItem: internalSaveConsumedFoodItem,
      checkForExistingFoodItemDescription,
    };
  }, [
    journalEntryId,
    foodItemData,
    internalSaveConsumedFoodItem,
    saveFoodItem,
    updateFoodItemData,
    checkForExistingFoodItemDescription,
  ]);

  return (
    <FoodItemContext.Provider value={contextValue}>
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
