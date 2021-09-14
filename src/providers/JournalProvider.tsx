import React from 'react';

import {UUID} from 'bson';
import {RealmConsumer} from 'react-realm-context';

import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import JournalEntry from 'schemas/JournalEntry';
import Meal from 'schemas/Meal';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import {isSameDay} from 'utils/Date';
import {UpdateMode} from 'realm';

interface JournalContext {
  todaysEntry: JournalEntry | null;
  getEntries: (startDate: Date, endDate: Date) => JournalEntry[];
  saveMeal: (date: string, description: string, order?: number) => void;
  deleteMeal: (meal: Meal) => void;
  saveConsumedFoodItem: (
    entryId: string,
    mealIndex: number,
    consumedFoodItem: ConsumedFoodItemData,
    itemIndex?: number,
  ) => void;
  deleteConsumedFoodItem: (item: ConsumedFoodItem) => void;
}

const JournalContext = React.createContext<JournalContext | null>(null);

type Props = React.PropsWithChildren<{}>;

function getMealFromEntry(entry: JournalEntry, mealIndex: number) {
  const meal = entry.meals[mealIndex];
  if (!meal) {
    throw new RecoverableError(
      `No meal at index: ${mealIndex} for JournalEntry<${entry._id.toHexString()}>`,
    );
  }
  return meal;
}

const JournalProvider = ({children}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();

  if (!user) {
    throw new CatastrophicError('No user available in JournalProvider');
  }

  const userId = user._id;
  const today = new Date(new Date().toDateString());

  return (
    <RealmConsumer updateOnChange={true}>
      {({realm}) => {
        const getEntryById = (uuid: UUID) => {
          const journalEntry = realm
            .objects<JournalEntry>('JournalEntry')
            .filtered('userId == $0', userId)
            .find(entry => entry._id.equals(uuid));
          if (!journalEntry) {
            throw new RecoverableError(
              `No JouranlEntry found with id: ${uuid.toHexString()}`,
            );
          }
          return journalEntry;
        };

        const getEntryForDate = (date: Date) => {
          return (
            realm
              .objects<JournalEntry>('JournalEntry')
              .filtered('userId == $0', userId)
              .find(entry => isSameDay(entry.date, date)) || null
          );
        };

        const todaysEntry = getEntryForDate(today);

        const getEntries = () => [];

        const saveMeal = (
          date: string,
          description: string,
          mealIndex?: number,
        ) => {
          const d = new Date(date);
          const entry = getEntryForDate(d);
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

          const entryData = {userId, date: d, meals, id: entry?._id};
          realm.write(() => {
            realm.create<JournalEntry>(
              JournalEntry,
              // @ts-ignore
              JournalEntry.generate(entryData),
              UpdateMode.Modified,
            );
          });
        };

        const deleteMeal = (meal: Meal) => {
          realm.write(() => {
            realm.delete(meal);
          });
        };

        const saveConsumedFoodItem = (
          journalEntryId: string,
          mealIndex: number,
          consumedFoodItemData: ConsumedFoodItemData,
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
        };

        const deleteConsumedFoodItem = (item: ConsumedFoodItem) => {
          realm.write(() => {
            realm.delete(item);
          });
        };

        return (
          <JournalContext.Provider
            value={{
              todaysEntry,
              getEntries,
              saveMeal,
              deleteMeal,
              saveConsumedFoodItem,
              deleteConsumedFoodItem,
            }}>
            {children}
          </JournalContext.Provider>
        );
      }}
    </RealmConsumer>
  );
};

export default JournalProvider;

export const useJournalContext = () => {
  const journalContext = React.useContext(JournalContext);
  if (journalContext === null) {
    throw new Error(
      'No JournalContext value found. Was useJournalContext() called outside of a JournalProvider?',
    );
  }
  return journalContext;
};
