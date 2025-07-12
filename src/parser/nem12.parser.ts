import Decimal from 'decimal.js';
import * as fs from 'fs';
import * as readline from 'readline';
import {
  IntervalDataIndex,
  NMIDataDetailsIndex,
  NUM_MINS_IN_DAY,
  RECORD_TYPE_INDEX,
} from '../constants/parser.constants';
import { MeterReading } from '../types/meter-reading.types';
import { RecordType } from '../types/nem12.types';
import {
  calculateIntervalTimestamp,
  parseDateStrFromNEM12,
} from '../utils/datetime';
import { NEM12Validator } from '../validator/nem12-validator';

export class NEM12Parser {
  private currentNMI: string | null = null;
  private currentIntervalLength: number | null = null;
  private validator = new NEM12Validator();

  getCurrentNMI(): string | null {
    return this.currentNMI;
  }

  getCurrentIntervalLength(): number | null {
    return this.currentIntervalLength;
  }

  async *parseFile(filePath: string): AsyncGenerator<any[]> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;

      if (!line.trim()) continue;

      const fields = line.split(',');
      const recordType = fields[RECORD_TYPE_INDEX];

      try {
        switch (recordType) {
          case RecordType.HEADER:
            this.validator.validateHeaderRecord({ fields, lineNumber });
            break;

          case RecordType.NMI_DATA_DETAILS:
            if (this.validator.validateNMIRecord({ fields, lineNumber })) {
              this.currentNMI = fields[NMIDataDetailsIndex.NMI];
              this.currentIntervalLength = parseInt(
                fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
              );
            }
            break;

          case RecordType.INTERVAL_DATA:
            if (
              this.validator.validateIntervalRecord({
                fields,
                lineNumber,
                intervalLength: this.currentIntervalLength,
              })
            ) {
              const readings = this.parseIntervalData(fields);
              if (readings.length > 0) {
                yield readings;
              }
            }

            break;

          case RecordType.END_OF_DATA:
            console.log('End of file reached');
            return;

          default:
            // Ignore 400, 500 which are not required for SQL generation
            break;
        }

        if (this.validator.hasFatalErrors()) {
          console.error(
            'Fatal validation errors encountered - stopping processing'
          );
          return;
        }
      } catch (error) {
        console.warn(`Line ${lineNumber}: ${error.message}`);
      }
    }

    this.validator.validateFileStructure();
  }

  private parseIntervalData(fields: string[]): MeterReading[] {
    if (!this.currentNMI || !this.currentIntervalLength) {
      throw new Error('No NMI context available for interval data');
    }

    const readings: MeterReading[] = [];
    const dateStr = fields[IntervalDataIndex.INTERVAL_DATE]; // '20050301'
    const baseDate = parseDateStrFromNEM12(dateStr);

    const intervalsPerDay = NUM_MINS_IN_DAY / this.currentIntervalLength;

    const consumptionFields = fields.slice(
      IntervalDataIndex.INTERVAL_VALUES,
      IntervalDataIndex.INTERVAL_VALUES + intervalsPerDay
    );

    consumptionFields.forEach((valueStr, index) => {
      if (valueStr.trim() && valueStr !== '0') {
        const consumption = new Decimal(valueStr);
        const timestamp = calculateIntervalTimestamp({
          baseDate,
          intervalLen: this.currentIntervalLength!,
          index,
        });

        readings.push({
          nmi: this.currentNMI!,
          timestamp,
          consumption,
        });
      }
    });

    return readings;
  }
}
