import { RecordType } from '../constants/nem12-parser.constants';
import { NEM12Parser } from '../parser/nem12.parser';
import { ParseResults, ParseUnexpectedError } from '../types/parser.types';
import {
  ConversionContext,
  ConversionInput,
  ConversionState,
} from './conversion-context';
import { ConversionLogger } from './conversion-logger';
import { ErrorTracker } from './error-tracker';
import { FileSystemManager } from './file-system-manager';
import { SQLWriter } from './sql-writer';
import { StatisticsCollector } from './statistics-collector';
import { StreamManager } from './stream-manager';

export class NEM12Converter {
  constructor(
    private parser: NEM12Parser,
    private streamManager: StreamManager,
    private fileSystemManager: FileSystemManager,
    private logger: ConversionLogger,
    private sqlWriter: SQLWriter,
    private errorTracker: ErrorTracker
  ) {}

  async convertFile(input: ConversionInput): Promise<void> {
    const context = this.fileSystemManager.createContext(input);
    const statsCollector = new StatisticsCollector();
    const state: ConversionState = {
      hasErrors: false,
      prematureEndOfFile: false,
    };

    try {
      await this.streamManager.createStreams(context);
      this.sqlWriter.writeHeader(context);
      await this.processFile(context, statsCollector, state);
      this.sqlWriter.writeFooter(context, statsCollector.getStats());
      await this.finalizeConversion(context, state);
    } catch (error) {
      await this.handleConversionError(context, state, error);
      throw error;
    }
  }

  private async processFile(
    context: ConversionContext,
    statsCollector: StatisticsCollector,
    state: ConversionState
  ): Promise<void> {
    for await (const parseResult of this.parser.parseFile(context.inputPath)) {
      if (this.isUnexpectedError(parseResult)) {
        this.errorTracker.recordUnexpectedError(parseResult, context, state);
        break;
      }

      this.processParseResult(parseResult, context, statsCollector, state);

      if (
        this.errorTracker.shouldStopProcessing(parseResult.validationErrors)
      ) {
        state.prematureEndOfFile = true;
        break;
      }
    }

    this.errorTracker.recordFileStructureErrors(
      statsCollector.getHeaderRowCount(),
      statsCollector.getFooterRowCount(),
      state.prematureEndOfFile,
      context
    );
  }

  private isUnexpectedError(
    parseResult: ParseResults | ParseUnexpectedError
  ): parseResult is ParseUnexpectedError {
    return 'error' in parseResult;
  }

  private processParseResult(
    parseResult: ParseResults,
    context: ConversionContext,
    statsCollector: StatisticsCollector,
    state: ConversionState
  ): void {
    const { recordType, meterReadings, validationErrors } = parseResult;

    statsCollector.updateRecordCounts(recordType);
    this.errorTracker.recordValidationErrors(validationErrors, context, state);

    if (recordType === RecordType.INTERVAL_DATA && meterReadings) {
      statsCollector.addMeterReadings(meterReadings);
      this.sqlWriter.writeMeterReadings(meterReadings, context);
      this.logger.logProgress(statsCollector.getTotalReadings());
    }
  }

  private async finalizeConversion(
    context: ConversionContext,
    state: ConversionState
  ): Promise<void> {
    await this.streamManager.closeStreams(context);
    await this.fileSystemManager.cleanupOnSuccess(context, state.hasErrors);
    await this.fileSystemManager.moveToFinal(context);

    const finalPath = this.fileSystemManager.getFinalOutputPath(context);
    this.logger.logCompletion(finalPath);
  }

  private async handleConversionError(
    context: ConversionContext,
    state: ConversionState,
    error: Error
  ): Promise<void> {
    await this.streamManager.destroyStreams(context);
    await this.fileSystemManager.cleanupOnError(context, state.hasErrors);

    this.logger.logHasErrors(state.hasErrors);
    throw new Error(`Unexpected error: ${error.message}`);
  }
}
