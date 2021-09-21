import React from 'react';

import {UUID} from 'bson';
import Realm from 'realm';

import JournalEntry from 'schemas/JournalEntry';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import {RecoverableError} from 'utils/Errors';

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
