import React from 'react';

export class RecoverableError extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
  }
}
export class CatastrophicError extends Error {
  constructor(message = 'Something catastrophic happened') {
    super(message);
  }
}

export const useRecoverableError = () => {
  const [, setError] = React.useState();
  return (e: Error) => {
    setError(() => {
      throw new RecoverableError(e.message);
    });
  };
};

export const useCatastrophicError = () => {
  const [, setError] = React.useState();
  return (e: Error) => {
    setError(() => {
      throw new CatastrophicError(e.message);
    });
  };
};

export const useThrowAsyncError = () => {
  const [, setError] = React.useState();
  return (e: Error) => {
    setError(() => {
      throw e;
    });
  };
};

export const useSafeAsyncCall = <E extends Error = Error>(
  ErrorClass?: new (error: string) => E,
) => {
  const Constructor = ErrorClass || Error;
  const throwAsyncError = useThrowAsyncError();
  return (func: () => Promise<any> | void) => {
    return async () => {
      try {
        return await func();
      } catch (e) {
        // @ts-ignore
        const message = e?.message || String(e);
        throwAsyncError(new Constructor(message));
      }
    };
  };
};
