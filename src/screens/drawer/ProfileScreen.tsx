import React from 'react';

import {Button, Text} from 'react-native';

import CurrentMacros from 'components/CurrentMacros';
import ScreenWrapper from 'components/ScreenWrapper';
import {USER_INFO} from 'navigation/Constants';
import {useAuthContext} from 'providers/AuthProvider';
import {useUserContext} from 'providers/UserProvider';
import {useParentNavigation} from 'utils/Navigation';
import {CatastrophicError} from 'utils/Errors';

const ProfileScreen = () => {
  const parentNavigation = useParentNavigation();
  const {user} = useUserContext();
  const {signOut} = useAuthContext();

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
