import {MacroDefinitionStrings} from 'types/MacroDefinition';
import {isStringValidNumber} from 'utils/Validators';

export interface MacroData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number | null;
  fiber: number | null;
}

interface ConstructorObject extends Partial<MacroData> {
  startDate?: Date | null;
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
  startDate!: Date | null;
  calories!: number;
  carbs!: number;
  protein!: number;
  fat!: number;
  sugar!: number | null;
  fiber!: number | null;

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

  isEqualTo(macroDef: MacroData): boolean {
    const keys: Array<
      'calories' | 'carbs' | 'protein' | 'fat' | 'sugar' | 'fiber'
    > = ['calories', 'carbs', 'protein', 'fat', 'sugar', 'fiber'];
    let eq = true;
    let i = 0;
    while (eq && i < keys.length) {
      const key = keys[i];
      // use determineOptionalNumber to support optional sugar and fiber
      eq = determineOptionalNumber(macroDef[key]) === this[key];
    }
    return eq;
  }

  getMacroData() {
    return {
      calories: this.calories,
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
      sugar: this.sugar,
      fiber: this.fiber,
    };
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
