import React from 'react';

import {Button, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import {useAuthContext} from 'providers/AuthProvider';
import styles from 'styles';
import {useSafeAsyncCall} from 'utils/Errors';
import {
  emailErrorMessage,
  isValidEmail,
  isValidPassword,
  passwordErrorMessage,
  useValidateFields,
} from 'utils/Validators';

const fieldValidators = {
  email: {
    isValid: isValidEmail,
    message: emailErrorMessage,
  },
  password: {
    isValid: isValidPassword,
    message: passwordErrorMessage,
  },
};

const WelcomeScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const values = React.useRef<{[key in 'email' | 'password']: string}>({
    email,
    password,
  });
  values.current.email = email;
  values.current.password = password;

  const {signIn, signUp} = useAuthContext();
  const safeAsyncCall = useSafeAsyncCall();
  const onSignIn = safeAsyncCall(() => signIn(email, password));
  const onSignUp = safeAsyncCall(() => signUp(email, password));

  const validateBefore = React.useMemo(
    () => ({
      onSignUp,
      onSignIn,
    }),
    [onSignIn, onSignUp],
  );

  const validateAfter = React.useMemo(
    () => ({
      setEmail,
      setPassword,
    }),
    [],
  );

  const {
    errors,
    hasErrors,
    validateAfter: afterCallbacks,
    validateBefore: beforeCallbacks,
  } = useValidateFields(
    fieldValidators,
    values.current,
    validateBefore,
    validateAfter,
  );

  return (
    <View style={styles.screen}>
      <Text>Welcome to MyMacros</Text>
      <Spacer />
      <BaseTextInput
        placeholder="Email..."
        value={email}
        onChangeText={!hasErrors ? setEmail : afterCallbacks?.setEmail}
        autoCapitalize="none"
        error={errors.email}
      />
      <Spacer />
      <BaseTextInput
        placeholder="Password..."
        value={password}
        onChangeText={!hasErrors ? setPassword : afterCallbacks?.setPassword}
        autoCapitalize="none"
        secureTextEntry
        error={errors.password}
      />
      <Spacer />
      <Button title="Sign Up" onPress={beforeCallbacks?.onSignUp} />
      <Button title="Sign In" onPress={beforeCallbacks?.onSignIn} />
    </View>
  );
};

export default WelcomeScreen;
