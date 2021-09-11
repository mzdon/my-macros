import React from 'react';

// TODO fix this regex to support 1 decimal place
const numberRegex = new RegExp('^\\d{0,}(.\\d?)?$');
export const isStringValidNumber = (v: string): boolean => numberRegex.test(v);

export const checkValidNumberFirst = (fn: (val: string) => void) => {
  return (val: string): void => {
    if (!isStringValidNumber(val)) {
      return;
    }
    fn(val);
  };
};

export function useCheckValidNumberFirst(fn: (val: string) => void) {
  return React.useCallback(
    (val: string) => {
      const cb = checkValidNumberFirst(fn);
      return cb(val);
    },
    [fn],
  );
}
