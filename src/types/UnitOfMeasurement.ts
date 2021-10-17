export enum UnitOfMeasurement {
  Grams = 'g',
  Ounces = 'oz',
  Pounds = 'lbs',
  Kilograms = 'kgs',
  Cups = 'cups',
  Tbsp = 'tbps',
  Tsp = 'tps',
  Feet = 'ft',
  Inches = 'in',
  FluidOunces = 'floz',
  Liters = 'l',
  Centimeters = 'cm',
}

// TODO: find a better way to do this
export enum ServingUnitOfMeasurement {
  Servings = 'servings',
  Grams = 'g',
  Ounces = 'oz',
  Pounds = 'lbs',
  Kilograms = 'kgs',
  Cups = 'cups',
  Tbsp = 'tbps',
  Tsp = 'tps',
  Feet = 'ft',
  Inches = 'in',
  FluidOunces = 'floz',
  Liters = 'l',
  Centimeters = 'cm',
}

export const AllUnitsOfMeasurement = [
  UnitOfMeasurement.Grams,
  UnitOfMeasurement.Ounces,
  UnitOfMeasurement.Pounds,
  UnitOfMeasurement.Kilograms,
  UnitOfMeasurement.FluidOunces,
  UnitOfMeasurement.Liters,
  UnitOfMeasurement.Cups,
  UnitOfMeasurement.Tbsp,
  UnitOfMeasurement.Tsp,
];

export const FoodUnitsOfMeasurement = [
  UnitOfMeasurement.Grams,
  UnitOfMeasurement.Ounces,
  UnitOfMeasurement.Pounds,
  UnitOfMeasurement.Kilograms,
  UnitOfMeasurement.Cups,
  UnitOfMeasurement.Tbsp,
  UnitOfMeasurement.Tsp,
];

export const DrinkUnitsOfMeasurement = [
  UnitOfMeasurement.FluidOunces,
  UnitOfMeasurement.Liters,
  UnitOfMeasurement.Cups,
  UnitOfMeasurement.Tbsp,
  UnitOfMeasurement.Tsp,
];
