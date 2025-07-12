import {
  HEADER_RECORD_FIELD_LENGTH,
  HeaderRecordIndex,
  INTERVAL_DATA_NON_INTERVAL_VALUE_LENGTH,
  INTERVAL_LENGTHS,
  NMI_RECORD_FIELD_LENGTH,
  NMIDataDetailsIndex,
  NUM_MINS_IN_DAY,
  VERSION_HEADER,
} from '../constants/parser.constants';
import { ValidationSeverity } from '../constants/validator.constants';
import { ValidationError } from '../types/validator.types';

export class NEM12Validator {
  private errors: ValidationError[] = [];
  private hasHeader = false;
  private hasFooter = false;

  validateHeaderRecord(input: {
    fields: string[];
    lineNumber: number;
  }): boolean {
    const { fields, lineNumber } = input;
    if (fields.length < HEADER_RECORD_FIELD_LENGTH) {
      this.addError(
        lineNumber,
        'Header record missing required fields',
        ValidationSeverity.WARNING
      );
      return false;
    }

    if (fields[HeaderRecordIndex.VERSION] !== VERSION_HEADER) {
      this.addError(
        lineNumber,
        `Expected NEM12 format, got: ${fields[HeaderRecordIndex.VERSION]}`,
        ValidationSeverity.FATAL
      );
      return false;
    }

    this.hasHeader = true;
    return true;
  }

  validateNMIRecord(input: { fields: string[]; lineNumber: number }): boolean {
    const { fields, lineNumber } = input;
    if (fields.length < NMI_RECORD_FIELD_LENGTH) {
      this.addError(
        lineNumber,
        'NMI record missing required fields',
        ValidationSeverity.ERROR
      );
      return false;
    }

    const intervalLength = parseInt(
      fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
    );
    if (!INTERVAL_LENGTHS.includes(intervalLength)) {
      this.addError(
        lineNumber,
        `Invalid interval length: ${fields[NMIDataDetailsIndex.INTERVAL_LENGTH]}`,
        ValidationSeverity.ERROR
      );
      return false;
    }

    return true;
  }

  validateIntervalRecord(input: {
    fields: string[];
    lineNumber: number;
    intervalLength: number | null;
  }): boolean {
    const { fields, lineNumber, intervalLength } = input;

    if (intervalLength === null) {
      this.addError(
        lineNumber,
        'Interval length is not set',
        ValidationSeverity.FATAL
      );
      return false;
    }

    const intervalsPerDay = NUM_MINS_IN_DAY / intervalLength;
    const expectedFields =
      intervalsPerDay + INTERVAL_DATA_NON_INTERVAL_VALUE_LENGTH;

    if (fields.length < expectedFields) {
      this.addError(
        lineNumber,
        `Interval record missing required fields. Expected ${expectedFields}, got ${fields.length}`,
        ValidationSeverity.ERROR
      );
      return false;
    }

    const dateStr = fields[1];
    if (!this.isValidDate(dateStr)) {
      this.addError(
        lineNumber,
        `Invalid date: ${dateStr}`,
        ValidationSeverity.ERROR
      );
      return false;
    }

    return true;
  }

  validateFileStructure(): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!this.hasHeader) {
      errors.push({
        line: 0,
        message: 'File missing required header record (100)',
        severity: ValidationSeverity.FATAL,
        code: 'MISSING_HEADER',
      });
    }

    if (!this.hasFooter) {
      errors.push({
        line: 0,
        message:
          'File missing required end record (900) - file may be truncated',
        severity: ValidationSeverity.ERROR,
        code: 'MISSING_FOOTER',
      });
    }

    return errors;
  }

  private isValidDate(dateStr: string): boolean {
    return dateStr.length === 8 && /^\d{8}$/.test(dateStr);
  }

  private addError(
    line: number,
    message: string,
    severity: ValidationSeverity
  ): void {
    this.errors.push({ line, message, severity, code: 'VALIDATION_ERROR' });
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }
  hasErrors(): boolean {
    return this.errors.length > 0;
  }
  hasFatalErrors(): boolean {
    return this.errors.some((e) => e.severity === ValidationSeverity.FATAL);
  }
}
