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

  function useStateUpdater(key: keyof S) {
    const callback = (value: any) => {
      updateState(key, value);
    };
    return callback;
  }

  return [state, useStateUpdater, setState];
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
