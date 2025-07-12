import * as fs from 'fs';
import * as path from 'path';
import {
  ERROR_FILE_EXTENSION,
  PROGRESS_LOG_INTERVAL,
  SQL_FILE_EXTENSION,
  TEMP_FILE_EXTENSION,
} from '../constants/nem12-converter.constants';
import { ValidationSeverity } from '../constants/nem12-validator.constants';
import { NEM12Parser } from '../parser/nem12.parser';
import { NEM12SQLGenerator } from '../sql-generator/nem12-sql-generator';
import { RecordType } from '../types/nem12-file.types';
import { formatTimestampWithoutTimezone } from '../utils/datetime';

export class NEM12Converter {
  private parser: NEM12Parser;
  private sqlGenerator: NEM12SQLGenerator;

  constructor() {
    this.parser = new NEM12Parser();
    this.sqlGenerator = new NEM12SQLGenerator();
  }

  async convertFile(input: {
    inputPath: string;
    outputPath: string;
  }): Promise<void> {
    const { inputPath, outputPath } = input;
    const tempPath = `${outputPath}${TEMP_FILE_EXTENSION}`;
    const errorPath = `${outputPath}${ERROR_FILE_EXTENSION}`;
    let writeStream: fs.WriteStream | null = null;
    let hasErrors = false;

    try {
      // Create write stream to temporary file
      writeStream = fs.createWriteStream(tempPath);
      const errorStream = fs.createWriteStream(errorPath);

      // Write SQL header
      writeStream.write('-- Generated NEM12 meter readings\n');
      writeStream.write(`-- Source: ${path.basename(inputPath)}\n`);
      writeStream.write(`-- Generated: ${new Date().toISOString()}\n\n`);

      let totalReadings = 0;
      let headerRowCount = 0;
      let footerRowCount = 0;
      let prematureEndOfFile = false;
      const nmiSet = new Set<string>();
      let dateRange: { min: Date | null; max: Date | null } = {
        min: null,
        max: null,
      };

      for await (const {
        meterReadings,
        recordType,
        validationErrors,
      } of this.parser.parseFile(inputPath)) {
        if (recordType === RecordType.HEADER) {
          headerRowCount++;
        } else if (recordType === RecordType.END_OF_DATA) {
          footerRowCount++;
        }

        if (recordType === RecordType.INTERVAL_DATA && meterReadings) {
          meterReadings.forEach((reading) => {
            nmiSet.add(reading.nmi);
            if (!dateRange.min || reading.timestamp < dateRange.min) {
              dateRange.min = reading.timestamp;
            }
            if (!dateRange.max || reading.timestamp > dateRange.max) {
              dateRange.max = reading.timestamp;
            }
          });

          const sql = this.sqlGenerator.generateBatchInsert(meterReadings);
          writeStream.write(sql + '\n\n');
          totalReadings += meterReadings.length;

          // Progress logging
          if (totalReadings % PROGRESS_LOG_INTERVAL === 0) {
            console.log(`Processed ${totalReadings} readings...`);
          }
        }

        if (validationErrors.length > 0) {
          hasErrors = true;
          validationErrors.forEach((error) => {
            errorStream.write(
              `${error.line}: (${error.code}) ${error.message}\n`
            );
          });
        }

        if (
          validationErrors.some(
            (error) => error.severity === ValidationSeverity.FATAL
          )
        ) {
          console.error(
            'Fatal validation errors encountered - stopping processing'
          );
          prematureEndOfFile = true;
          break;
        }
      }

      if (headerRowCount !== 1 && !prematureEndOfFile) {
        errorStream.write(`Expected 1 header record, got ${headerRowCount}\n`);
      }

      if (footerRowCount !== 1 && !prematureEndOfFile) {
        errorStream.write(
          `Expected 1 end of file record, got ${footerRowCount}, check if file is truncated\n`
        );
      }

      // Write footer
      writeStream.write(`-- Total readings: ${totalReadings}\n`);
      writeStream.write(`-- NMI count: ${nmiSet.size}\n`);
      if (dateRange.min instanceof Date && dateRange.max instanceof Date) {
        writeStream.write(
          `-- Date range: ${formatTimestampWithoutTimezone(dateRange.min)} to ${formatTimestampWithoutTimezone(dateRange.max)}\n`
        );
      }

      if (!hasErrors) {
        await this.removeFile(errorPath);
      }

      // Close stream
      writeStream.end();
      await this.waitForStreamClose(writeStream);

      // Move temp file to final location
      await fs.promises.rename(tempPath, `${outputPath}${SQL_FILE_EXTENSION}`);

      console.log(
        `✅ Successfully processed ${totalReadings} readings to ${outputPath}${SQL_FILE_EXTENSION}`
      );
    } catch (error) {
      // Cleanup on error
      if (writeStream) {
        writeStream.destroy();
      }

      await this.removeFile(tempPath);

      console.log('hasErrors', hasErrors);
      if (!hasErrors) {
        await this.removeFile(errorPath);
      }

      throw new Error(`Unexpected error: ${error.message}`);
    }
  }

  private async removeFile(path: string): Promise<void> {
    try {
      await fs.promises.unlink(path);
    } catch (error) {
      // used for error and temp files
      // Ignore if file does not exist
    }
  }

  private waitForStreamClose(stream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on('close', resolve);
      stream.on('error', reject);
    });
  }
}
