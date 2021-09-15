import {UUID} from 'bson';
import Realm from 'realm';

import {FoodItemData} from 'schemas/FoodItem';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {convert} from 'utils/UnitOfMeasurement';

type UomOrServings = UnitOfMeasurement | typeof Servings;

export interface ConsumedFoodItemData {
  item: Partial<FoodItemData>;
  quantity: number;
  unitOfMeasurement: UomOrServings;
}

interface ConstructorObject {
  item: FoodItemData;
  quantity?: number;
  unitOfMeasurement?: UomOrServings;
}

function determineServingsConsumedAndUom(
  item: FoodItemData,
  quantity: number,
  unitOfMeasurement: UomOrServings,
): {servings: number; realQuantity: number; uom: UnitOfMeasurement} {
  if (unitOfMeasurement === Servings) {
    // we consumed n servings
    return {
      servings: quantity,
      realQuantity: quantity * item.servingSize,
      uom: item.servingUnitOfMeasurement,
    };
  }
  if (unitOfMeasurement !== item.servingUnitOfMeasurement) {
    // we consumed n uom where uom != item.uom
    const quantityAsServingUom = convert(
      quantity,
      unitOfMeasurement,
      item.servingUnitOfMeasurement,
    );
    return {
      servings: quantityAsServingUom / item.servingSize,
      realQuantity: quantity,
      uom: unitOfMeasurement,
    };
  }
  // we consumed n uom where uom == item.uom
  return {
    servings: quantity / item.servingSize,
    realQuantity: quantity,
    uom: unitOfMeasurement,
  };
}

function determineItemMacros(item: FoodItemData, servings: number) {
  return {
    calories: item.calories * servings,
    carbs: item.carbs * servings,
    protein: item.protein * servings,
    fat: item.fat * servings,
    sugar: item.sugar * servings,
    fiber: item.fiber * servings,
  };
}

class ConsumedFoodItem extends Realm.Object {
  itemId!: UUID;
  itemName!: string;
  calories!: number;
  carbs!: number;
  protein!: number;
  fat!: number;
  fiber!: number;
  sugar!: number;
  quantity!: number;
  unitOfMeasurement!: UnitOfMeasurement;

  static generate(obj: ConstructorObject) {
    const {item, quantity = 0, unitOfMeasurement} = obj;
    const {servings, realQuantity, uom} = determineServingsConsumedAndUom(
      item,
      quantity,
      unitOfMeasurement || item.servingUnitOfMeasurement,
    );
    return {
      itemId: item._id,
      itemName: item.description,
      quantity: realQuantity,
      unitOfMeasurement: uom,
      ...determineItemMacros(item, servings),
    };
  }

  static schema = {
    name: 'ConsumedFoodItem',
    embedded: true,
    properties: {
      itemId: 'uuid',
      itemName: 'string',
      calories: 'int',
      carbs: 'double',
      protein: 'double',
      fat: 'double',
      sugar: 'double',
      fiber: 'double',
      quantity: 'double',
      unitOfMeasurement: 'string',
    },
  };
}

export default ConsumedFoodItem;
