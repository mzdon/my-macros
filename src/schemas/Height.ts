import {MeasurementSystem} from 'types/MeasurementSystem';
import {UnitOfMeasurement} from 'types/UnitOfMeasurement';
import {heightUom} from 'utils/UnitOfMeasurement';

interface Base {
  height: number;
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

class Height {
  height!: number;
  unitOfMeasurement!: UnitOfMeasurement;

  constructor(obj?: ConstructorObject) {
    if (obj) {
      const {height, unitOfMeasurement, measurementSystem} = obj;
      this.height = height;
      this.unitOfMeasurement =
        unitOfMeasurement || heightUom(measurementSystem as MeasurementSystem);
    }
  }

  getDisplayString(): string {
    return `${this.height} ${this.unitOfMeasurement}`;
  }

  static schema = {
    name: 'Height',
    embedded: true,
    properties: {
      height: 'double',
      unitOfMeasurement: 'string',
    },
  };
}

export default Height;

export interface HeightModel {
  height: number;
  unitOfMeasurement: UnitOfMeasurement;
}
