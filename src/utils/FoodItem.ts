import {UnitOfMeasurement} from 'types/UnitOfMeasurement';

export enum FoodItemType {
  Food = 'food',
  Drink = 'drink',
  Either = 'either',
}

export const UOM_TO_TYPE_MAP: Record<UnitOfMeasurement, FoodItemType> = {
  [UnitOfMeasurement.Grams]: FoodItemType.Food,
  [UnitOfMeasurement.Ounces]: FoodItemType.Food,
  [UnitOfMeasurement.Pounds]: FoodItemType.Food,
  [UnitOfMeasurement.Kilograms]: FoodItemType.Food,
  [UnitOfMeasurement.Feet]: FoodItemType.Food,
  [UnitOfMeasurement.Inches]: FoodItemType.Food,
  [UnitOfMeasurement.Centimeters]: FoodItemType.Food,
  [UnitOfMeasurement.Cups]: FoodItemType.Either,
  [UnitOfMeasurement.Tbsp]: FoodItemType.Either,
  [UnitOfMeasurement.Tsp]: FoodItemType.Either,
  [UnitOfMeasurement.FluidOunces]: FoodItemType.Drink,
  [UnitOfMeasurement.Liters]: FoodItemType.Drink,
};

export const isFoodOrDrink = (uom: UnitOfMeasurement): FoodItemType => {
  return UOM_TO_TYPE_MAP[uom];
};
