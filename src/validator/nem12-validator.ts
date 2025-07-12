import {
  HEADER_RECORD_FIELD_LENGTH,
  HeaderRecordIndex,
  INTERVAL_DATA_NON_INTERVAL_VALUE_LENGTH,
  INTERVAL_LENGTHS,
  IntervalDataIndex,
  NMI_RECORD_FIELD_LENGTH,
  NMIDataDetailsIndex,
  NUM_MINS_IN_DAY,
  VERSION_HEADER,
} from '../constants/nem12-parser.constants';
import {
  HIGH_CONSUMPTION_THRESHOLD,
  ValidationCode,
  ValidationSeverity,
} from '../constants/nem12-validator.constants';
import { ValidationError } from '../types/validator.types';
import { isValidNEM12Date } from '../utils/datetime';
import { isValidDecimal } from '../utils/numeric-values';

export class NEM12Validator {
  validateHeaderRecord(input: {
    fields: string[];
    lineNumber: number;
  }): ValidationError[] {
    const validationErrors: ValidationError[] = [];
    const { fields, lineNumber } = input;
    if (fields.length < HEADER_RECORD_FIELD_LENGTH) {
      validationErrors.push({
        line: lineNumber,
        message: 'Header record missing required fields',
        severity: ValidationSeverity.ERROR,
        code: ValidationCode.MISSING_HEADER_FIELDS,
      });
    }

    if (fields[HeaderRecordIndex.VERSION] !== VERSION_HEADER) {
      validationErrors.push({
        line: lineNumber,
        message: `Expected NEM12 format, got: ${fields[HeaderRecordIndex.VERSION]}`,
        severity: ValidationSeverity.FATAL,
        code: ValidationCode.INVALID_VERSION,
      });
    }

    return validationErrors;
  }

  validateNMIRecord(input: {
    fields: string[];
    lineNumber: number;
  }): ValidationError[] {
    const validationErrors: ValidationError[] = [];
    const { fields, lineNumber } = input;
    if (fields.length < NMI_RECORD_FIELD_LENGTH) {
      validationErrors.push({
        line: lineNumber,
        message: 'NMI record missing required fields',
        severity: ValidationSeverity.ERROR,
        code: ValidationCode.MISSING_NMI_FIELDS,
      });
    }

    const intervalLength = parseInt(
      fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
    );
    if (!INTERVAL_LENGTHS.includes(intervalLength)) {
      validationErrors.push({
        line: lineNumber,
        message: `Invalid interval length: ${fields[NMIDataDetailsIndex.INTERVAL_LENGTH]}`,
        severity: ValidationSeverity.ERROR,
        code: ValidationCode.INVALID_INTERVAL_LENGTH,
      });
    }

    return validationErrors;
  }

  validateIntervalRecord(input: {
    fields: string[];
    lineNumber: number;
    intervalLength: number | null;
  }): ValidationError[] {
    const validationErrors: ValidationError[] = [];
    const { fields, lineNumber, intervalLength } = input;

    if (intervalLength === null) {
      validationErrors.push({
        line: lineNumber,
        message: 'Interval length is not set',
        severity: ValidationSeverity.FATAL,
        code: ValidationCode.MISSING_INTERVAL_LENGTH,
      });
      return validationErrors;
    }

    const intervalsPerDay = NUM_MINS_IN_DAY / intervalLength;
    const expectedFields =
      intervalsPerDay + INTERVAL_DATA_NON_INTERVAL_VALUE_LENGTH;

    if (fields.length < expectedFields) {
      validationErrors.push({
        line: lineNumber,
        message: `Interval record missing required fields. Expected ${expectedFields}, got ${fields.length}`,
        severity: ValidationSeverity.ERROR,
        code: ValidationCode.MISSING_INTERVAL_FIELDS,
      });
    }

    const dateStr = fields[1];
    if (!isValidNEM12Date(dateStr)) {
      validationErrors.push({
        line: lineNumber,
        message: `Invalid date: ${dateStr}`,
        severity: ValidationSeverity.ERROR,
        code: ValidationCode.INVALID_DATE,
      });
    }

    const consumptionFields = fields.slice(
      IntervalDataIndex.INTERVAL_VALUES,
      IntervalDataIndex.INTERVAL_VALUES + intervalsPerDay
    );

    consumptionFields.forEach((valueStr, index) => {
      if (!valueStr.trim() || valueStr.trim() === '0') {
        return;
      }

      if (!isValidDecimal(valueStr.trim())) {
        validationErrors.push({
          line: lineNumber,
          message: `Invalid consumption value at interval ${index + 1}: '${valueStr}' is not a valid decimal`,
          severity: ValidationSeverity.ERROR,
          code: ValidationCode.INVALID_CONSUMPTION_FORMAT,
        });
        return;
      }

      const numericValue = parseFloat(valueStr.trim());
      if (numericValue < 0) {
        validationErrors.push({
          line: lineNumber,
          message: `Invalid consumption value at interval ${index + 1}: '${valueStr}' cannot be negative`,
          severity: ValidationSeverity.ERROR,
          code: ValidationCode.NEGATIVE_CONSUMPTION,
        });
      }

      if (numericValue > HIGH_CONSUMPTION_THRESHOLD) {
        validationErrors.push({
          line: lineNumber,
          message: `Suspicious consumption value at interval ${index + 1}: '${valueStr}' seems unusually high`,
          severity: ValidationSeverity.WARNING,
          code: ValidationCode.SUSPICIOUS_CONSUMPTION_HIGH,
        });
      }
    });

    return validationErrors;
  }
}
