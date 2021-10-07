import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import CurrentMacros from 'components/CurrentMacros';
import {USER_INFO} from 'navigation/Constants';
import {useAuthContext} from 'providers/AuthProvider';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useUserContext} from 'providers/UserProvider';
import styles from 'styles';
import {
  useParentNavigation,
  useSetFoodCrudNavigationOptions,
} from 'utils/Navigation';
import {CatastrophicError} from 'utils/Errors';
import {ProfileScreenNavigationProp} from 'navigation/RouteTypes';

const headerOptions = {
  headerTitle: 'Profile',
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const parentNavigation = useParentNavigation();
  const foodCrudNavigation = useFoodCrudNavigationContext();
  const {user} = useUserContext();
  const {signOut} = useAuthContext();

  useSetFoodCrudNavigationOptions(
    navigation,
    foodCrudNavigation,
    headerOptions,
  );

  const macros = user.getCurrentMacros();
  if (!macros) {
    throw new CatastrophicError('There is no current macro definition');
  }

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
      <Button
        title="Update"
        onPress={() => parentNavigation?.navigate(USER_INFO)}
      />
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default ProfileScreen;
