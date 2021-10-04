import React from 'react';

export function useSimpleStateUpdater<S>(
  initialState: S,
): [
  S,
  <T = string>(key: keyof S) => (val: T) => void,
  React.Dispatch<React.SetStateAction<S>>,
] {
  const [state, setState] = React.useState<S>(initialState);

  const updateState = (key: keyof S, value: any) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  function useInternalStateUpdater(key: keyof S) {
    const callback = (value: any) => {
      updateState(key, value);
    };
    return callback;
  }

  return [state, useInternalStateUpdater, setState];
}

export function useUpdater<R = string>(
  onUpdate: (v: Record<string, R>) => void,
  key: string,
): (input: R) => void {
  return React.useCallback(
    (input: R) => {
      onUpdate({[key]: input});
    },
    [onUpdate, key],
  );
}

export function useStateUpdater<T>(updateState: (data: any) => void) {
  const updater = React.useCallback(
    (key: keyof T) => {
      return (value: T[keyof T]) =>
        updateState({
          [key]: value,
        });
    },
    [updateState],
  );
  return updater;
}
