import { RecordType } from '../../constants/nem12-parser.constants';
import { ParseInput, ParseResults } from '../../types/parser.types';
import { NEM12Validator } from '../../validator/nem12-validator';
import { RecordParser } from './record-parser.interface';

export class EndOfDataRecordParser implements RecordParser {
  constructor(private validator: NEM12Validator) {}

  canHandle(recordType: string): boolean {
    return recordType === RecordType.END_OF_DATA;
  }

  parse(input: ParseInput): ParseResults {
    return {
      recordType: RecordType.END_OF_DATA,
      validationErrors: [],
      meterReadings: null,
    };
  }
}
