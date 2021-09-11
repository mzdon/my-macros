import {UUID} from 'bson';
import Realm from 'realm';

import {UnitOfMeasurement} from 'types/UnitOfMeasurement';

export interface FoodItemData {
  _id: UUID;
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

class FoodItem extends Realm.Object implements FoodItemData {
  _id!: UUID;
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

  static generate(obj: Partial<FoodItemData> = {}) {
    const {
      _id = new UUID(),
      description = '',
      calories = 0,
      carbs = 0,
      protein = 0,
      fat = 0,
      sugar = 0,
      fiber = 0,
      servingSize = 0,
      servingUnitOfMeasurement = UnitOfMeasurement.Grams,
      servingSizeNote = '',
    } = obj;
    return {
      _id,
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

  getData() {
    return {
      _id: this._id,
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
