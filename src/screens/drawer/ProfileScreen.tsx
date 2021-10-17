import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text} from 'react-native';

import CurrentMacros from 'components/CurrentMacros';
import ScreenWrapper from 'components/ScreenWrapper';
import {USER_INFO} from 'navigation/Constants';
import {useAuthContext} from 'providers/AuthProvider';
import {useFoodCrudNavigationContext} from 'providers/FoodCrudNavigationProvider';
import {useUserContext} from 'providers/UserProvider';
import {
  useParentNavigation,
  useSetFoodCrudNavigationOptionsOnFocus,
} from 'utils/Navigation';
import {CatastrophicError} from 'utils/Errors';
import {ProfileScreenNavigationProp} from 'navigation/RouteTypes';

const headerOptions = {
  title: 'Profile',
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const parentNavigation = useParentNavigation();
  const foodCrudNavigation = useFoodCrudNavigationContext();
  const {user} = useUserContext();
  const {signOut} = useAuthContext();

  useSetFoodCrudNavigationOptionsOnFocus(
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
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

export default ProfileScreen;
