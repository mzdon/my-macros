import {UUID} from 'bson';
import Realm from 'realm';

import {InitFoodItemData, FoodItemData} from 'schemas/FoodItem';
import {Servings, UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {convert} from 'utils/UnitOfMeasurement';

type UomOrServings = UnitOfMeasurement | typeof Servings;

export interface InitConsumedFoodItemData {
  itemData: InitFoodItemData;
  itemId?: UUID | null;
  quantity: number;
  unitOfMeasurement: UomOrServings;
}

export interface ConsumedFoodItemData extends Omit<FoodItemData, '_id'> {
  itemId: UUID | null;
  quantity: number;
  unitOfMeasurement: UnitOfMeasurement;
}

function determineServingsConsumedAndUom(
  item: InitFoodItemData,
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

function determineItemMacros(item: InitFoodItemData, servings: number) {
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
