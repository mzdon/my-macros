import {RecoverableError} from 'utils/Errors';

const MIN_PLACES = 0;
const MAX_PLACES = 1;

export const round = (value: number, decimalPlaces: number = 1) => {
  const multiplier = getMultiplier(decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
};

function getMultiplier(places: number) {
  if (places < MIN_PLACES || places > MAX_PLACES) {
    throw new RecoverableError(`Cannot round to ${places} decimal places`);
  }
  const figure = '1'.padEnd(places + 1, '0');
  return Number(figure);
}
