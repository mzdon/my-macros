import {UUID} from 'bson';
import Realm from 'realm';

import Height from 'schemas/Height';
import MacroDefinition from 'schemas/MacroDefinition';
import WeighIn from 'schemas/WeighIn';
import {MeasurementSystem} from 'types/MeasurementSystem';
import {MacroDefinitionStrings} from 'types/MacroDefinition';

function birthdayStringToDate(bday: string): Date | null {
  if (!bday) {
    return null;
  }
  const parts = bday.split('/');
  const year = +parts[2];
  const monthIdx = +parts[0] - 1;
  const day = +parts[1];
  return new Date(year, monthIdx, day);
}

const BDAY_REGEX = new RegExp('\\d{2}/\\d{2}/\\d{4}');

export interface UserData {
  name: string;
  birthday: string;
  measurementSystem: MeasurementSystem | null;
  height: number;
  weight: number;
  macroDefinition: MacroDefinitionStrings;
}

interface ConstructorObject {
  _id?: UUID;
  realmUserId: string;
  name?: string;
  height?: Height;
  birthday?: Date;
  measurementSystem?: MeasurementSystem;
  weighIns?: WeighIn[];
  macroDefinitions?: MacroDefinition[];
  foodItems?: UUID[];
  foodItemGroups?: UUID[];
}

class User extends Realm.Object {
  _id!: UUID;
  realmUserId!: string;
  name!: string;
  height!: Height | null;
  birthday!: Date | null;
  measurementSystem!: MeasurementSystem | null;
  weighIns!: WeighIn[];
  macroDefinitions!: MacroDefinition[];
  foodItems!: UUID[];
  foodItemGroups!: UUID[];

  static generate(obj: ConstructorObject) {
    const {
      realmUserId,
      _id = new UUID(),
      name = '',
      height = null,
      birthday = null,
      measurementSystem = null,
      weighIns = [],
      macroDefinitions = [],
      foodItems = [],
      foodItemGroups = [],
    } = obj;
    return {
      _id,
      realmUserId,
      name,
      height,
      birthday,
      measurementSystem,
      weighIns,
      macroDefinitions,
      foodItems,
      foodItemGroups,
    };
  }

  getBirthdayString() {
    if (!this.birthday) {
      return '';
    }
    return `${String(this.birthday.getMonth() + 1).padStart(2, '0')}/${String(
      this.birthday.getDate(),
    ).padStart(2, '0')}/${this.birthday.getFullYear()}`;
  }

  getHeightString(): string | null {
    if (!this.height) {
      return null;
    }
    return this.height.getDisplayString();
  }

  getWeightString(): string | null {
    const currentWeight = this.getCurrentWeight();
    if (!currentWeight) {
      return null;
    }
    return currentWeight.getDisplayString();
  }

  getCurrentMacros() {
    return this.macroDefinitions.reduce((lastResult, def) => {
      // a macroDef with a null startDate is the first set of macroDefs defined
      // there should be only one
      if (lastResult.startDate === null) {
        return def;
      }
      if (def.startDate && def.startDate > lastResult.startDate) {
        return def;
      }
      return lastResult;
    }, this.macroDefinitions[0]);
  }

  getCurrentWeight() {
    return this.weighIns.reduce((lastResult, weighIn) => {
      if (weighIn.date > lastResult.date) {
        return weighIn;
      }
      return lastResult;
    }, this.weighIns[0]);
  }

  hasRequiredData() {
    return !!(this.name && this.macroDefinitions.length);
  }

  getUserData(): UserData {
    return {
      name: this.name,
      birthday: this.getBirthdayString(),
      measurementSystem: this.measurementSystem,
      height: this.height?.height || 0,
      weight: this.getCurrentWeight()?.weight || 0,
      macroDefinition: MacroDefinition.getMacroStrings(this.getCurrentMacros()),
    };
  }

  update(userData: UserData) {
    // name
    if (userData.name !== this.name) {
      this.name = userData.name;
    }
    // birthday
    if (userData.birthday !== this.getBirthdayString()) {
      this.birthday = birthdayStringToDate(userData.birthday);
    }
    // measurementSystem
    if (userData.measurementSystem !== this.measurementSystem) {
      this.measurementSystem = userData.measurementSystem;

      // if the measurementSystem has changed, we need to update height
      // and/or add a weighIn if values are provided
      if (userData.measurementSystem) {
        // height
        if (userData.height) {
          this.height = new Height({
            height: userData.height,
            measurementSystem: userData.measurementSystem,
          });
        }
        // weight
        if (userData.weight) {
          this.weighIns.unshift(
            new WeighIn({
              weight: userData.weight,
              measurementSystem: userData.measurementSystem,
            }),
          );
        }
      }
    } else if (userData.measurementSystem) {
      // if the measurementSystem is set but has not changed, check for height and weight updates
      // height
      if (userData.height !== this.height?.height) {
        this.height = new Height({
          height: userData.height,
          measurementSystem: userData.measurementSystem,
        });
      }
      // weight
      if (userData.weight !== this.getCurrentWeight()?.weight) {
        this.weighIns.unshift(
          new WeighIn({
            weight: userData.weight,
            measurementSystem: userData.measurementSystem,
          }),
        );
      }
    }
    // macroDefinitions
    this.updateMacros(userData.macroDefinition);
  }

  updateMacros(macroDef: MacroDefinitionStrings) {
    const currentMacros = this.getCurrentMacros();
    if (!currentMacros) {
      this.macroDefinitions = [new MacroDefinition(macroDef)];
    } else if (!currentMacros.isEqualTo(macroDef)) {
      this.macroDefinitions.push(new MacroDefinition(macroDef));
    }
  }

  addFoodItem(foodItemId: UUID) {
    this.foodItems.push(foodItemId);
  }

  static isValidBirthdayString(bday: string): boolean {
    if (!bday) {
      return true;
    }
    if (!BDAY_REGEX.test(bday)) {
      return false;
    }
    const parts = bday.split('/');
    const year = +parts[2];
    const monthIdx = +parts[0] - 1;
    const day = +parts[1];
    const date = new Date(year, monthIdx, day);
    // date was create as it was entered with no wonky month over/under non-sense
    return (
      date.getFullYear() === year &&
      date.getMonth() === monthIdx &&
      date.getDate() === day
    );
  }

  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      realmUserId: 'string',
      name: 'string',
      height: 'Height?',
      birthday: 'date?',
      measurementSystem: 'string?',
      weighIns: 'WeighIn[]',
      macroDefinitions: 'MacroDefinition[]',
      foodItems: 'uuid[]',
      foodItemGroups: 'uuid[]',
    },
  };
}

export default User;
