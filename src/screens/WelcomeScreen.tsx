import React from 'react';

import {Button, Text, View} from 'react-native';

import BaseTextInput from 'components/BaseTextInput';
import Spacer from 'components/Spacer';
import {useAuthContext} from 'providers/AuthProvider';
import {useSafeAsyncCall} from 'utils/Errors';
import styles from 'styles';

const WelcomeScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const safeAsyncCall = useSafeAsyncCall();

  const {signIn, signUp} = useAuthContext();
  const onSignIn = safeAsyncCall(() => signIn(email, password));
  const onSignUp = safeAsyncCall(() => signUp(email, password));

  return (
    <View style={styles.screen}>
      <Text>Welcome to MyMacros</Text>
      <Spacer />
      <BaseTextInput
        placeholder="Email..."
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Spacer />
      <BaseTextInput
        placeholder="Password..."
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <Spacer />
      <Button title="Sign Up" onPress={onSignUp} />
      <Button title="Sign In" onPress={onSignIn} />
    </View>
  );
};

export default WelcomeScreen;
