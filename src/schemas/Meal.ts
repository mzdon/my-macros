import Realm from 'realm';

import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';

export interface ConstructorObject {
  description: string;
  order?: number;
  items?: Array<ConsumedFoodItem | ConsumedFoodItemData>;
}

class Meal extends Realm.Object {
  description!: string;
  order!: number;
  items!: ConsumedFoodItem[];

  static generate(obj: ConstructorObject) {
    const {description, order = 0, items = []} = obj;
    const mappedItems = items.map(item => {
      if (item instanceof ConsumedFoodItem) {
        return item;
      }
      return ConsumedFoodItem.generate(item);
    });
    return {
      description,
      order,
      items: mappedItems,
    };
  }

  getMacros() {
    return this.items.reduce(
      (result, item) => {
        return {
          calories: result.calories + item.calories,
          carbs: result.carbs + item.carbs,
          protein: result.protein + item.protein,
          fat: result.fat + item.fat,
          sugar: result.sugar + item.sugar,
          fiber: result.fiber + item.fiber,
        };
      },
      {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
        sugar: 0,
        fiber: 0,
      },
    );
  }

  static schema = {
    name: 'Meal',
    embedded: true,
    properties: {
      description: 'string',
      order: 'int',
      items: 'ConsumedFoodItem[]',
    },
  };
}

export default Meal;
