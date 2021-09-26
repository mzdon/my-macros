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

const EMAIL_REGEX = new RegExp('.*@.*\\..*');
export const isValidEmail = (val: string) => {
  return EMAIL_REGEX.test(val);
};
export const emailErrorMessage = 'Not a valid email address';

export const isValidPassword = (val: string) => {
  return val.length >= 6 && val.length < 128;
};
export const passwordErrorMessage =
  'Passwords must be between 6 and 128 characters';

interface FieldValidators {
  [key: string]: {
    isValid: (value: any) => boolean;
    message: string;
  };
}

type Errors<T> = {
  [Property in keyof T]?: string;
};

type GenericFunction = (...args: any[]) => any;

type Values<F> = {
  [Property in keyof F]: any;
};

type InputMap = {
  [key: string]: GenericFunction;
};

type OutputMap<I> = {
  [Property in keyof I]: (...args: any) => any;
};

interface ValidationTools<V, B, A> {
  validateFields: (values: V) => boolean;
  validateField: (field: string, value: any) => boolean;
  validateBefore: OutputMap<B>;
  validateAfter: OutputMap<A>;
  hasErrors: boolean;
  errors: Errors<V>;
}

export function useValidateFields<
  F extends FieldValidators = FieldValidators,
  V extends Values<F> = Values<F>,
  B extends InputMap = InputMap,
  A extends InputMap = InputMap,
>(
  validators: F,
  values: V,
  validateBefore?: B,
  validateAfter?: A,
): ValidationTools<V, B, A> {
  const errors = React.useRef<Errors<V>>({});
  const [hasErrors, setHasErrors] = React.useState(false);

  const updateHasErrors = React.useCallback((passedErrorDetected?: boolean) => {
    if (passedErrorDetected !== undefined) {
      setHasErrors(passedErrorDetected);
      return;
    }
    const keys = Object.keys(errors.current);
    let errorDetected = false;
    let i = 0;
    while (!errorDetected && i < keys.length) {
      i += 1;
      errorDetected = !!errors.current[keys[i]];
    }
    setHasErrors(errorDetected);
  }, []);

  const validateField = React.useCallback(
    (field: keyof F, value: any) => {
      const validator = validators[field];
      if (validator) {
        const {isValid, message} = validator;
        if (!isValid(value)) {
          errors.current[field] = message;
          updateHasErrors(true);
          return false;
        }
      }
      delete errors.current[field];
      updateHasErrors();
      return true;
    },
    [updateHasErrors, validators],
  );

  const validateFields = React.useCallback(
    (passedValues: Record<keyof F, any>): boolean => {
      const fields: Array<keyof F> = Object.keys(validators);
      let errorDetected = false;
      fields.forEach(field => {
        const {isValid, message} = validators[field];
        if (!isValid(passedValues[field])) {
          errors.current[field] = message;
          errorDetected = true;
        } else {
          delete errors.current[field];
        }
      });
      updateHasErrors(errorDetected);
      return !errorDetected;
    },
    [updateHasErrors, validators],
  );

  const internalValidateBefore = React.useMemo(() => {
    const before = {} as OutputMap<B>;
    if (validateBefore) {
      const fnKeys = Object.keys(validateBefore);
      return fnKeys.reduce((result, next) => {
        return {
          ...result,
          [next]: (...args: any[]): any => {
            if (validateFields(values)) {
              return validateBefore[next](...args);
            }
            return undefined;
          },
        };
      }, before);
    }
    return before;
  }, [validateBefore, validateFields, values]);

  const internalValidateAfter = React.useMemo(() => {
    const after = {} as OutputMap<A>;
    if (validateAfter) {
      const fnKeys = Object.keys(validateAfter);
      return fnKeys.reduce((result, next) => {
        return {
          ...result,
          [next]: (...args: any[]): any => {
            const returnValue = validateAfter[next](...args);
            validateFields(values);
            return returnValue;
          },
        };
      }, after);
    }
    return after;
  }, [validateAfter, validateFields, values]);

  return {
    validateFields,
    validateField,
    hasErrors,
    errors: errors.current,
    validateBefore: internalValidateBefore,
    validateAfter: internalValidateAfter,
  };
}
