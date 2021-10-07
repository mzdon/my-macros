import Config from 'react-native-config';
import Realm from 'realm';

let app: Realm.App;

// Returns the shared instance of the Realm app.
export function getRealmApp() {
  if (app === undefined) {
    app = new Realm.App(Config.REALM_APP_ID);
  }
  return app;
}

export function resetRealm(realmPath: string) {
  Realm.App.Sync.initiateClientReset(app, realmPath);
}
