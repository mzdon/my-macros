import React from 'react';

import {Button} from 'react-native';
import {withRealm} from 'react-realm-context';
import {Results} from 'realm';

import PageTextInput from 'components/input/PageTextInput';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
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
      .filtered('userId == $0 && description CONTAINS[c] $1', user._id, search)
      .sorted('description');
    setResults(qResult);
  }, [realm, search, user]);

  return (
    <>
      <PageTextInput
        placeholder="Lookup Food Item Group..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && (
        <SearchResults items={results} onPress={selectFoodItemGroup} />
      )}
      <Spacer />
      <Button title="New Food Item Group" onPress={addNewFoodItemGroup} />
    </>
  );
};

export default withRealm(LookupFoodItemGroup);
