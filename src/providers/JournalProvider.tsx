import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
  ConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {FoodItemData} from 'schemas/FoodItem';
import Meal, {InitMealData} from 'schemas/Meal';
import {isSameDay} from 'utils/Date';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import {
  useDeleteItem,
  useGetJournalEntriesWithFoodItemId,
  useGetJournalEntryById,
  useQueryResultStateWithListener,
} from 'utils/Queries';
import {ServingUnitOfMeasurement} from 'types/UnitOfMeasurement';

interface JournalContext {
  entries: JournalEntry[];
  saveMeal: (date: Date, description: string, order?: number) => void;
  deleteMeal: (meal: Meal) => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIndex: number,
    consumedFoodItem: ConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  deleteConsumedFoodItem: (item: ConsumedFoodItem) => void;
  applyFoodItemGroup: (
    entryId: string,
    mealIndex: number,
    group: FoodItemGroup,
  ) => void;
  updateEntriesWithFoodItem: (foodItemData: FoodItemData) => void;
}

const JournalContext = React.createContext<JournalContext | null>(null);

type Props = React.PropsWithChildren<{realm: Realm}>;

function getMealFromEntry(entry: JournalEntry, mealIndex: number) {
  const meal = entry.meals[mealIndex];
  if (!meal) {
    throw new RecoverableError(
      `No meal at index: ${mealIndex} for JournalEntry<${entry._id.toHexString()}>`,
    );
  }
  return meal;
}

const JournalProvider = ({
  realm,
  children,
}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();
  if (!user) {
    throw new CatastrophicError('No user available in JournalProvider');
  }

  const getResult = React.useCallback(
    () => realm.objects<JournalEntry>('JournalEntry').sorted('date'),
    [realm],
  );
  const entries = useQueryResultStateWithListener(realm, getResult);

  const getEntryById = useGetJournalEntryById(realm);
  const getJournalEntriesWithFoodItemId =
    useGetJournalEntriesWithFoodItemId(realm);

  const getEntryForDate = React.useCallback(
    (date: Date) => {
      return (
        realm
          .objects<JournalEntry>('JournalEntry')
          .find(entry => isSameDay(entry.date, date)) || null
      );
    },
    [realm],
  );

  const saveMeal = React.useCallback(
    (date: Date, description: string, mealIndex?: number) => {
      const entry = getEntryForDate(date);
      let meals: InitMealData[] = entry ? [...entry.meals] : [];
      if (mealIndex === undefined) {
        const newMeal = {description};
        meals.push(newMeal);
      } else {
        meals = meals.map((meal, idx) => {
          if (idx === mealIndex) {
            return {items: meal.items, description};
          }
          return meal;
        });
      }

      const entryData = {date, meals, id: entry?._id};
      realm.write(() => {
        realm.create<JournalEntry>(
          JournalEntry,
          JournalEntry.generate(entryData, user.realmUserId),
          UpdateMode.Modified,
        );
      });
    },
    [getEntryForDate, realm, user.realmUserId],
  );

  const deleteMeal = useDeleteItem<Meal>(realm);

  const saveConsumedFoodItem = React.useCallback(
    (
      journalEntryId: string,
      mealIndex: number,
      consumedFoodItem: ConsumedFoodItemData,
      itemIndex?: number,
    ) => {
      const entry = getEntryById(new UUID(journalEntryId));
      const existingMeal = getMealFromEntry(entry, mealIndex);

      realm.write(() => {
        if (itemIndex !== undefined) {
          existingMeal.items[itemIndex] = consumedFoodItem as ConsumedFoodItem;
        } else {
          existingMeal.items.push(consumedFoodItem as ConsumedFoodItem);
        }
      });
    },
    [getEntryById, realm],
  );

  const deleteConsumedFoodItem = useDeleteItem<ConsumedFoodItem>(realm);

  const applyFoodItemGroup = React.useCallback(
    (entryId: string, mealIdx: number, group: FoodItemGroup) => {
      group.foodItems.forEach(foodItem => {
        saveConsumedFoodItem(entryId, mealIdx, foodItem.getData());
      });
    },
    [saveConsumedFoodItem],
  );

  const updateEntriesWithFoodItem = React.useCallback(
    (foodItemData: FoodItemData) => {
      if (foodItemData._id === undefined) {
        throw new RecoverableError(
          'No food item id found to search journal entries items with',
        );
      }
      const {entries, journalIdToPathMap} = getJournalEntriesWithFoodItemId(
        foodItemData._id,
      );
      if (entries.length) {
        realm.write(() => {
          entries.forEach(entry => {
            const paths = journalIdToPathMap[entry._id.toHexString()];
            if (paths !== undefined) {
              paths.forEach(([mealIdx, itemIdx]) => {
                const oldMeal = entry.meals[mealIdx];
                const oldItem = oldMeal.items[itemIdx];
                const newItemData: InitConsumedFoodItemData = {
                  itemData: foodItemData,
                  itemId: foodItemData._id,
                  quantity: oldItem.quantity,
                  // TODO: if I can figure out a decent solution for inhereting from enums fix this
                  unitOfMeasurement:
                    oldItem.unitOfMeasurement as unknown as ServingUnitOfMeasurement,
                };
                entry.meals[mealIdx].items[itemIdx] = ConsumedFoodItem.generate(
                  newItemData,
                ) as ConsumedFoodItem;
              });
            }
          });
        });
      }
    },
    [getJournalEntriesWithFoodItemId, realm],
  );

  const contextValue = React.useMemo(() => {
    return {
      entries: [...entries],
      saveMeal,
      deleteMeal,
      saveConsumedFoodItem,
      deleteConsumedFoodItem,
      applyFoodItemGroup,
      updateEntriesWithFoodItem,
    };
  }, [
    applyFoodItemGroup,
    deleteConsumedFoodItem,
    deleteMeal,
    entries,
    saveConsumedFoodItem,
    saveMeal,
    updateEntriesWithFoodItem,
  ]);

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  );
};

export default withRealm(JournalProvider, 'realm', {updateOnChange: true});

export const useJournalContext = () => {
  const journalContext = React.useContext(JournalContext);
  if (journalContext === null) {
    throw new Error(
      'No JournalContext value found. Was useJournalContext() called outside of a JournalProvider?',
    );
  }
  return journalContext;
};
