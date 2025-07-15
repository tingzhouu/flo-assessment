import { PROGRESS_LOG_INTERVAL } from '../constants/nem12-converter.constants';

export class ConversionLogger {
  logProgress(totalReadings: number): void {
    if (totalReadings % PROGRESS_LOG_INTERVAL === 0) {
      console.log(`Processed ${totalReadings} readings...`);
    }
  }

  logError(message: string): void {
    console.error(message);
  }

  logCompletion(outputPath: string): void {
    console.log(`✅ Successfully processed readings to ${outputPath}`);
  }

  logHasErrors(hasErrors: boolean): void {
    console.log('hasErrors', hasErrors);
  }

  logFatalValidationError(): void {
    console.error('Fatal validation errors encountered - stopping processing');
  }
}
