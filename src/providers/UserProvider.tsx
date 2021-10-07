import React from 'react';

import {RealmConsumer} from 'react-realm-context';

import {useAuthContext} from 'providers/AuthProvider';
import User, {UserData} from 'schemas/User';

interface UserContextValue {
  user: User;
  updateUser: (updatedUser: UserData) => User;
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
        const queryUser = () =>
          realm
            .objects<User>('User')
            .find((u: User) => u.realmUserId === realmUserId);

        function getUser() {
          let user = queryUser();
          if (!user) {
            realm.write(() => {
              realm.create(User, User.generate({realmUserId}));
            });
            user = queryUser();
          }

          if (!user) {
            signOut();
            throw new Error(`'User<${realmUserId}> not found in realm!`);
          }

          return user;
        }

        const updateUser = (userData: UserData) => {
          const user = getUser();
          realm.write(() => {
            user.updateData(userData);
          });
          return getUser();
        };

        const userContextValue = {
          user: getUser(),
          updateUser,
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
