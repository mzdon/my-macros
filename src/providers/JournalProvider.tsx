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
  createMeal: (date: string, description: string) => Meal;
  createConsumedFoodItem: (
    entryId: string,
    mealIndex: number,
    consumedFoodItem: ConsumedFoodItemData,
  ) => ConsumedFoodItem;
}

const JournalContext = React.createContext<JournalContext | null>(null);

type Props = React.PropsWithChildren<{}>;

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
          return realm
            .objects<JournalEntry>('JournalEntry')
            .filtered('userId == $0', userId)
            .find(entry => entry._id.equals(uuid));
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

        const createMeal = (date: string, description: string) => {
          const d = new Date(date);
          const entry = getEntryForDate(d);
          let order = 0;
          if (entry) {
            entry.meals.forEach(m => {
              if (m.order > order) {
                order = m.order;
              }
            });
            order += 1;
          }
          const newMeal = {description, order};
          const meals = entry ? [...entry.meals, newMeal] : [newMeal];
          const entryData = {userId, date: d, meals, id: entry?._id};

          let result: JournalEntry;
          realm.write(() => {
            result = realm.create<JournalEntry>(
              JournalEntry,
              // @ts-ignore
              JournalEntry.generate(entryData),
              UpdateMode.Modified,
            );
          });

          // @ts-ignore
          if (!result) {
            throw new RecoverableError(
              "No JournalEntry returned from 'realm.create'",
            );
          }
          const meal = result.meals.find(m => m.order === order);
          if (!meal) {
            throw new RecoverableError(`Could not find Meal<order: ${order}>`);
          }
          return meal;
        };

        const createConsumedFoodItem = (
          journalEntryId: string,
          mealIndex: number,
          consumedFoodItemData: ConsumedFoodItemData,
        ) => {
          const entry = getEntryById(new UUID(journalEntryId));
          if (!entry) {
            throw new RecoverableError(
              `Could not find JournalEntry<${journalEntryId}>`,
            );
          }
          const idx = entry.meals.findIndex(m => m.order === mealIndex);
          if (idx === -1) {
            throw new RecoverableError(
              `Meal ${idx} not found on journal entry!`,
            );
          }

          const existingMeal = entry.meals[idx];
          const newMeal = {
            description: existingMeal.description,
            order: existingMeal.order,
            items: [...existingMeal.items, consumedFoodItemData],
          };

          const meals = [
            ...entry.meals.slice(0, idx),
            newMeal,
            ...entry.meals.slice(idx + 1),
          ];

          const entryData = {
            id: entry._id,
            userId: entry.userId,
            date: entry.date,
            meals,
          };

          let result: JournalEntry;
          realm.write(() => {
            result = realm.create(
              JournalEntry,
              // @ts-ignore
              JournalEntry.generate(entryData),
              UpdateMode.Modified,
            );
          });

          // @ts-ignore
          if (!result) {
            throw new RecoverableError(
              "No JournalEntry returned from 'realm.create'",
            );
          }
          const meal = result.meals.find(m => m.order === mealIndex);
          if (!meal) {
            throw new RecoverableError(
              `Could not find Meal<order: ${mealIndex}>`,
            );
          }
          return meal.items[meal.items.length - 1];
        };

        return (
          <JournalContext.Provider
            value={{
              todaysEntry,
              getEntries,
              createMeal,
              createConsumedFoodItem,
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
