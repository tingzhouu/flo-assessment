import { ConversionState, ConversionContext } from './conversion-context';
import { ParseUnexpectedError } from '../types/parser.types';
import { ValidationError } from '../types/validator.types';
import { ValidationSeverity } from '../constants/nem12-validator.constants';

export class ErrorTracker {
  recordUnexpectedError(
    parseResult: ParseUnexpectedError,
    context: ConversionContext,
    state: ConversionState
  ): void {
    if (context.errorStream) {
      context.errorStream.write(
        `${parseResult.lineNumber}: ${parseResult.error}\n`
      );
    }
    state.hasErrors = true;
    state.prematureEndOfFile = true;
  }

  recordValidationErrors(
    validationErrors: ValidationError[],
    context: ConversionContext,
    state: ConversionState
  ): void {
    if (validationErrors.length > 0) {
      state.hasErrors = true;
      validationErrors.forEach((error) => {
        if (context.errorStream) {
          context.errorStream.write(
            `${error.line}: (${error.code}) ${error.message}\n`
          );
        }
      });
    }
  }

  shouldStopProcessing(validationErrors: ValidationError[]): boolean {
    return validationErrors.some(
      (error) => error.severity === ValidationSeverity.FATAL
    );
  }

  recordFileStructureErrors(
    headerRowCount: number,
    footerRowCount: number,
    prematureEndOfFile: boolean,
    context: ConversionContext
  ): void {
    if (headerRowCount !== 1 && !prematureEndOfFile && context.errorStream) {
      context.errorStream.write(
        `Expected 1 header record, got ${headerRowCount}\n`
      );
    }

    if (footerRowCount !== 1 && !prematureEndOfFile && context.errorStream) {
      context.errorStream.write(
        `Expected 1 end of file record, got ${footerRowCount}, check if file is truncated\n`
      );
    }
  }
}
