import { MeterReading } from './meter-reading.types';
import { RecordType } from './nem12-file.types';
import { ValidationError } from './validator.types';

export type ParseResults = {
  validationErrors: ValidationError[];
  meterReadings: MeterReading[] | null;
  recordType: RecordType;
};
