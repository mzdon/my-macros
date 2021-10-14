import React from 'react';

import {useUserContext} from 'providers/UserProvider';
import {UserData} from 'schemas/User';
import {JustChildrenProps} from 'types/Common';

interface UserInfoContextValue {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  saveUser: () => void;
}

const UserInfoContext = React.createContext<UserInfoContextValue | null>(null);

const UserInfoProvider = ({
  children,
}: JustChildrenProps): React.ReactElement<JustChildrenProps> => {
  const {user, updateUser} = useUserContext();

  const [userData, setUserData] = React.useState(user.getUserData());

  const updateUserData = React.useCallback(
    (data: Partial<UserData>) => {
      setUserData({
        ...userData,
        ...data,
      });
    },
    [userData],
  );

  const saveUser = React.useCallback(() => {
    updateUser(userData);
  }, [updateUser, userData]);

  const value = React.useMemo(
    () => ({
      userData,
      updateUserData,
      saveUser,
    }),
    [saveUser, updateUserData, userData],
  );

  return (
    <UserInfoContext.Provider value={value}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;

export const useUserInfoContext = (): UserInfoContextValue => {
  const userInfoContextValue = React.useContext(UserInfoContext);
  if (userInfoContextValue === null) {
    throw new Error(
      'No UserInfoContext value found. Was useUserInfoContext() called outside of a UserInfoProvider?',
    );
  }
  return userInfoContextValue;
};
