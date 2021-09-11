/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import Realm from 'realm';
import App from './src/App';
import {name as appName} from './app.json';

global.Realm = Realm;

AppRegistry.registerComponent(appName, () => App);
