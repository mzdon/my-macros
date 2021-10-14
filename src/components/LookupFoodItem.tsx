import React from 'react';

import {Button} from 'react-native';
import {withRealm} from 'react-realm-context';
import {Results} from 'realm';

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
      .filtered('userId == $0 && description CONTAINS[c] $1', user._id, search)
      .sorted('description');
    setResults(qResult);
  }, [realm, search, user]);

  return (
    <>
      <TextInput
        placeholder="Lookup Food Item..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && <SearchResults items={results} onPress={selectFoodItem} />}
      <Spacer />
      <Button title="New Food Item" onPress={addNewFoodItem} />
    </>
  );
};

export default withRealm(LookupFoodItem);
