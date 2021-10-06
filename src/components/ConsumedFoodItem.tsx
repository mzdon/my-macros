import React from 'react';

import {Text} from 'react-native';
import ConsumedFoodItem, {
  ConsumedFoodItemData,
  InitConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';

type Props =
  | {
      item: ConsumedFoodItem | ConsumedFoodItemData;
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
  const description = item?.description ?? initItem?.itemData.description;
  const quantity = item?.quantity ?? initItem?.quantity;
  const uom = item?.unitOfMeasurement ?? initItem?.unitOfMeasurement;
  const calories = item?.calories || initItem?.itemData.calories;
  const carb = item?.carbs ?? initItem?.itemData.carbs;
  const protein = item?.protein ?? initItem?.itemData.protein;
  const fat = item?.fat ?? initItem?.itemData.fat;
  return (
    <>
      <Text>{`${description} - ${quantity}${uom}`}</Text>
      <Text>{`${calories}cal ${carb}c ${protein}p ${fat}f`}</Text>
    </>
  );
};

export default ConsumedFoodItemComponent;
