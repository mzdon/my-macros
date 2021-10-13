import React from 'react';

import {Button, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import MarbledBackground from 'components/MarbledBackground';
import {useAuthContext} from 'providers/AuthProvider';
import styles from 'styles';
import {RecoverableError, useSafeAsyncCall} from 'utils/Errors';
import {
  emailErrorMessage,
  isValidEmail,
  isValidPassword,
  passwordErrorMessage,
  useValidateFields,
} from 'utils/Validators';

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
    <MarbledBackground>
      <View style={styles.screen}>
        <Text>Welcome to MyMacros</Text>
        <Spacer />
        <BaseTextInput
          placeholder="Email..."
          value={email}
          onChangeText={onChange.email}
          autoCapitalize="none"
          error={errors.email}
        />
        <Spacer />
        <BaseTextInput
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
      </View>
    </MarbledBackground>
  );
};

export default WelcomeScreen;
