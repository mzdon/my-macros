import {MeasurementSystem} from 'types/MeasurementSystem';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {weightUom} from 'utils/UnitOfMeasurement';

interface Base {
  weight: number;
}

interface UOM extends Base {
  unitOfMeasurement: UnitOfMeasurement;
  measurementSystem?: never;
}

interface MS extends Base {
  unitOfMeasurement?: never;
  measurementSystem: MeasurementSystem;
}

type ConstructorObject = UOM | MS;

class WeighIn {
  // @ts-ignore
  date: Date;
  // @ts-ignore
  weight: number;
  // @ts-ignore
  unitOfMeasurement: UnitOfMeasurement;

  constructor(obj?: ConstructorObject) {
    if (obj) {
      const {weight, unitOfMeasurement, measurementSystem} = obj;
      this.weight = weight;
      this.date = new Date();
      this.unitOfMeasurement =
        unitOfMeasurement || weightUom(measurementSystem as MeasurementSystem);
    }
  }

  getDisplayString(): string {
    return `${this.weight} ${this.unitOfMeasurement}`;
  }

  static schema = {
    name: 'WeighIn',
    embedded: true,
    properties: {
      date: 'date',
      weight: 'double',
      unitOfMeasurement: 'string',
    },
  };
}

export default WeighIn;
