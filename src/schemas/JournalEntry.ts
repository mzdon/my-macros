import {UUID} from 'bson';
import Realm from 'realm';

import Meal, {InitMealData} from 'schemas/Meal';
import {today} from 'utils/Date';

interface InitJournalEntryData {
  id?: UUID;
  userId: UUID;
  date?: Date;
  meals?: InitMealData[];
}

class JournalEntry extends Realm.Object {
  _id!: UUID;
  userId!: UUID;
  date!: Date;
  meals!: Meal[];

  static generate(obj: InitJournalEntryData) {
    const {id = new UUID(), userId, date = today(), meals = []} = obj;
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
