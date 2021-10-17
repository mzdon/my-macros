export const round = (value: number, decimalPlaces: number = 1) => {
  const multiplier = Math.pow(10, decimalPlaces || 0);
  return Math.round(value * multiplier) / multiplier;
};
