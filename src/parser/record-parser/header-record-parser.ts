import { RecordType } from '../../constants/nem12-parser.constants';
import { ParseInput, ParseResults } from '../../types/parser.types';
import { NEM12Validator } from '../../validator/nem12-validator';
import { RecordParser } from './record-parser.interface';

export class HeaderRecordParser implements RecordParser {
  constructor(private validator: NEM12Validator) {}

  canHandle(recordType: string): boolean {
    return recordType === RecordType.HEADER;
  }

  parse(input: ParseInput): ParseResults {
    const { fields, lineNumber } = input;
    const validationErrors = this.validator.validateHeaderRecord({
      fields,
      lineNumber,
    });

    return {
      recordType: RecordType.HEADER,
      validationErrors,
      meterReadings: null,
    };
  }
}
