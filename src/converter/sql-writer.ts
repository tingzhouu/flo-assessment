import * as path from 'path';
import { ConversionContext, ConversionStats } from './conversion-context';
import { MeterReading } from '../types/meter-reading.types';
import { NEM12SQLGenerator } from '../sql-generator/nem12-sql-generator';
import { formatTimestampWithoutTimezone } from '../utils/datetime';

export class SQLWriter {
  constructor(private sqlGenerator: NEM12SQLGenerator) {}

  writeHeader(context: ConversionContext): void {
    if (!context.sqlStream) return;

    const { sqlStream, inputPath } = context;
    sqlStream.write('-- Generated NEM12 meter readings\n');
    sqlStream.write(`-- Source: ${path.basename(inputPath)}\n`);
    sqlStream.write(`-- Generated: ${new Date().toISOString()}\n\n`);
  }

  writeMeterReadings(
    meterReadings: MeterReading[],
    context: ConversionContext
  ): void {
    if (!context.sqlStream) return;

    const sql = this.sqlGenerator.generateBatchInsert(meterReadings);
    context.sqlStream.write(sql + '\n\n');
  }

  writeFooter(context: ConversionContext, stats: ConversionStats): void {
    if (!context.sqlStream) return;

    const { sqlStream } = context;
    sqlStream.write(`-- Total readings: ${stats.totalReadings}\n`);
    sqlStream.write(`-- NMI count: ${stats.nmiSet.size}\n`);

    if (
      stats.dateRange.min instanceof Date &&
      stats.dateRange.max instanceof Date
    ) {
      sqlStream.write(
        `-- Date range: ${formatTimestampWithoutTimezone(stats.dateRange.min)} to ${formatTimestampWithoutTimezone(stats.dateRange.max)}\n`
      );
    }
  }
}
