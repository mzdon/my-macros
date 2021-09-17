import React from 'react';

import {ActivityIndicator} from 'react-native';
import {RealmProvider, RealmInitializer} from 'react-realm-context';

import {useAuthContext} from 'providers/AuthProvider';
import ConsumedFoodItem from 'schemas/ConsumedFoodItem';
import FoodItem from 'schemas/FoodItem';
import FoodItemGroup from 'schemas/FoodItemGroup';
import Height from 'schemas/Height';
import JournalEntry from 'schemas/JournalEntry';
import MacroDefinition from 'schemas/MacroDefinition';
import Meal from 'schemas/Meal';
import User from 'schemas/User';
import WeighIn from 'schemas/WeighIn';

const Schema = [
  ConsumedFoodItem,
  FoodItem,
  FoodItemGroup,
  Height,
  JournalEntry,
  MacroDefinition,
  Meal,
  User,
  WeighIn,
];

type Props = React.PropsWithChildren<{}>;

const RlmProvider = ({children}: Props): React.ReactElement<Props> => {
  const {realmUser} = useAuthContext();

  if (!realmUser) {
    return <ActivityIndicator />;
  }

  return (
    // @ts-ignore not sure why schema is not defined as a prop on RealmProvider
    <RealmProvider schema={Schema} deleteRealmIfMigrationNeeded>
      <RealmInitializer>
        {({realm}) => {
          if (realmUser) {
            realm.create(User, User.generate({realmUserId: realmUser.id}));
          }
        }}
      </RealmInitializer>
      {children}
    </RealmProvider>
  );
};

export default RlmProvider;
