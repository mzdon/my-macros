import {UUID} from 'bson';
import Realm from 'realm';

import ConsumedFoodItem, {
  ReturnedConsumedFoodItemData,
} from 'schemas/ConsumedFoodItem';

export interface InitFoodItemGroupData {
  _id?: UUID;
  description: string;
  foodItems: ReturnedConsumedFoodItemData[];
}

export interface ReturnedFoodItemGroupData {
  _id: UUID;
  description: string;
  foodItems: ReturnedConsumedFoodItemData[];
}

class FoodItemGroup extends Realm.Object {
  _id!: UUID;
  description!: string;
  foodItems!: ConsumedFoodItem[];

  static generate(obj: InitFoodItemGroupData) {
    const {_id = new UUID(), description = '', foodItems = []} = obj;
    return {
      _id,
      description,
      foodItems,
    };
  }

  getData(): ReturnedFoodItemGroupData {
    return {
      _id: this._id,
      description: this.description,
      foodItems: this.foodItems.map(item => item.getData()),
    };
  }

  static schema = {
    name: 'FoodItemGroup',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      description: 'string',
      foodItems: 'ConsumedFoodItem[]',
    },
  };
}

export default FoodItemGroup;
