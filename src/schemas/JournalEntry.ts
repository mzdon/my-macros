import {UUID} from 'bson';
import Realm from 'realm';

import Meal, {InitMealData} from 'schemas/Meal';
import {today} from 'utils/Date';

interface InitJournalEntryData {
  id?: UUID;
  date?: Date;
  meals?: InitMealData[];
}

interface JournalEntryData {
  _id: UUID;
  date: Date;
  meals: Meal[];
}

class JournalEntry extends Realm.Object {
  _id!: UUID;
  date!: Date;
  meals!: Meal[];

  static generate(
    obj: InitJournalEntryData,
    partitionValue: string,
  ): JournalEntryData {
    const {id = new UUID(), date = today(), meals = []} = obj;
    return {
      _id: id,
      // @ts-ignore - hide _partition
      _partition: partitionValue,
      date,
      meals: meals.map(data => Meal.generate(data)) as Meal[],
    };
  }

  static schema = {
    name: 'JournalEntry',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      _partition: 'string',
      date: 'date',
      meals: 'Meal[]',
    },
  };
}

export default JournalEntry;
