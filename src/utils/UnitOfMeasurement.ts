import {MeasurementSystem} from 'types/MeasurementSystem';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {RecoverableError} from './Errors';

const heightMap = {
  [MeasurementSystem.Imperial]: UnitOfMeasurement.Inches,
  [MeasurementSystem.Metric]: UnitOfMeasurement.Centimeters,
};
export const heightUom = (ms: MeasurementSystem): UnitOfMeasurement => {
  return heightMap[ms];
};

const weightMap = {
  [MeasurementSystem.Imperial]: UnitOfMeasurement.Pounds,
  [MeasurementSystem.Metric]: UnitOfMeasurement.Kilograms,
};
export const weightUom = (ms: MeasurementSystem): UnitOfMeasurement => {
  return weightMap[ms];
};

const CONVERSION_MATRIX = {
  // weight
  [UnitOfMeasurement.Grams]: {
    [UnitOfMeasurement.Ounces]: 0.0322,
    [UnitOfMeasurement.Pounds]: 0.0022,
    [UnitOfMeasurement.Kilograms]: 0.001,
  },
  [UnitOfMeasurement.Ounces]: {
    [UnitOfMeasurement.Grams]: 28.3495,
    [UnitOfMeasurement.Pounds]: 0.0625,
    [UnitOfMeasurement.Kilograms]: 0.0283,
  },
  [UnitOfMeasurement.Pounds]: {
    [UnitOfMeasurement.Grams]: 453.5924,
    [UnitOfMeasurement.Ounces]: 16,
    [UnitOfMeasurement.Kilograms]: 0.4536,
  },
  [UnitOfMeasurement.Kilograms]: {
    [UnitOfMeasurement.Grams]: 1000,
    [UnitOfMeasurement.Ounces]: 35.274,
    [UnitOfMeasurement.Pounds]: 2.2046,
  },
  // length
  [UnitOfMeasurement.Feet]: {
    [UnitOfMeasurement.Inches]: 12,
    [UnitOfMeasurement.Centimeters]: 30.48,
  },
  [UnitOfMeasurement.Inches]: {
    [UnitOfMeasurement.Feet]: 0.08,
    [UnitOfMeasurement.Centimeters]: 2.54,
  },
  [UnitOfMeasurement.Centimeters]: {
    [UnitOfMeasurement.Feet]: 0.03,
    [UnitOfMeasurement.Inches]: 0.39,
  },
  // volume
  [UnitOfMeasurement.FluidOunces]: {
    [UnitOfMeasurement.Liters]: 0.03,
    [UnitOfMeasurement.Cups]: 0.12,
    [UnitOfMeasurement.Tbsp]: 1.6,
    [UnitOfMeasurement.Tsp]: 4.8,
  },
  [UnitOfMeasurement.Liters]: {
    [UnitOfMeasurement.FluidOunces]: 35.2,
    [UnitOfMeasurement.Cups]: 4.23,
    [UnitOfMeasurement.Tbsp]: 56.3,
    [UnitOfMeasurement.Tsp]: 168.9,
  },
  [UnitOfMeasurement.Cups]: {
    [UnitOfMeasurement.FluidOunces]: 8.3,
    [UnitOfMeasurement.Liters]: 0.2,
    [UnitOfMeasurement.Tbsp]: 13.3,
    [UnitOfMeasurement.Tsp]: 40,
  },
  [UnitOfMeasurement.Tbsp]: {
    [UnitOfMeasurement.FluidOunces]: 0.6,
    [UnitOfMeasurement.Liters]: 0.01,
    [UnitOfMeasurement.Cups]: 0.08,
    [UnitOfMeasurement.Tsp]: 3,
  },
  [UnitOfMeasurement.Tsp]: {
    [UnitOfMeasurement.FluidOunces]: 0.2,
    [UnitOfMeasurement.Liters]: 0.01,
    [UnitOfMeasurement.Cups]: 0.03,
    [UnitOfMeasurement.Tbsp]: 0.33,
  },
};

export function convert(
  quantity: number,
  from: UnitOfMeasurement,
  to: UnitOfMeasurement,
) {
  // @ts-ignore
  const multiplier = CONVERSION_MATRIX[from][to];
  if (multiplier === undefined) {
    throw new RecoverableError(`Cannot convert ${from} to ${to}`);
  }
  // round 2 decimal places
  return Math.round((quantity * multiplier + Number.EPSILON) * 100) / 100;
}
