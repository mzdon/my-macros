import React from 'react';

import {render} from '@testing-library/react-native';
import 'react-native';
import Config from 'react-native-config';
import Realm from 'realm';

import App from 'App';
import {resetRealmApp, useRealmApp} from 'useRealmApp';
import {UserModelFactory} from 'schemas/User';

const originalRealmAppId = Config.REALM_APP_ID;

function setup(seedRealmApp?: () => void) {
  resetRealmApp();
  seedRealmApp && seedRealmApp();
  return render(<App />);
}

describe('rendering the root level App component', () => {
  afterEach(() => {
    // TOOD: not stoked on how I'm doing this...
    Config.REALM_APP_ID = originalRealmAppId;
    jest.restoreAllMocks();
  });

  describe('when REALM_APP_ID is not configured', () => {
    it('should render an error boundary', () => {
      // keep errors and logs quiet for this test
      const error = jest.spyOn(console, 'error');
      error.mockImplementationOnce(() => undefined);
      const log = jest.spyOn(console, 'log');
      log.mockImplementation(() => undefined);

      Config.REALM_APP_ID = '';
      const renderer = setup();

      // the error thrown by Realm.App()
      expect(
        renderer.getAllByText(
          'Expected either a configuration object or an app id string.',
        ),
      ).toHaveLength(1);
      // error boundary reset button
      expect(renderer.getAllByText('Reset')).toHaveLength(1);
    });
  });

  describe('when REALM_APP_ID is configured', () => {
    describe('when there is no current user', () => {
      it('renders then welcome screen', () => {
        const renderer = setup();
        // the sign up button
        expect(renderer.getAllByText('Sign Up')).toHaveLength(1);
        // the sign in button
        expect(renderer.getAllByText('Sign In')).toHaveLength(1);
      });
    });

    describe('where there is a current user', () => {
      describe('who is missing a name or macro definition', () => {
        it('should render the user info flow', () => {
          const seedRealmApp = () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const app = useRealmApp();
            // @ts-ignore
            app.currentUser = {id: 'realm-user-id'};
          };
          const renderer = setup(seedRealmApp);
          expect(renderer.getAllByText('Name')).toHaveLength(1);
          expect(renderer.getAllByText('Birthday (optional)')).toHaveLength(1);
        });
      });

      describe('who has a name and at least one macro definition defined', () => {
        it('should render the journal screen', () => {
          // how do I seed Realm data?
          const user = UserModelFactory.build();
          // @ts-ignore
          Realm.seededData = {
            User: {
              [user._id.toHexString()]: user,
            },
          };
          const seedRealmApp = () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const app = useRealmApp();
            // @ts-ignore
            app.currentUser = {id: user.realmUserId};
          };
          const renderer = setup(seedRealmApp);
          // tab nav
          expect(renderer.getAllByText('Journal')).toHaveLength(1);
          expect(renderer.getAllByText('FoodEditor')).toHaveLength(1);
          expect(renderer.getAllByText('Profile')).toHaveLength(1);
        });
      });
    });
  });
});
