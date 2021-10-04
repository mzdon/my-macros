import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {InitFoodItemData} from 'schemas/FoodItem';
import Meal from 'schemas/Meal';
import {isSameDay} from 'utils/Date';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import {
  useDeleteItem,
  useGetJournalEntriesWithFoodItemId,
  useGetJournalEntryById,
} from 'utils/Queries';

interface JournalContext {
  entries: JournalEntry[];
  saveMeal: (date: Date, description: string, order?: number) => void;
  deleteMeal: (meal: Meal) => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIndex: number,
    consumedFoodItem: ConsumedFoodItem,
    itemIndex?: number,
  ) => void;
  deleteConsumedFoodItem: (item: ConsumedFoodItem) => void;
  applyFoodItemGroup: (
    entryId: string,
    mealIndex: number,
    group: FoodItemGroup,
  ) => void;
  updateEntriesWithFoodItem: (foodItemData: InitFoodItemData) => void;
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

  const userId = user._id;

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

  const getEntries = React.useCallback(() => {
    return realm.objects<JournalEntry>('JournalEntry').sorted('date');
  }, [realm]);

  const saveMeal = React.useCallback(
    (date: Date, description: string, mealIndex?: number) => {
      const entry = getEntryForDate(date);
      let meals = entry ? [...entry.meals] : [];
      if (mealIndex === undefined) {
        const newMeal = {description};
        // @ts-ignore
        meals.push(newMeal);
      } else {
        // @ts-ignore
        meals = meals.map((meal, idx) => {
          if (idx === mealIndex) {
            return {items: meal.items, description};
          }
          return meal;
        });
      }

      const entryData = {userId, date, meals, id: entry?._id};
      realm.write(() => {
        realm.create<JournalEntry>(
          JournalEntry,
          // @ts-ignore
          JournalEntry.generate(entryData),
          UpdateMode.Modified,
        );
      });
    },
    [getEntryForDate, realm, userId],
  );

  const deleteMeal = useDeleteItem<Meal>(realm);

  const saveConsumedFoodItem = React.useCallback(
    (
      journalEntryId: string,
      mealIndex: number,
      consumedFoodItem: ConsumedFoodItem,
      itemIndex?: number,
    ) => {
      const entry = getEntryById(new UUID(journalEntryId));
      const existingMeal = getMealFromEntry(entry, mealIndex);
      realm.write(() => {
        if (itemIndex !== undefined) {
          existingMeal.items[itemIndex] = consumedFoodItem.clone();
        } else {
          existingMeal.items.push(consumedFoodItem.clone());
        }
      });
    },
    [getEntryById, realm],
  );

  const deleteConsumedFoodItem = useDeleteItem<ConsumedFoodItem>(realm);

  const applyFoodItemGroup = React.useCallback(
    (entryId: string, mealIdx: number, group: FoodItemGroup) => {
      group.foodItems.forEach(foodItem => {
        saveConsumedFoodItem(entryId, mealIdx, foodItem);
      });
    },
    [saveConsumedFoodItem],
  );

  const updateEntriesWithFoodItem = React.useCallback(
    (foodItemData: InitFoodItemData) => {
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
                  item: foodItemData,
                  quantity: oldItem.quantity,
                  unitOfMeasurement: oldItem.unitOfMeasurement,
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
      entries: [...getEntries()],
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
    getEntries,
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

export default withRealm(JournalProvider);

export const useJournalContext = () => {
  const journalContext = React.useContext(JournalContext);
  if (journalContext === null) {
    throw new Error(
      'No JournalContext value found. Was useJournalContext() called outside of a JournalProvider?',
    );
  }
  return journalContext;
};
