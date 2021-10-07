import {UUID} from 'bson';
import Realm from 'realm';

import {UnitOfMeasurement} from 'types/UnitOfMeasurement';

export interface InitFoodItemData {
  _id?: UUID;
  userId: UUID;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  fiber: number;
  servingSize: number;
  servingUnitOfMeasurement: UnitOfMeasurement;
  servingSizeNote: string;
}

const REQUIRED_INIT_KEYS: Array<keyof InitFoodItemData> = [
  'userId',
  'description',
  'calories',
  'carbs',
  'protein',
  'fat',
  'sugar',
  'fiber',
  'sugar',
  'servingSize',
  'servingUnitOfMeasurement',
  'servingSizeNote',
];

export type FoodItemData = Omit<InitFoodItemData, '_id'> & {_id: UUID};

class FoodItem extends Realm.Object {
  _id!: UUID;
  userId!: UUID;
  description!: string;
  calories!: number;
  carbs!: number;
  protein!: number;
  fat!: number;
  sugar!: number;
  fiber!: number;
  servingSize!: number;
  servingUnitOfMeasurement!: UnitOfMeasurement;
  servingSizeNote!: string;

  static generate(obj: InitFoodItemData): FoodItemData {
    const {
      _id = new UUID(),
      userId,
      description,
      calories,
      carbs,
      protein,
      fat,
      sugar,
      fiber,
      servingSize,
      servingUnitOfMeasurement,
      servingSizeNote,
    } = obj;
    return {
      _id,
      userId,
      description,
      calories,
      carbs,
      protein,
      fat,
      sugar,
      fiber,
      servingSize,
      servingUnitOfMeasurement,
      servingSizeNote,
    };
  }

  static verifyInitFoodItemData(
    obj: Partial<InitFoodItemData>,
  ): InitFoodItemData | null {
    let valid = true;
    REQUIRED_INIT_KEYS.forEach(key => {
      if (obj[key] === undefined) {
        valid = false;
      }
    });
    if (!valid) {
      return null;
    }
    return obj as InitFoodItemData;
  }

  getData(): FoodItemData {
    return {
      _id: this._id,
      userId: this.userId,
      description: this.description,
      calories: this.calories,
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
      sugar: this.sugar,
      fiber: this.fiber,
      servingSize: this.servingSize,
      servingUnitOfMeasurement: this.servingUnitOfMeasurement,
      servingSizeNote: this.servingSizeNote,
    };
  }

  static schema = {
    name: 'FoodItem',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      userId: 'uuid',
      description: 'string',
      calories: 'int',
      carbs: 'double',
      protein: 'double',
      fat: 'double',
      sugar: 'double?',
      fiber: 'double?',
      servingSize: 'double',
      servingUnitOfMeasurement: 'string',
      servingSizeNote: 'string',
    },
  };
}

export default FoodItem;
