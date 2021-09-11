import React from 'react';

import {RealmConsumer} from 'react-realm-context';

import {useAuthContext} from 'providers/AuthProvider';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import User, {UserData} from 'schemas/User';
import {RecoverableError} from 'utils/Errors';
import {UpdateMode} from 'realm';

interface UserContextValue {
  user: User;
  updateUser: (updatedUser: UserData) => User;
  createFoodItem: (foodItem: FoodItemData) => FoodItem;
  updateFoodItem: (foodItem: FoodItem, foodItemData: FoodItemData) => FoodItem;
}

const UserContext = React.createContext<UserContextValue | null>(null);

type Props = React.PropsWithChildren<{}>;

const UserProvider = ({children}: Props): React.ReactElement<Props> => {
  const {realmUser, signOut} = useAuthContext();

  if (!realmUser) {
    throw new Error('User not logged in!');
  }

  const realmUserId = realmUser.id;

  return (
    <RealmConsumer updateOnChange={true}>
      {({realm}) => {
        function getUser() {
          const user = realm
            .objects<User>('User')
            .find((u: User) => u.realmUserId === realmUserId);
          if (!user) {
            signOut();
            throw new Error(`'User<${realmUserId}> not found in realm!`);
          }
          return user;
        }

        const updateUser = (userData: UserData) => {
          const user = getUser();
          realm.write(() => {
            user.update(userData);
          });
          return getUser();
        };

        const createFoodItem = (foodItemData: FoodItemData) => {
          const user = getUser();
          const foodItem = FoodItem.generate(foodItemData);
          realm.write(() => {
            realm.create('FoodItem', foodItem);
            user.addFoodItem(foodItem._id);
          });
          const createdFoodItem = realm
            .objects<FoodItem>('FoodItem')
            .find((f: FoodItem) => f._id.equals(foodItem._id));
          if (!createdFoodItem) {
            throw new RecoverableError(
              `Did not find newly created FoodItem<${foodItem._id.toHexString()}>`,
            );
          }
          return createdFoodItem;
        };

        const updateFoodItem = (
          foodItem: FoodItem,
          foodItemData: FoodItemData,
        ) => {
          let result: FoodItem;
          realm.write(() => {
            result = realm.create(
              FoodItem,
              FoodItem.generate({
                ...foodItem,
                ...foodItemData,
              }),
              UpdateMode.Modified,
            );
          });
          // @ts-ignore
          return result;
        };

        const userContextValue = {
          user: getUser(),
          updateUser,
          createFoodItem,
          updateFoodItem,
        };
        return (
          <UserContext.Provider value={userContextValue}>
            {children}
          </UserContext.Provider>
        );
      }}
    </RealmConsumer>
  );
};

export default UserProvider;

export const useUserContext = (): UserContextValue => {
  const userContextValue = React.useContext(UserContext);
  if (userContextValue === null) {
    throw new Error(
      'No UserContext value found. Was useUserContext() called outside of a UserProvider?',
    );
  }
  return userContextValue;
};
