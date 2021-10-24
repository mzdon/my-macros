import {Factory} from 'rosie';

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

class MacroDefinition {
  startDate!: Date | null;
  calories!: number;
  carbs!: number;
  protein!: number;
  fat!: number;
  sugar!: number | null;
  fiber!: number | null;

  static generate(obj: ConstructorObject) {
    const {
      startDate = new Date(),
      calories = 0,
      carbs = 0,
      protein = 0,
      fat = 0,
      sugar = null,
      fiber = null,
    } = obj;
    return {
      startDate,
      calories,
      carbs,
      protein,
      fat,
      sugar: determineOptionalNumber(sugar),
      fiber: determineOptionalNumber(fiber),
    };
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

export interface MacroDefinitionModel {
  startDate: Date | null;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number | null;
  fiber: number | null;
}

export const MacroDefinitionFactory = Factory.define<MacroDefinitionModel>(
  'MacroDefinitionModel',
).attrs({
  startDate: null,
  calories: 2440,
  carbs: 250,
  protein: 180,
  fat: 80,
  fiber: null,
  sugar: null,
});
