import React from 'react';

import {Button, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import CurrentMacros from 'components/CurrentMacros';
import {USER_INFO} from 'navigation/Constants';
import {ProfileScreenNavigationProp} from 'navigation/RouteTypes';
import {useAuthContext} from 'providers/AuthProvider';
import {useUserContext} from 'providers/UserProvider';
import styles from 'styles';

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {user} = useUserContext();
  const {signOut} = useAuthContext();

  const macros = user.getCurrentMacros();
  const birthday = user.getBirthdayString();
  const height = user.getHeightString();
  const weight = user.getWeightString();

  return (
    <View style={styles.screen}>
      <Text>{`Name: ${user.name}`}</Text>
      <CurrentMacros macros={macros} />
      {!!birthday && <Text>{`Birthday: ${birthday}`}</Text>}
      {!!height && <Text>{height}</Text>}
      {!!weight && <Text>{weight}</Text>}
      <Button title="Update" onPress={() => navigation.navigate(USER_INFO)} />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default ProfileScreen;
