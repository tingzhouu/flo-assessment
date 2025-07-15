import Decimal from 'decimal.js';
import * as fs from 'fs';
import * as readline from 'readline';
import {
  IntervalDataIndex,
  NMIDataDetailsIndex,
  NUM_MINS_IN_DAY,
  RECORD_TYPE_INDEX,
  RecordType,
} from '../constants/nem12-parser.constants';
import { MeterReading } from '../types/meter-reading.types';
import { ParseContext, ParseResults } from '../types/parser.types';
import {
  calculateIntervalTimestamp,
  parseDateStrFromNEM12,
} from '../utils/datetime';
import { NEM12Validator } from '../validator/nem12-validator';

export class NEM12Parser {
  private validator = new NEM12Validator();

  async *parseFile(filePath: string): AsyncGenerator<ParseResults> {
    const context: ParseContext = {
      currentNMI: null,
      currentIntervalLength: null,
    };

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
          case RecordType.HEADER: {
            const validationErrors = this.validator.validateHeaderRecord({
              fields,
              lineNumber,
            });
            yield {
              recordType,
              validationErrors,
              meterReadings: null,
            };
            break;
          }

          case RecordType.NMI_DATA_DETAILS:
            const validationErrors = this.validator.validateNMIRecord({
              fields,
              lineNumber,
            });
            if (validationErrors.length > 0) {
              yield {
                recordType,
                validationErrors,
                meterReadings: null,
              };
            } else {
              context.currentNMI = fields[NMIDataDetailsIndex.NMI];
              context.currentIntervalLength = parseInt(
                fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
              );
            }
            break;

          case RecordType.INTERVAL_DATA:
            {
              const validationErrors = this.validator.validateIntervalRecord({
                fields,
                lineNumber,
                intervalLength: context.currentIntervalLength,
              });
              if (validationErrors.length > 0) {
                yield {
                  recordType,
                  validationErrors,
                  meterReadings: null,
                };
              } else {
                const readings = this.parseIntervalData({ fields, context });
                yield {
                  recordType,
                  validationErrors,
                  meterReadings: readings,
                };
              }
            }
            break;

          case RecordType.END_OF_DATA: {
            yield {
              recordType,
              validationErrors: [],
              meterReadings: null,
            };
            break;
          }

          default:
            // Ignore 400, 500 which are not required for SQL generation
            break;
        }
      } catch (error) {
        console.warn(`Line ${lineNumber}: ${error.message}`);
      }
    }
  }

  private parseIntervalData(input: {
    fields: string[];
    context: ParseContext;
  }): MeterReading[] {
    const { fields, context } = input;

    if (!context.currentNMI || !context.currentIntervalLength) {
      throw new Error('No NMI context available for interval data');
    }

    const readings: MeterReading[] = [];
    const dateStr = fields[IntervalDataIndex.INTERVAL_DATE]; // '20050301'
    const baseDate = parseDateStrFromNEM12(dateStr);

    const intervalsPerDay = NUM_MINS_IN_DAY / context.currentIntervalLength;

    const consumptionFields = fields.slice(
      IntervalDataIndex.INTERVAL_VALUES,
      IntervalDataIndex.INTERVAL_VALUES + intervalsPerDay
    );

    consumptionFields.forEach((valueStr, index) => {
      if (valueStr.trim() && valueStr !== '0') {
        const consumption = new Decimal(valueStr);
        const timestamp = calculateIntervalTimestamp({
          baseDate,
          intervalLen: context.currentIntervalLength!,
          index,
        });

        readings.push({
          nmi: context.currentNMI!,
          timestamp,
          consumption,
        });
      }
    });

    return readings;
  }
}
