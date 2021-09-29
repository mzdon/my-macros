import React from 'react';

// TODO fix this regex to support 1 decimal place
const numberRegex = new RegExp('^\\d{0,}(\\.\\d?)?$');
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

const EMAIL_REGEX = new RegExp('.*@.*\\..{1,}');
export const isValidEmail = (val: string) => {
  return EMAIL_REGEX.test(val);
};
export const emailErrorMessage = 'Not a valid email address';

export const isValidPassword = (val: string) => {
  return val.length >= 6 && val.length < 128;
};
export const passwordErrorMessage =
  'Passwords must be between 6 and 128 characters';

export const isValidRequiredString = (val: string) => !!val;
export const requiredErrorMessage = (fieldName: string) =>
  `${fieldName[0].toUpperCase() + fieldName.slice(1)} is required`;

const BDAY_REGEX = new RegExp('\\d{2}/\\d{2}/\\d{4}');
export const isValidBirthday = (val: string) => {
  if (!val) {
    return true;
  }
  return BDAY_REGEX.test(val);
};
export const birthdayErrorMessage = 'Please use MM/DD/YYYY format';

export const isValidRequiredNumber = (val: number) => !!val;

interface FieldValidators {
  [key: string]: {
    isValid: (value: any) => boolean;
    message: string;
    value: any;
    onChange: (value: any) => void;
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

type OnChange<F> = {
  [Property in keyof F]: (value: any) => void;
};

interface ValidationTools<F, B> {
  validateFields: (values: Values<F>) => boolean;
  validateField: (field: string, value: any) => boolean;
  validateBefore: OutputMap<B>;
  onChange: OnChange<F>;
  numErrors: number;
  errors: Errors<F>;
}

function getValuesFromValidators<F extends FieldValidators>(
  validators: F,
): Values<F> {
  return Object.keys(validators).reduce((result, key) => {
    return {
      ...result,
      [key]: validators[key].value,
    };
  }, {} as Values<F>);
}

export function useValidateFields<
  F extends FieldValidators = FieldValidators,
  B extends InputMap = InputMap,
>(validators: F, validateBefore?: B): ValidationTools<F, B> {
  const errors = React.useRef<Errors<F>>({});
  const [numErrors, setNumErrors] = React.useState(0);

  const values = React.useMemo(
    () => getValuesFromValidators(validators),
    [validators],
  );

  const updateHasErrors = React.useCallback((passedErrorDetected?: number) => {
    if (passedErrorDetected !== undefined) {
      setNumErrors(passedErrorDetected);
      return;
    }
    const keys = Object.keys(errors.current);
    let errorDetected = 0;
    let i = 0;
    while (i < keys.length) {
      if (errors.current[keys[i]]) {
        errorDetected += 1;
      }
      i += 1;
    }
    setNumErrors(errorDetected);
  }, []);

  const validateField = React.useCallback(
    (field: keyof F, value: any) => {
      const validator = validators[field];
      if (validator) {
        const {isValid, message} = validator;
        if (!isValid(value)) {
          errors.current[field] = message;
          updateHasErrors();
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
      let errorDetected = 0;
      fields.forEach(field => {
        const {isValid, message} = validators[field];
        if (!isValid(passedValues[field])) {
          errors.current[field] = message;
          errorDetected += 1;
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

  const onChange = React.useMemo(() => {
    const fnKeys = Object.keys(validators);
    return fnKeys.reduce((result, next) => {
      return {
        ...result,
        [next]: (value: any): void => {
          validators[next].onChange(value);
          !!numErrors && validateField(next, value);
        },
      };
    }, {} as OnChange<F>);
  }, [numErrors, validateField, validators]);

  return {
    validateFields,
    validateField,
    numErrors,
    errors: errors.current,
    validateBefore: internalValidateBefore,
    onChange,
  };
}
