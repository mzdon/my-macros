import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import Container from 'components/Container';
import CurrentMacros from 'components/CurrentMacros';
import ItemSeparator from 'components/ItemSeparator';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import Text from 'components/Text';
import {USER_INFO} from 'navigation/Constants';
import {useAuthContext} from 'providers/AuthProvider';
import {useUserContext} from 'providers/UserProvider';
import {useParentNavigation} from 'utils/Navigation';
import {CatastrophicError} from 'utils/Errors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const parentNavigation = useParentNavigation();
  const {user} = useUserContext();
  const {signOut} = useAuthContext();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <Button title="Sign Out" onPress={signOut} />;
      },
    });
  });

  const onPressUpdate = React.useCallback(
    () => parentNavigation.navigate(USER_INFO),
    [parentNavigation],
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
      <Container>
        <Spacer />
        <Text.SubHeader>{`Name: ${user.name}`}</Text.SubHeader>
        {!!birthday && <Text>{`Birthday: ${birthday}`}</Text>}
        {!!height && <Text>{`Height: ${height}`}</Text>}
        {!!weight && <Text>{`Weight: ${weight}`}</Text>}
        <Spacer />
      </Container>
      <ItemSeparator />
      <Container>
        <Spacer />
        <CurrentMacros macros={macros} />
        <Spacer />
      </Container>
      <ItemSeparator />
      <Button title="Update" onPress={onPressUpdate} />
      <ItemSeparator />
    </ScreenWrapper>
  );
};

export default ProfileScreen;
