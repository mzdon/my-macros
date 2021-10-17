import {UUID} from 'bson';
import Realm from 'realm';

import {InitFoodItemData, FoodItemData} from 'schemas/FoodItem';
import {
  ServingUnitOfMeasurement,
  UnitOfMeasurement,
} from 'types/UnitOfMeasurement';
import {round} from 'utils/Math';
import {convert} from 'utils/UnitOfMeasurement';

export interface InitConsumedFoodItemData {
  itemData: InitFoodItemData;
  itemId?: UUID | null;
  quantity: number;
  unitOfMeasurement: ServingUnitOfMeasurement;
}

export interface ConsumedFoodItemData
  extends Omit<FoodItemData, '_id' | 'userId'> {
  itemId: UUID | null;
  quantity: number;
  unitOfMeasurement: UnitOfMeasurement;
}

function determineServingsConsumedAndUom(
  item: InitFoodItemData,
  quantity: number,
  unitOfMeasurement: ServingUnitOfMeasurement,
): {servings: number; realQuantity: number; uom: UnitOfMeasurement} {
  if (unitOfMeasurement === ServingUnitOfMeasurement.Servings) {
    // we consumed n servings
    return {
      servings: quantity,
      realQuantity: round(quantity * item.servingSize),
      uom: item.servingUnitOfMeasurement,
    };
  }
  // TODO: fix this hack when I figure out how to let ServingUnitOfMeasurement extend UnitOfMeasurement
  const uom = unitOfMeasurement as unknown as UnitOfMeasurement;
  if (uom !== item.servingUnitOfMeasurement) {
    // we consumed n uom where uom != item.uom
    const quantityAsServingUom = convert(
      quantity,
      uom,
      item.servingUnitOfMeasurement,
    );
    return {
      servings: round(quantityAsServingUom / item.servingSize),
      realQuantity: quantity,
      uom,
    };
  }
  // we consumed n uom where uom == item.uom
  return {
    servings: round(quantity / item.servingSize),
    realQuantity: quantity,
    uom,
  };
}

function determineItemMacros(item: InitFoodItemData, servings: number) {
  return {
    calories: round(item.calories * servings),
    carbs: round(item.carbs * servings),
    protein: round(item.protein * servings),
    fat: round(item.fat * servings),
    sugar: round(item.sugar * servings),
    fiber: round(item.fiber * servings),
  };
}

class ConsumedFoodItem extends Realm.Object {
  itemId!: UUID | null;
  description!: string;
  calories!: number;
  carbs!: number;
  protein!: number;
  fat!: number;
  fiber!: number;
  sugar!: number;
  quantity!: number;
  unitOfMeasurement!: UnitOfMeasurement;
  servingSize!: number;
  servingUnitOfMeasurement!: UnitOfMeasurement;
  servingSizeNote!: string;

  static generate(obj: InitConsumedFoodItemData): ConsumedFoodItemData {
    const {itemData, itemId = null, quantity, unitOfMeasurement} = obj;
    const {servings, realQuantity, uom} = determineServingsConsumedAndUom(
      itemData,
      quantity,
      unitOfMeasurement || itemData.servingUnitOfMeasurement,
    );
    const {description, ...rest} = itemData;
    return {
      itemId,
      description,
      quantity: realQuantity,
      unitOfMeasurement: uom,
      ...rest,
      ...determineItemMacros(itemData, servings),
    };
  }

  getData(): ConsumedFoodItemData {
    return {
      itemId: this.itemId,
      description: this.description,
      calories: this.calories,
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
      sugar: this.sugar,
      fiber: this.fiber,
      quantity: this.quantity,
      unitOfMeasurement: this.unitOfMeasurement,
      servingSize: this.servingSize,
      servingUnitOfMeasurement: this.servingUnitOfMeasurement,
      servingSizeNote: this.servingSizeNote,
    };
  }

  static schema = {
    name: 'ConsumedFoodItem',
    embedded: true,
    properties: {
      itemId: 'uuid?',
      description: 'string',
      calories: 'int',
      carbs: 'double',
      protein: 'double',
      fat: 'double',
      sugar: 'double',
      fiber: 'double',
      quantity: 'double',
      unitOfMeasurement: 'string',
      servingSize: 'double',
      servingUnitOfMeasurement: 'string',
      servingSizeNote: 'string',
    },
  };
}

export default ConsumedFoodItem;
