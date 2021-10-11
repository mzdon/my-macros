import Config from 'react-native-config';
import Realm from 'realm';

let app: Realm.App | undefined;

export function useRealmApp() {
  if (app === undefined) {
    app = new Realm.App(Config.REALM_APP_ID);
  }
  return app;
}

export function resetRealm(realmPath: string) {
  if (!app) {
    throw new Error('No app to initiate client reset on');
  }
  Realm.App.Sync.initiateClientReset(app, realmPath);
}

export function resetRealmApp() {
  app = undefined;
}
