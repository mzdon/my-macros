import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {Button, Text, View} from 'react-native';

import {PROFILE} from 'navigation/Constants';
import {DateSelectorScreenNavigationProp} from 'navigation/RouteTypes';
import styles from 'styles';

const ProfileButton = () => {
  const navigation = useNavigation<DateSelectorScreenNavigationProp>();
  return (
    <Button title="Profile" onPress={() => navigation.navigate(PROFILE)} />
  );
};

const WideViewScreen = () => {
  const navigation = useNavigation<DateSelectorScreenNavigationProp>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pick A Date',
      headerRight: () => <ProfileButton />,
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text>Wide View</Text>
    </View>
  );
};

export default WideViewScreen;
