import React from 'react';

import {Button} from 'react-native';
import {RealmQuery} from 'react-realm-context';

import BaseTextInput from 'components/BaseTextInput';
import SearchResults from 'components/SearchResults';
import Spacer from 'components/Spacer';
import FoodItem from 'schemas/FoodItem';

interface Props {
  addNewFoodItem: () => void;
  selectFoodItem: (foodItem: FoodItem) => void;
}

const LookupFoodItem = ({
  addNewFoodItem,
  selectFoodItem,
}: Props): React.ReactElement<Props> => {
  const [search, setSearch] = React.useState('');

  const foodFilter = `description CONTAINS[c] "${search}"`;

  return (
    <>
      <BaseTextInput
        placeholder="Lookup Food Item..."
        value={search}
        onChangeText={setSearch}
      />
      {!!search && (
        <RealmQuery type="FoodItem" filter={foodFilter} sort="description">
          {({results}) => (
            <SearchResults items={results} onPress={selectFoodItem} />
          )}
        </RealmQuery>
      )}
      <Spacer />
      <Button title="New Food Item" onPress={addNewFoodItem} />
    </>
  );
};

export default LookupFoodItem;
