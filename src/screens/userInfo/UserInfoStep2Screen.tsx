import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import MacroDefinitionsInput from 'components/MacroDefinitionsInput';
import {UserInfoStep2NavigationProp} from 'navigation/RouteTypes';
import {useUserInfoContext} from 'providers/UserInfoProvider';
import {UserData} from 'schemas/User';

const UserInfoStep2Screen = (): React.ReactElement => {
  const navigation = useNavigation<UserInfoStep2NavigationProp>();
  const {userData, updateUserData, saveUser} = useUserInfoContext();
  const {macroDefinition} = userData;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={saveUser} />,
    });
  });

  const updater = React.useCallback(
    (key: keyof UserData) => {
      return (value: UserData[keyof UserData]) => {
        updateUserData({
          [key]: value,
        });
      };
    },
    [updateUserData],
  );
  const updateMacroDefinition = updater('macroDefinition');

  return (
    <MacroDefinitionsInput
      value={macroDefinition}
      onChange={updateMacroDefinition}
    />
  );
};

export default UserInfoStep2Screen;
