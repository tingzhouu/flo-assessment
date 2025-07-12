import * as fs from 'fs';
import * as path from 'path';
import { NEM12Parser } from '../parser/nem12.parser';
import { SQLGenerator } from '../sql-generator/sql-generator';
import { formatTimestampWithoutTimezone } from '../utils/datetime';

export class NEM12Converter {
  private parser: NEM12Parser;
  private sqlGenerator: SQLGenerator;

  constructor() {
    this.parser = new NEM12Parser();
    this.sqlGenerator = new SQLGenerator();
  }

  async convertFile(input: {
    inputPath: string;
    outputPath: string;
  }): Promise<void> {
    const { inputPath, outputPath } = input;
    const tempPath = `${outputPath}.tmp`;
    let writeStream: fs.WriteStream | null = null;

    try {
      // Create write stream to temporary file
      writeStream = fs.createWriteStream(tempPath);

      // Write SQL header
      writeStream.write('-- Generated NEM12 meter readings\n');
      writeStream.write(`-- Source: ${path.basename(inputPath)}\n`);
      writeStream.write(`-- Generated: ${new Date().toISOString()}\n\n`);

      let totalReadings = 0;
      const nmiSet = new Set<string>();
      let dateRange: { min: Date | null; max: Date | null } = {
        min: null,
        max: null,
      };

      // Process file in batches
      for await (const batch of this.parser.parseFile(inputPath)) {
        if (batch.length > 0) {
          batch.forEach((reading) => {
            nmiSet.add(reading.nmi);
            if (!dateRange.min || reading.timestamp < dateRange.min) {
              dateRange.min = reading.timestamp;
            }
            if (!dateRange.max || reading.timestamp > dateRange.max) {
              dateRange.max = reading.timestamp;
            }
          });

          const sql = this.sqlGenerator.generateBatchInsert(batch);
          writeStream.write(sql + '\n\n');
          totalReadings += batch.length;

          // Progress logging
          if (totalReadings % 10000 === 0) {
            console.log(`Processed ${totalReadings} readings...`);
          }
        }
      }

      // Write footer
      writeStream.write(`-- Total readings: ${totalReadings}\n`);
      writeStream.write(`-- NMI count: ${nmiSet.size}\n`);
      if (dateRange.min instanceof Date && dateRange.max instanceof Date) {
        writeStream.write(
          `-- Date range: ${formatTimestampWithoutTimezone(dateRange.min)} to ${formatTimestampWithoutTimezone(dateRange.max)}\n`
        );
      }

      // Close stream
      writeStream.end();
      await this.waitForStreamClose(writeStream);

      // Move temp file to final location
      await fs.promises.rename(tempPath, outputPath);

      console.log(
        `✅ Successfully processed ${totalReadings} readings to ${outputPath}`
      );
    } catch (error) {
      // Cleanup on error
      if (writeStream) {
        writeStream.destroy();
      }

      // Remove temp file if it exists
      try {
        await fs.promises.unlink(tempPath);
      } catch (unlinkError) {
        // Ignore if file doesn't exist
      }

      throw new Error(`Processing failed: ${error.message}`);
    }
  }

  private waitForStreamClose(stream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
      stream.on('close', resolve);
      stream.on('error', reject);
    });
  }
}
