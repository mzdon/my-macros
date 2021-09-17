import React from 'react';

import {Button} from 'react-native';
import {RealmQuery} from 'react-realm-context';

import BaseTextInput from 'components/BaseTextInput';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import FoodItemGroup from 'schemas/FoodItemGroup';

interface Props {
  addNewFoodItemGroup: () => void;
  selectFoodItemGroup: (foodItemGroup: FoodItemGroup) => void;
}

const LookupFoodItemGroup = ({
  addNewFoodItemGroup,
  selectFoodItemGroup,
}: Props): React.ReactElement<Props> => {
  const [search, setSearch] = React.useState('');

  const foodFilter = `description CONTAINS[c] "${search}"`;

  return (
    <>
      <BaseTextInput
        placeholder="Lookup Food Item Group..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && (
        <RealmQuery type="FoodItemGroup" filter={foodFilter} sort="description">
          {({results}) => (
            <SearchResults items={results} onPress={selectFoodItemGroup} />
          )}
        </RealmQuery>
      )}
      <Spacer />
      <Button title="New Food Item Group" onPress={addNewFoodItemGroup} />
    </>
  );
};

export default LookupFoodItemGroup;
