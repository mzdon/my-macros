import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, LayoutAnimation, StyleSheet, Text, View} from 'react-native';

import Spacer from 'components/Spacer';
import {DRAWER} from 'navigation/Constants';
import {UserInfoScreenNavigationProp} from 'navigation/RouteTypes';
import {useUserContext} from 'providers/UserProvider';
import MacroDefinition from 'schemas/MacroDefinition';
import User from 'schemas/User';
import UserInfoStep1 from 'screens/userInfo/UserInfoStep1';
import UserInfoStep2 from 'screens/userInfo/UserInfoStep2';
import styles from 'styles';

const _styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButtonContainer: {
    alignSelf: 'flex-end',
  },
});

const UserInfoScreen = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const {user, updateUser} = useUserContext();

  const [localUserData, setLocalUserData] = React.useState(user.getUserData());

  const updateLocalUserData = React.useCallback(
    data => {
      setLocalUserData({
        ...localUserData,
        ...data,
      });
    },
    [localUserData],
  );

  const onSaveUser = React.useCallback(() => {
    updateUser(localUserData);
  }, [updateUser, localUserData]);

  const [step, setStep] = React.useState(1);
  const updateStep = React.useCallback(nextStep => {
    LayoutAnimation.easeInEaseOut();
    setStep(nextStep);
  }, []);

  const title =
    step === 1
      ? 'Welcome to MyMacros'
      : `Welcome to MyMacros ${localUserData.name}`;

  const buttonTitle = step < 2 ? 'Next' : 'Start Tracking';

  const onSubmitStep = React.useCallback(async () => {
    if (step < 2) {
      updateStep(step + 1);
    } else {
      onSaveUser();
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace(DRAWER);
      }
    }
  }, [onSaveUser, updateStep, step, navigation]);

  const isDisabled =
    (step === 1 &&
      (!localUserData.name ||
        !User.isValidBirthdayString(localUserData.birthday))) ||
    (step === 2 &&
      !MacroDefinition.isValidDefinitionStrings(localUserData.macroDefinition));

  return (
    <View style={styles.screen}>
      <Text>{title}</Text>
      <Spacer />
      {step === 1 && (
        <UserInfoStep1 data={localUserData} onUpdate={updateLocalUserData} />
      )}
      {step === 2 && (
        <UserInfoStep2 data={localUserData} onUpdate={updateLocalUserData} />
      )}
      <View style={_styles.footer}>
        {step > 1 && (
          <Button title="Back" onPress={() => updateStep(step - 1)} />
        )}
        <View style={_styles.submitButtonContainer}>
          <Button
            title={buttonTitle}
            onPress={onSubmitStep}
            disabled={isDisabled}
          />
        </View>
      </View>
    </View>
  );
};

export default UserInfoScreen;
