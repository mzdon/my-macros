import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import BirthdayInput from 'components/BirthdayInput';
import HeightInput from 'components/HeightInput';
import RadioButtons from 'components/RadioButtons';
import Spacer from 'components/Spacer';
import WeightInput from 'components/WeightInput';
import {USER_INFO_STEP_2} from 'navigation/Constants';
import {UserInfoStep1NavigationProp} from 'navigation/RouteTypes';
import {useUserInfoContext} from 'providers/UserInfoProvider';
import {MeasurementSystem} from 'types/MeasurementSystem';
import {UserData} from 'schemas/User';
import styles from 'styles';

const UserInfoStep1Screen = (): React.ReactElement => {
  const navigation = useNavigation<UserInfoStep1NavigationProp>();
  const {userData, updateUserData} = useUserInfoContext();
  const {name, birthday, measurementSystem, height, weight} = userData;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          onPress={() => navigation.navigate(USER_INFO_STEP_2)}
        />
      ),
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

  const updateName = updater('name');
  const updateBirthday = updater('birthday');
  const updateMeasurementSystem = updater('measurementSystem');
  const updateHeight = updater('height');
  const updateWeight = updater('weight');

  return (
    <View style={styles.screen}>
      <BaseTextInput
        label="Name"
        value={name}
        placeholder="Name"
        onChangeText={updateName}
      />
      <Spacer />
      <BirthdayInput value={birthday} onChangeText={updateBirthday} />
      <Spacer />
      <RadioButtons
        label="Measurement System (optional)"
        optional
        values={[MeasurementSystem.Imperial, MeasurementSystem.Metric]}
        value={measurementSystem}
        onChange={updateMeasurementSystem}
      />
      <Spacer />
      <HeightInput
        value={height}
        measurementSystem={measurementSystem}
        onChangeText={updateHeight}
      />
      <WeightInput
        value={weight}
        measurementSystem={measurementSystem}
        onChangeText={updateWeight}
      />
    </View>
  );
};

export default UserInfoStep1Screen;
