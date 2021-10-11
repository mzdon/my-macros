import React from 'react';

import Realm from 'realm';

import {useRealmApp} from 'useRealmApp';
import {CatastrophicError, RecoverableError} from 'utils/Errors';

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  realmUser: Realm.User | null;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

type Props = React.PropsWithChildren<{}>;

const AuthProvider = ({children}: Props): React.ReactElement<Props> => {
  const app = useRealmApp();
  const [realmUser, setRealmUser] = React.useState(app.currentUser);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const creds = Realm.Credentials.emailPassword(email, password);
      const nextUser = await app.logIn(creds);
      setRealmUser(nextUser);
    } catch (e) {
      console.log('signIn');
      if (e instanceof Error) {
        throw new RecoverableError(e.message);
      }
      throw e;
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      await app.emailPasswordAuth.registerUser(email, password);
      signIn(email, password);
    } catch (e) {
      console.log('signUp');
      if (e instanceof Error) {
        throw new RecoverableError(e.message);
      }
      throw e;
    }
  };

  const signOut = async () => {
    if (realmUser === null) {
      console.warn("Not logged in. Can't log out.");
      return;
    }
    try {
      await realmUser.logOut();
      setRealmUser(null);
    } catch (e) {
      console.log('signOut');
      if (e instanceof Error) {
        throw new RecoverableError(e.message);
      }
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
        realmUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => {
  const authContext = React.useContext(AuthContext);
  if (authContext === null) {
    throw new CatastrophicError(
      'No AuthContext value found. Was useAuthContext() called outside of an AuthProvider?',
    );
  }
  return authContext;
};
