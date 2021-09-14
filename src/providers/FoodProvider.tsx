import React from 'react';

import {UUID} from 'bson';
import {RealmConsumer} from 'react-realm-context';
import {UpdateMode} from 'realm';

import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import JournalEntry from 'schemas/JournalEntry';
import {RecoverableError} from 'utils/Errors';

type FoodItemDataState = FoodItem | Partial<FoodItemData> | null;
type ConsumedFoodItemDataProvided = Pick<
  ConsumedFoodItemData,
  'quantity' | 'unitOfMeasurement'
>;

export interface FoodContextValue {
  items: Record<string, FoodItem>;
  groups: Record<string, Array<ConsumedFoodItem>>;
  foodItemData: FoodItemDataState;
  saveFoodItem: (data: Partial<FoodItemData>) => void;
  updateFoodItemData: (data: Partial<FoodItemData>) => void;
  saveConsumedFoodItem: (
    consumedFoodItemData: ConsumedFoodItemDataProvided,
  ) => void;
}

const FoodContext = React.createContext<FoodContextValue | null>(null);

type Props = React.PropsWithChildren<{
  journalEntryId: string | undefined;
  mealIndex: number | undefined;
  itemIndex: number | undefined;
  foodItemId: string | undefined;
  foodGroupId: string | undefined;
  saveConsumedFoodItem: (
    journalEntryId: string,
    mealOrderIndex: number,
    data: ConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
}>;

const FoodProvider = ({
  journalEntryId,
  mealIndex,
  itemIndex,
  foodItemId,
  // foodGroupId,
  saveConsumedFoodItem,
  children,
}: Props): React.ReactElement<Props> => {
  const [foodItemData, setFoodItemData] =
    React.useState<FoodItemDataState>(null);

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
      saveConsumedFoodItem(journalEntryId, mealIndex, data, itemIndex);
    },
    [journalEntryId, mealIndex, saveConsumedFoodItem, itemIndex],
  );

  return (
    <RealmConsumer updateOnChange={true}>
      {({realm}) => {
        const getExistingFoodItem = (passedFoodItemId?: string) => {
          let id = passedFoodItemId;
          if (!id) {
            if (!foodItemId) {
              return null;
            } else {
              id = foodItemId;
            }
          }
          return (
            realm.objectForPrimaryKey<FoodItem>('FoodItem', new UUID(id)) ||
            null
          );
        };

        const getExistingFoodItemFromConsumedFoodItem = () => {
          if (
            !journalEntryId ||
            mealIndex === undefined ||
            itemIndex === undefined
          ) {
            return null;
          }
          const entry = realm.objectForPrimaryKey<JournalEntry>(
            'JournalEntry',
            new UUID(journalEntryId),
          );
          if (!entry) {
            return null;
          }
          const consumedItem = entry.meals[mealIndex]?.items[itemIndex];
          if (!consumedItem) {
            return null;
          }
          return getExistingFoodItem(consumedItem.itemId.toHexString());
        };

        const writeFoodItemToRealm = (
          data: Partial<FoodItemData>,
        ): FoodItem => {
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

        const internalSaveConsumedFoodItem = (
          data: ConsumedFoodItemDataProvided,
        ) => {
          let payload: ConsumedFoodItemData;
          const existingFoodItem =
            getExistingFoodItem() || getExistingFoodItemFromConsumedFoodItem();
          if (existingFoodItem) {
            payload = {
              ...data,
              item: existingFoodItem,
            };
          } else if (foodItemData) {
            const newFoodItem = writeFoodItemToRealm(foodItemData);
            payload = {
              ...data,
              item: newFoodItem,
            };
          } else {
            throw new RecoverableError(
              'No food item data save to consumed food item',
            );
          }
          onSaveConsumedFoodItem(payload);
        };

        const getFoodItemData = () =>
          foodItemData ||
          getExistingFoodItem() ||
          getExistingFoodItemFromConsumedFoodItem();

        return (
          <FoodContext.Provider
            value={{
              items: {},
              groups: {},
              foodItemData: getFoodItemData(),
              saveFoodItem,
              updateFoodItemData,
              saveConsumedFoodItem: internalSaveConsumedFoodItem,
            }}>
            {children}
          </FoodContext.Provider>
        );
      }}
    </RealmConsumer>
  );
};

export default FoodProvider;

export const useFoodContext = () => {
  const foodContext = React.useContext(FoodContext);
  if (foodContext === null) {
    throw new Error(
      'No FoodContext value found. Was useFoodContext() called outside of a FoodProvider?',
    );
  }
  return foodContext;
};
