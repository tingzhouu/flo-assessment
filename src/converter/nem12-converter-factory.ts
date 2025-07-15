import { NEM12Parser } from '../parser/nem12.parser';
import { CompositeParser } from '../parser/record-parser/composite-parser';
import { NEM12SQLGenerator } from '../sql-generator/nem12-sql-generator';
import { ConversionLogger } from './conversion-logger';
import { ErrorTracker } from './error-tracker';
import { FileSystemManager } from './file-system-manager';
import { NEM12Converter } from './nem12-converter';
import { SQLWriter } from './sql-writer';
import { StreamManager } from './stream-manager';

/**
 * Factory function to create a fully configured NEM12Converter with all dependencies injected.
 */
export function createNEM12Converter(): NEM12Converter {
  // Create all the required dependencies
  const parser = new NEM12Parser(new CompositeParser());
  const sqlGenerator = new NEM12SQLGenerator();
  const streamManager = new StreamManager();
  const fileSystemManager = new FileSystemManager();
  const logger = new ConversionLogger();
  const sqlWriter = new SQLWriter(sqlGenerator);
  const errorTracker = new ErrorTracker();

  // Inject all dependencies into the converter
  return new NEM12Converter(
    parser,
    streamManager,
    fileSystemManager,
    logger,
    sqlWriter,
    errorTracker
  );
}

/**
 * Factory function to create NEM12Converter with custom dependencies.
 * Useful for testing or when you need to customize specific components.
 */
export function createNEM12ConverterWithDependencies(dependencies: {
  parser?: NEM12Parser;
  streamManager?: StreamManager;
  fileSystemManager?: FileSystemManager;
  logger?: ConversionLogger;
  sqlWriter?: SQLWriter;
  errorTracker?: ErrorTracker;
}): NEM12Converter {
  const parser = dependencies.parser ?? new NEM12Parser(new CompositeParser());
  const streamManager = dependencies.streamManager ?? new StreamManager();
  const fileSystemManager =
    dependencies.fileSystemManager ?? new FileSystemManager();
  const logger = dependencies.logger ?? new ConversionLogger();
  const sqlWriter =
    dependencies.sqlWriter ?? new SQLWriter(new NEM12SQLGenerator());
  const errorTracker = dependencies.errorTracker ?? new ErrorTracker();

  return new NEM12Converter(
    parser,
    streamManager,
    fileSystemManager,
    logger,
    sqlWriter,
    errorTracker
  );
}
