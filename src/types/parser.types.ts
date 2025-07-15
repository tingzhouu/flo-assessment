import { MeterReading } from './meter-reading.types';
import { RecordType } from '../constants/nem12-parser.constants';
import { ValidationError } from './validator.types';

export type ParseResults = {
  validationErrors: ValidationError[];
  meterReadings: MeterReading[] | null;
  recordType: RecordType;
};

export type ParseContext = {
  currentNMI: string | null;
  currentIntervalLength: number | null;
};

export type ParseInput = {
  fields: string[];
  lineNumber: number;
  context: ParseContext;
};
