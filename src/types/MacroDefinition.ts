export interface MacroDefinition extends SimpleObject {
  startDate: Date | null;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
}

export interface MacroDefinitionStrings extends Record<string, string> {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  sugar: string;
  fiber: string;
}
