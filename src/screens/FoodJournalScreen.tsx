import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import Meal from 'components/Meal';
import Spacer from 'components/Spacer';
import Stats from 'components/Stats';
import {ADD_MEAL, DATE_SELECTOR} from 'navigation/Constants';
import {
  JournalScreenNavigationProp,
  JournalScreenRouteProp,
} from 'navigation/RouteTypes';
import {useJournalContext} from 'providers/JournalProvider';
import {useUserContext} from 'providers/UserProvider';
import styles from 'styles';

const ChangeDateButton = () => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  return (
    <Button
      title="Change Date"
      onPress={() => navigation.navigate(DATE_SELECTOR)}
    />
  );
};

interface Props {
  date: string;
}

const AddMealButton = ({date}: Props) => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  return (
    <Button
      title="Add Meal"
      onPress={() => navigation.navigate(ADD_MEAL, {date})}
    />
  );
};

const FoodJournalScreen = () => {
  const {
    params: {date},
  } = useRoute<JournalScreenRouteProp>();
  const {user} = useUserContext();
  const {todaysEntry} = useJournalContext();
  const navigation = useNavigation<JournalScreenNavigationProp>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: date,
      headerLeft: () => <ChangeDateButton />,
      headerRight: () => <AddMealButton date={date} />,
    });
  }, [navigation, date]);

  const macros = user.getCurrentMacros();

  return (
    <ScrollView style={styles.screen}>
      <Stats macros={macros} meals={todaysEntry?.meals} />
      <Spacer />
      {!!todaysEntry &&
        todaysEntry.meals.map(m => (
          <View key={`${m.description}${m.order}`}>
            <Meal journalEntryId={todaysEntry._id} meal={m} />
            <Spacer />
          </View>
        ))}
    </ScrollView>
  );
};

export default FoodJournalScreen;
