import React from 'react';

import {Text} from 'react-native';
import ConsumedFoodItem from 'schemas/ConsumedFoodItem';

interface Props {
  item: ConsumedFoodItem;
}

const ConsumedFoodItemComponent = ({
  item,
}: Props): React.ReactElement<Props> => (
  <>
    <Text>{`${item.itemName} - ${item.quantity}${item.unitOfMeasurement}`}</Text>
  </>
);

export default ConsumedFoodItemComponent;
