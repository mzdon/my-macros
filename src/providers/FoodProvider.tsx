import React from 'react';

import {RealmConsumer} from 'react-realm-context';
import {UpdateMode} from 'realm';

import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
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
  mealOrderIndex: number | undefined;
  foodItemId: string | undefined;
  foodGroupId: string | undefined;
  createConsumedFoodItem: (
    journalEntryId: string,
    mealOrderIndex: number,
    data: ConsumedFoodItemData,
  ) => ConsumedFoodItem;
}>;

const FoodProvider = ({
  journalEntryId,
  mealOrderIndex,
  foodItemId,
  // foodGroupId,
  createConsumedFoodItem,
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

  const onCreateConsumedFoodItem = React.useCallback(
    (data: ConsumedFoodItemData) => {
      if (journalEntryId === undefined || mealOrderIndex === undefined) {
        throw new RecoverableError(
          'No journal entry id or meal id to create a consumed item for',
        );
      }
      createConsumedFoodItem(journalEntryId, mealOrderIndex, data);
    },
    [createConsumedFoodItem, journalEntryId, mealOrderIndex],
  );

  return (
    <RealmConsumer updateOnChange={true}>
      {({realm}) => {
        const getExistingFoodItem = () => {
          if (!foodItemId) {
            return null;
          }
          return (
            realm.objectForPrimaryKey<FoodItem>('FoodItem', foodItemId) || null
          );
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

        const saveConsumedFoodItem = (data: ConsumedFoodItemDataProvided) => {
          let payload: ConsumedFoodItemData;
          const existingFoodItem = getExistingFoodItem();
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
          onCreateConsumedFoodItem(payload);
        };

        return (
          <FoodContext.Provider
            value={{
              items: {},
              groups: {},
              foodItemData: foodItemData || getExistingFoodItem(),
              saveFoodItem,
              updateFoodItemData,
              saveConsumedFoodItem,
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
