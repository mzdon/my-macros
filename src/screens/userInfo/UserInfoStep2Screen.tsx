import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';

import MacroDefinitionsInput from 'components/MacroDefinitionsInput';
import {
  UserInfoNavigationProp,
  UserInfoStep2NavigationProp,
} from 'navigation/RouteTypes';
import {useUserInfoContext} from 'providers/UserInfoProvider';
import {UserData} from 'schemas/User';
import styles from 'styles';
import {DRAWER} from 'navigation/Constants';

const UserInfoStep2Screen = (): React.ReactElement => {
  const navigation = useNavigation<UserInfoStep2NavigationProp>();
  const {userData, updateUserData, saveUser} = useUserInfoContext();
  const {macroDefinition} = userData;

  React.useLayoutEffect(() => {
    const onSave = () => {
      saveUser();
      navigation.getParent<UserInfoNavigationProp>().replace(DRAWER);
    };
    navigation.setOptions({
      headerRight: () => <Button title="Save" onPress={onSave} />,
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
    <View style={styles.screen}>
      <MacroDefinitionsInput
        value={macroDefinition}
        onChange={updateMacroDefinition}
      />
    </View>
  );
};

export default UserInfoStep2Screen;
