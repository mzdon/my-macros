import React from 'react';

import {Button, View} from 'react-native';
import {withRealm} from 'react-realm-context';
import {Results} from 'realm';

import ClearSearch from 'components/ClearSearch';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import TextInput from 'components/TextInput';
import {useUserContext} from 'providers/UserProvider';
import FoodItemGroup from 'schemas/FoodItemGroup';

interface Props {
  realm: Realm;
  addNewFoodItemGroup: () => void;
  selectFoodItemGroup: (foodItemGroup: FoodItemGroup) => void;
}

const LookupFoodItemGroup = ({
  realm,
  addNewFoodItemGroup,
  selectFoodItemGroup,
}: Props): React.ReactElement<Props> => {
  const {user} = useUserContext();
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState<Results<FoodItemGroup> | null>(
    null,
  );

  React.useEffect(() => {
    if (!search) {
      setResults(null);
    }
    const qResult = realm
      .objects<FoodItemGroup>('FoodItemGroup')
      .filtered('description CONTAINS[c] $0', search)
      .sorted('description');
    setResults(qResult);
  }, [realm, search, user]);

  return (
    <View>
      <TextInput
        placeholder="Lookup Food Item Group..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && <ClearSearch onPress={setSearch} />}
      {!!search && (
        <SearchResults items={results} onPress={selectFoodItemGroup} />
      )}
      <Spacer />
      <Button title="New Food Item Group" onPress={addNewFoodItemGroup} />
    </View>
  );
};

export default withRealm(LookupFoodItemGroup);
