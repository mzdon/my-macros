import {UnitOfMeasurement} from 'types/UnitOfMeasurement';

export interface WeighIn {
  date: Date;
  weight: number;
  unitOfMeasurement: UnitOfMeasurement;
}
