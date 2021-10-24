import {UUID} from 'bson';
import Realm from 'realm';

import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';

export interface InitFoodItemGroupData {
  _id?: UUID;
  description: string;
  foodItems: ConsumedFoodItemData[];
}

export type FoodItemGroupData = Omit<InitFoodItemGroupData, '_id'> & {
  _id: UUID;
};

export interface ReturnedFoodItemGroupData {
  _id: UUID;
  description: string;
  foodItems: ConsumedFoodItemData[];
}

class FoodItemGroup extends Realm.Object {
  _id!: UUID;
  description!: string;
  foodItems!: ConsumedFoodItem[];

  static generate(
    obj: InitFoodItemGroupData,
    partitionValue: string,
  ): FoodItemGroupData {
    const {_id = new UUID(), description = '', foodItems = []} = obj;
    return {
      _id,
      // @ts-ignore - hide _partition
      _partition: partitionValue,
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
      _partition: 'string',
      description: 'string',
      foodItems: 'ConsumedFoodItem[]',
    },
  };
}

export default FoodItemGroup;
