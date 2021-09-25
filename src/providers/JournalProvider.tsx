import React from 'react';

import {UUID} from 'bson';
import {withRealm} from 'react-realm-context';
import {UpdateMode} from 'realm';

import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
  ReturnedConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import FoodItemGroup from 'schemas/FoodItemGroup';
import Meal from 'schemas/Meal';
import {isSameDay} from 'utils/Date';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import {
  useDeleteItem,
  useGetFoodItemById,
  useGetJournalEntryById,
} from 'utils/Queries';

interface JournalContext {
  entries: JournalEntry[];
  saveMeal: (date: Date, description: string, order?: number) => void;
  deleteMeal: (meal: Meal) => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIndex: number,
    consumedFoodItem: InitConsumedFoodItemData | ReturnedConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  deleteConsumedFoodItem: (item: ConsumedFoodItem) => void;
  applyFoodItemGroup: (
    entryId: string,
    mealIndex: number,
    group: FoodItemGroup,
  ) => void;
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
  const getFoodItemById = useGetFoodItemById(realm);

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
      consumedFoodItemData:
        | InitConsumedFoodItemData
        | ReturnedConsumedFoodItemData,
      itemIndex?: number,
    ) => {
      const entry = getEntryById(new UUID(journalEntryId));
      const existingMeal = getMealFromEntry(entry, mealIndex);
      let newItems;
      if (itemIndex === undefined) {
        newItems = [...existingMeal.items, consumedFoodItemData];
      } else {
        newItems = [
          ...existingMeal.items.slice(0, itemIndex),
          consumedFoodItemData,
          ...existingMeal.items.slice(itemIndex + 1),
        ];
      }
      const newMeals = [
        ...entry.meals.slice(0, mealIndex),
        {
          description: existingMeal.description,
          items: newItems,
        },
        ...entry.meals.slice(mealIndex + 1),
      ];
      const entryData = {
        id: entry._id,
        userId: entry.userId,
        date: entry.date,
        meals: newMeals,
      };

      realm.write(() => {
        realm.create(
          JournalEntry,
          // @ts-ignore
          JournalEntry.generate(entryData),
          UpdateMode.Modified,
        );
      });
    },
    [getEntryById, realm],
  );

  const deleteConsumedFoodItem = useDeleteItem<ConsumedFoodItem>(realm);

  const hydrateConsumedFoodItem = React.useCallback(
    (data: ReturnedConsumedFoodItemData): InitConsumedFoodItemData => {
      return {
        ...data,
        item: getFoodItemById(data.item._id).getData(),
      };
    },
    [getFoodItemById],
  );

  const applyFoodItemGroup = React.useCallback(
    (entryId: string, mealIdx: number, group: FoodItemGroup) => {
      group.foodItems.forEach(foodItem => {
        const consumedFoodItem = hydrateConsumedFoodItem(foodItem.getData());
        saveConsumedFoodItem(entryId, mealIdx, consumedFoodItem);
      });
    },
    [hydrateConsumedFoodItem, saveConsumedFoodItem],
  );

  const contextValue = React.useMemo(() => {
    return {
      entries: [...getEntries()],
      saveMeal,
      deleteMeal,
      saveConsumedFoodItem,
      deleteConsumedFoodItem,
      applyFoodItemGroup,
    };
  }, [
    applyFoodItemGroup,
    deleteConsumedFoodItem,
    deleteMeal,
    getEntries,
    saveConsumedFoodItem,
    saveMeal,
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
