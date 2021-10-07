import {UUID} from 'bson';
import Realm from 'realm';

import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';

export interface InitFoodItemGroupData {
  _id?: UUID;
  userId: UUID;
  description: string;
  foodItems: ConsumedFoodItemData[];
}

export interface ReturnedFoodItemGroupData {
  _id: UUID;
  userId: UUID;
  description: string;
  foodItems: ConsumedFoodItemData[];
}

class FoodItemGroup extends Realm.Object {
  _id!: UUID;
  userId!: UUID;
  description!: string;
  foodItems!: ConsumedFoodItem[];

  static generate(obj: InitFoodItemGroupData) {
    const {_id = new UUID(), userId, description = '', foodItems = []} = obj;
    return {
      _id,
      userId,
      description,
      foodItems,
    };
  }

  getData(): ReturnedFoodItemGroupData {
    return {
      _id: this._id,
      userId: this.userId,
      description: this.description,
      foodItems: this.foodItems.map(item => item.getData()),
    };
  }

  static schema = {
    name: 'FoodItemGroup',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      userId: 'uuid',
      description: 'string',
      foodItems: 'ConsumedFoodItem[]',
    },
  };
}

export default FoodItemGroup;
