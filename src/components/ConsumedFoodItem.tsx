import React from 'react';

import {Text} from 'react-native';
import ConsumedFoodItem, {
  InitConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';

type Props =
  | {
      item: ConsumedFoodItem;
      initItem?: never;
    }
  | {
      item?: never;
      initItem: InitConsumedFoodItemData;
    };

const ConsumedFoodItemComponent = ({
  item,
  initItem,
}: Props): React.ReactElement<Props> => {
  const itemName = item?.itemName || initItem?.item.description;
  const quantity = item?.quantity || initItem?.quantity;
  const uom = item?.unitOfMeasurement || initItem?.unitOfMeasurement;
  return (
    <>
      <Text>{`${itemName} - ${quantity}${uom}`}</Text>
    </>
  );
};

export default ConsumedFoodItemComponent;
