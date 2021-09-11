import {MacroDefinitionStrings} from 'types/MacroDefinition';
import {isStringValidNumber} from 'utils/Validators';

interface ConstructorObject {
  startDate?: Date | null;
  calories?: string | number;
  carbs?: string | number;
  protein?: string | number;
  fat?: string | number;
  sugar?: string | number;
  fiber?: string | number;
}

function determineOptionalNumber(value: string | number | null): number | null {
  if (value === null || value === '') {
    return null;
  }
  return Number(value);
}

function determineOptionalString(value: string | number | null): string {
  if (value === null) {
    return '';
  }
  return String(value);
}

class MacroDefinition {
  /* @ts-ignore */
  startDate: Date | null;
  /* @ts-ignore */
  calories: number;
  /* @ts-ignore */
  carbs: number;
  /* @ts-ignore */
  protein: number;
  /* @ts-ignore */
  fat: number;
  /* @ts-ignore */
  sugar: number | null;
  /* @ts-ignore */
  fiber: number | null;

  constructor(obj?: ConstructorObject) {
    if (obj) {
      const {
        startDate = new Date(),
        calories = 0,
        carbs = 0,
        protein = 0,
        fat = 0,
        sugar = null,
        fiber = null,
      } = obj;
      this.startDate = startDate;
      this.calories = Number(calories);
      this.carbs = Number(carbs);
      this.protein = Number(protein);
      this.fat = Number(fat);
      this.sugar = determineOptionalNumber(sugar);
      this.fiber = determineOptionalNumber(fiber);
    }
  }

  isEqualTo(macroDef: MacroDefinitionStrings): boolean {
    const keys: Array<keyof MacroDefinition> = [
      'calories',
      'carbs',
      'protein',
      'fat',
      'sugar',
      'fiber',
    ];
    let eq = true;
    let i = 0;
    while (eq && i < keys.length) {
      const key = keys[i];
      // use determineOptionalNumber to support optional sugar and fiber
      eq = determineOptionalNumber(macroDef[key]) === this[key];
    }
    return eq;
  }

  static getMacroStrings(
    macroDef?: MacroDefinition | undefined,
  ): MacroDefinitionStrings {
    const macroStrings = {
      calories: '',
      carbs: '',
      protein: '',
      fat: '',
      sugar: '',
      fiber: '',
    };
    if (macroDef) {
      macroStrings.calories = String(macroDef.calories);
      macroStrings.carbs = String(macroDef.carbs);
      macroStrings.protein = String(macroDef.protein);
      macroStrings.fat = String(macroDef.fat);
      macroStrings.sugar = determineOptionalString(macroDef.sugar);
      macroStrings.fiber = determineOptionalString(macroDef.fiber);
    }
    return macroStrings;
  }

  static isValidDefinitionStrings(defStrings: MacroDefinitionStrings): boolean {
    const {calories, carbs, protein, fat, sugar, fiber} = defStrings;
    return (
      !!calories &&
      isStringValidNumber(calories) &&
      !!carbs &&
      isStringValidNumber(carbs) &&
      !!protein &&
      isStringValidNumber(protein) &&
      !!fat &&
      isStringValidNumber(fat) &&
      isStringValidNumber(sugar) &&
      isStringValidNumber(fiber)
    );
  }

  static schema = {
    name: 'MacroDefinition',
    embedded: true,
    properties: {
      startDate: {type: 'date?', indexed: true},
      calories: 'int',
      carbs: 'int',
      protein: 'int',
      fat: 'int',
      sugar: 'int?',
      fiber: 'int?',
    },
  };
}

export default MacroDefinition;
