import {UUID} from 'bson';
import Realm from 'realm';

import Meal, {ConstructorObject as MealConstructorObject} from 'schemas/Meal';

interface ConstructorObject {
  id?: UUID;
  userId: UUID;
  date?: Date;
  meals?: Array<MealConstructorObject>;
}

class JournalEntry extends Realm.Object {
  _id!: UUID;
  userId!: UUID;
  date!: Date;
  meals!: Meal[];

  static generate(obj: ConstructorObject) {
    const {
      id = new UUID(),
      userId,
      date = new Date(new Date().toDateString()),
      meals = [],
    } = obj;
    return {
      _id: id,
      userId,
      date,
      meals: meals.map(data => Meal.generate(data)),
    };
  }

  static schema = {
    name: 'JournalEntry',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      userId: 'uuid',
      date: 'date',
      meals: 'Meal[]',
    },
  };
}

export default JournalEntry;
