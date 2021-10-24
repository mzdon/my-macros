import React from 'react';

import {UUID} from 'bson';
import Realm from 'realm';

import JournalEntry from 'schemas/JournalEntry';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {RecoverableError} from 'utils/Errors';

export const useQueryResultStateWithListener = <T>(
  realm: Realm,
  getResult: () => Realm.Results<T & Realm.Object>,
) => {
  const [currentResult, setCurrentResult] = React.useState<
    Realm.Results<T & Realm.Object>
  >(() => {
    const initialResult = getResult();

    const listener: Realm.CollectionChangeCallback<T & Realm.Object> = (
      _collection,
      changes,
    ) => {
      const isInTransaction = realm.isInTransaction;
      const {deletions, insertions, newModifications, oldModifications} =
        changes;
      if (
        !isInTransaction &&
        (deletions.length ||
          insertions.length ||
          newModifications.length ||
          oldModifications.length)
      ) {
        const newResult = getResult();
        initialResult.removeAllListeners();
        newResult.addListener(listener);
        setCurrentResult(newResult);
      }
    };
    initialResult.addListener(listener);

    return initialResult;
  });

  return currentResult;
};

function getUUID(id: UUID | string): UUID {
  return id instanceof UUID ? id : new UUID(id);
}

const useGetTypeById = <T extends Realm.Object>(realm: Realm, type: string) =>
  React.useCallback(
    (id: UUID | string) => {
      const uuid = getUUID(id);
      const result = realm.objectForPrimaryKey<T>(type, uuid);
      if (!result) {
        throw new RecoverableError(
          `No ${type} found with id ${uuid.toHexString()}`,
        );
      }
      return result;
    },
    [realm, type],
  );

export const useGetJournalEntryById = (realm: Realm) =>
  useGetTypeById<JournalEntry>(realm, 'JournalEntry');

export const useGetFoodItemById = (realm: Realm) =>
  useGetTypeById<FoodItem>(realm, 'FoodItem');

export const useGetFoodItemGroupById = (realm: Realm) =>
  useGetTypeById<FoodItemGroup>(realm, 'FoodItemGroup');

const useGetType = <T extends Realm.Object>(realm: Realm, type: string) => {
  return React.useCallback(() => {
    return realm.objects<T>(type);
  }, [realm, type]);
};

export const useGetFoodItems = (realm: Realm) =>
  useGetType<FoodItem>(realm, 'FoodItem');
export const useGetFoodItemGroups = (realm: Realm) =>
  useGetType<FoodItemGroup>(realm, 'FoodItemGroup');

export const useDeleteItem = <T extends Realm.Object = Realm.Object>(
  realm: Realm,
  before?: (obj: T) => void,
  after?: (obj: T) => void,
) => {
  return React.useCallback(
    (obj: T) => {
      realm.write(() => {
        before && before(obj);
        realm.delete(obj);
        after && after(obj);
      });
    },
    [realm, before, after],
  );
};

export const useGetFoodItemGroupsWithFoodItemId = (realm: Realm) => {
  return React.useCallback(
    (foodItemId: UUID) => {
      const groupIdToItemIndexesMap: Record<string, number[]> = {};
      const groups = realm.objects<FoodItemGroup>('FoodItemGroup').filter(
        (g: FoodItemGroup) =>
          !!g.foodItems.find((i, iIdx) => {
            const idMatch = i.itemId?.equals(foodItemId);
            if (idMatch) {
              const gId = g._id.toHexString();
              const mappedArray = groupIdToItemIndexesMap[gId] || [];
              mappedArray.push(iIdx);
              groupIdToItemIndexesMap[gId] = mappedArray;
              return true;
            }
            return false;
          }),
      );
      return {groups, groupIdToItemIndexesMap};
    },
    [realm],
  );
};

export const useGetJournalEntriesWithFoodItemId = (realm: Realm) => {
  return React.useCallback(
    (foodItemId: UUID) => {
      const journalIdToPathMap: Record<string, [number, number][]> = {};
      const entries = realm.objects<JournalEntry>('JournalEntry').filter(
        (e: JournalEntry) =>
          !!e.meals.find((m, mIdx) =>
            m.items.find((i, iIdx) => {
              const idMatch = i.itemId?.equals(foodItemId);
              if (idMatch) {
                const eId = e._id.toHexString();
                const mappedArray = journalIdToPathMap[eId] || [];
                mappedArray.push([mIdx, iIdx]);
                journalIdToPathMap[eId] = mappedArray;
                return true;
              }
              return false;
            }),
          ),
      );
      return {entries, journalIdToPathMap};
    },
    [realm],
  );
};
