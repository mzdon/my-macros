/**
 * @format
 */

import React from 'react';

import {render} from '@testing-library/react-native';
import 'react-native';
import Config from 'react-native-config';

import App from 'App';
import {resetRealmApp} from 'useRealmApp';

const originalRealmAppId = Config.REALM_APP_ID;

function setup() {
  resetRealmApp();
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
  });
});
