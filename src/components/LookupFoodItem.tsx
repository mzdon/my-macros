import React from 'react';

import {Button, View} from 'react-native';
import {withRealm} from 'react-realm-context';
import {Results} from 'realm';

import ClearSearch from 'components/ClearSearch';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import TextInput from 'components/TextInput';
import {useUserContext} from 'providers/UserProvider';
import FoodItem from 'schemas/FoodItem';

interface Props {
  realm: Realm;
  addNewFoodItem: () => void;
  selectFoodItem: (foodItem: FoodItem) => void;
}

const LookupFoodItem = ({
  realm,
  addNewFoodItem,
  selectFoodItem,
}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<Results<FoodItem> | null>(null);

  React.useEffect(() => {
    if (!search) {
      setResults(null);
    }
    const qResult = realm
      .objects<FoodItem>('FoodItem')
      .filtered('description CONTAINS[c] $0', search)
      .sorted('description');
    setResults(qResult);
  }, [realm, search, user]);

  return (
    <View>
      <TextInput
        placeholder="Lookup Food Item..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && <ClearSearch onPress={setSearch} />}
      {!!search && <SearchResults items={results} onPress={selectFoodItem} />}
      <Spacer />
      <Button title="New Food Item" onPress={addNewFoodItem} />
    </View>
  );
};

export default withRealm(LookupFoodItem);
