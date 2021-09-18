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
  const calories = item?.calories || initItem?.item.calories;
  const carb = item?.carbs || initItem?.item.carbs;
  const protein = item?.protein || initItem?.item.protein;
  const fat = item?.fat || initItem?.item.fat;
  return (
    <>
      <Text>{`${itemName} - ${quantity}${uom}`}</Text>
      <Text>{`${calories}cal ${carb}c ${protein}p ${fat}f`}</Text>
    </>
  );
};

export default ConsumedFoodItemComponent;
