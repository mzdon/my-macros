import {UUID} from 'bson';

import ConsumedFoodItem from 'schemas/ConsumedFoodItem';
import {FoodItemData} from 'schemas/FoodItem';

interface ConstructorObject {}

export interface FoodItemGroupData {
  id: UUID | null;
  description: string;
  foodItems: FoodItemData[];
}

class FoodItemGroup {
  // @ts-ignore
  _id: UUID;
  // @ts-ignore
  description: string;
  // @ts-ignore
  foodItems: ConsumedFoodItem[];

  constructor(obj?: ConstructorObject) {
    if (obj) {
      this._id = new UUID();
      this.description = '';
      this.foodItems = [];
    }
  }

  addFoodItem(foodItem: ConsumedFoodItem) {
    this.foodItems.push(foodItem);
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
