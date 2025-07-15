import {
  NMIDataDetailsIndex,
  RecordType,
} from '../../constants/nem12-parser.constants';
import {
  ParseContext,
  ParseInput,
  ParseResults,
} from '../../types/parser.types';
import { NEM12Validator } from '../../validator/nem12-validator';
import { RecordParser } from './record-parser.interface';

export class NMIRecordParser implements RecordParser {
  constructor(private validator: NEM12Validator) {}

  canHandle(recordType: string): boolean {
    return recordType === RecordType.NMI_DATA_DETAILS;
  }

  parse(input: ParseInput): ParseResults {
    const { fields, lineNumber, context } = input;

    const validationErrors = this.validator.validateNMIRecord({
      fields,
      lineNumber,
    });
    if (validationErrors.length > 0) {
      return {
        recordType: RecordType.NMI_DATA_DETAILS,
        validationErrors,
        meterReadings: null,
      };
    }

    context.currentNMI = fields[NMIDataDetailsIndex.NMI];
    context.currentIntervalLength = parseInt(
      fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
    );
    return {
      recordType: RecordType.NMI_DATA_DETAILS,
      validationErrors: [],
      meterReadings: null,
    };
  }
}
