import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button} from 'react-native';

import BirthdayInput from 'components/BirthdayInput';
import Container from 'components/Container';
import HeightInput from 'components/HeightInput';
import RadioButtons from 'components/RadioButtons';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import TextInput from 'components/TextInput';
import WeightInput from 'components/WeightInput';
import {USER_INFO_STEP_2} from 'navigation/Constants';
import {UserInfoStep1NavigationProp} from 'navigation/RouteTypes';
import {useUserInfoContext} from 'providers/UserInfoProvider';
import {MeasurementSystem} from 'types/MeasurementSystem';
import {UserData} from 'schemas/User';
import {useStateUpdater} from 'utils/State';
import {
  birthdayErrorMessage,
  isValidBirthday,
  isValidRequiredString,
  requiredErrorMessage,
  useValidateFields,
} from 'utils/Validators';

const UserInfoStep1Screen = (): React.ReactElement => {
  const navigation = useNavigation<UserInfoStep1NavigationProp>();
  const {userData, updateUserData} = useUserInfoContext();
  const {name, birthday, measurementSystem, height, weight} = userData;

  const updater = useStateUpdater<UserData>(updateUserData);
  const {
    updateName,
    updateBirthday,
    updateMeasurementSystem,
    updateHeight,
    updateWeight,
  } = React.useMemo(
    () => ({
      updateName: updater('name'),
      updateBirthday: updater('birthday'),
      updateMeasurementSystem: updater('measurementSystem'),
      updateHeight: updater('height'),
      updateWeight: updater('weight'),
    }),
    [updater],
  );

  const fieldValidators = React.useMemo(
    () => ({
      name: {
        isValid: isValidRequiredString,
        message: requiredErrorMessage('name'),
        value: name,
        onChange: updateName,
      },
      birthday: {
        isValid: isValidBirthday,
        message: birthdayErrorMessage,
        value: birthday,
        onChange: updateBirthday,
      },
    }),
    [name, updateName, birthday, updateBirthday],
  );

  const before = React.useMemo(
    () => ({
      onNext: () => navigation.navigate(USER_INFO_STEP_2),
    }),
    [navigation],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'User Info',
      headerRight: () => (
        <Button title="Next" onPress={validateBefore.onNext} />
      ),
    });
  });

  return (
    <ScreenWrapper>
      <Container>
        <Spacer />
        <TextInput
          label="Name"
          value={name}
          placeholder="Name"
          onChangeText={onChange.name}
          error={errors.name}
        />
        <Spacer />
        <BirthdayInput
          value={birthday}
          onChangeText={onChange.birthday}
          error={errors.birthday}
        />
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
        <Spacer />
        <WeightInput
          value={weight}
          measurementSystem={measurementSystem}
          onChangeText={updateWeight}
        />
        <Spacer />
      </Container>
    </ScreenWrapper>
  );
};

export default UserInfoStep1Screen;
