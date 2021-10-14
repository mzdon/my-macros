import React from 'react';

import {Button, StyleSheet, View} from 'react-native';

import CoverBackground from 'components/CoverBackground';
import CoverContent from 'components/CoverContent';
import CoverTextInput from 'components/input/CoverTextInput';
import ScreenWrapper from 'components/ScreenWrapper';
import Spacer from 'components/Spacer';
import Text from 'components/Text';
import {useAuthContext} from 'providers/AuthProvider';
import {RecoverableError, useSafeAsyncCall} from 'utils/Errors';
import {
  emailErrorMessage,
  isValidEmail,
  isValidPassword,
  passwordErrorMessage,
  useValidateFields,
} from 'utils/Validators';
import {defaultPadding} from 'styles';

const _styles = StyleSheet.create({
  contentSpacing: {
    marginHorizontal: defaultPadding * 3,
    marginTop: defaultPadding * 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const WelcomeScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn, signUp} = useAuthContext();
  const safeAsyncCall = useSafeAsyncCall<RecoverableError>(RecoverableError);
  const onSignIn = safeAsyncCall(() => signIn(email, password));
  const onSignUp = safeAsyncCall(() => signUp(email, password));

  const fieldValidators = React.useMemo(
    () => ({
      email: {
        isValid: isValidEmail,
        message: emailErrorMessage,
        value: email,
        onChange: setEmail,
      },
      password: {
        isValid: isValidPassword,
        message: passwordErrorMessage,
        value: password,
        onChange: setPassword,
      },
    }),
    [email, password],
  );

  const before = React.useMemo(
    () => ({
      onSignUp,
      onSignIn,
    }),
    [onSignIn, onSignUp],
  );

  const {errors, onChange, validateBefore} = useValidateFields(
    fieldValidators,
    before,
  );

  return (
    <CoverBackground>
      <ScreenWrapper>
        <View style={_styles.contentSpacing}>
          <CoverContent>
            <Text.CoverHeader>MY MACROS</Text.CoverHeader>
            <Spacer />
            <CoverTextInput
              placeholder="Email..."
              value={email}
              onChangeText={onChange.email}
              autoCapitalize="none"
              error={errors.email}
            />
            <Spacer />
            <CoverTextInput
              placeholder="Password..."
              value={password}
              onChangeText={onChange.password}
              autoCapitalize="none"
              secureTextEntry
              error={errors.password}
            />
            <Spacer />
            <Button title="Sign Up" onPress={validateBefore.onSignUp} />
            <Button title="Sign In" onPress={validateBefore.onSignIn} />
          </CoverContent>
        </View>
      </ScreenWrapper>
    </CoverBackground>
  );
};

export default WelcomeScreen;
