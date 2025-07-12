import * as fs from 'fs';
import * as readline from 'readline';
import { RecordType } from '../types/nem12.types';
import { MeterReading } from '../types/meter-reading.types';
import Decimal from 'decimal.js';
import {
  DateIndex,
  IntervalDataIndex,
  NMIDataDetailsIndex,
  NUM_MILLISECONDS_IN_MIN,
  NUM_MINS_IN_DAY,
  RECORD_TYPE_INDEX,
} from '../constants/parser.constants';

export class NEM12Parser {
  private currentNMI: string | null = null;
  private currentIntervalLength: number | null = null;

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
            console.log('Found header:', fields[1]);
            break;

          case RecordType.NMI_DATA_DETAILS:
            this.currentNMI = fields[NMIDataDetailsIndex.NMI];
            this.currentIntervalLength = parseInt(
              fields[NMIDataDetailsIndex.INTERVAL_LENGTH]
            );
            console.log(
              `NMI: ${this.currentNMI}, Interval: ${this.currentIntervalLength}min`
            );
            break;

          case RecordType.INTERVAL_DATA:
            const readings = this.parseIntervalData(fields);
            if (readings.length > 0) {
              yield readings;
            }
            break;

          case RecordType.END_OF_DATA:
            console.log('End of file reached');
            return;

          default:
            // Ignore 400, 500 for now
            break;
        }
      } catch (error) {
        console.warn(`Line ${lineNumber}: ${error.message}`);
      }
    }
  }

  private parseDate(dateStr: string): Date {
    /*
    AEMO spec: 3.3.2. Date and time
    Date(8) format means a reverse notation date field (i.e. CCYYMMDD) with no separators between
    its components (century, years, months and days). The "8" indicates that the total field length is
    always 8 character -. e.g. "20030501" is the 1st May 2003.
    */
    if (dateStr.length !== 8) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    const year = parseInt(
      dateStr.substring(DateIndex.YEAR_START, DateIndex.YEAR_END)
    );
    const month =
      parseInt(dateStr.substring(DateIndex.MONTH_START, DateIndex.MONTH_END)) -
      1; // Month is 0-indexed in Node JS
    const day = parseInt(
      dateStr.substring(DateIndex.DAY_START, DateIndex.DAY_END)
    );

    return new Date(year, month, day);
  }

  private parseIntervalData(fields: string[]): MeterReading[] {
    if (!this.currentNMI || !this.currentIntervalLength) {
      throw new Error('No NMI context available for interval data');
    }

    const readings: MeterReading[] = [];
    const dateStr = fields[IntervalDataIndex.INTERVAL_DATE]; // '20050301'
    const baseDate = this.parseDate(dateStr); // Convert to Date object

    const intervalsPerDay = NUM_MINS_IN_DAY / this.currentIntervalLength;

    const consumptionFields = fields.slice(
      IntervalDataIndex.INTERVAL_VALUES,
      IntervalDataIndex.INTERVAL_VALUES + intervalsPerDay
    );

    consumptionFields.forEach((valueStr, index) => {
      if (valueStr.trim() && valueStr !== '0') {
        const consumption = new Decimal(valueStr);

        /*
        AEMO spec: 3.3.3 Interval Metering Data
        Interval metering data is presented in time sequence order, with the first Interval for a day being
        the first Interval after midnight for the interval length that is programmed into the meter.
        */
        const minutesFromStart = (index + 1) * this.currentIntervalLength!;
        const timestamp = new Date(
          baseDate.getTime() + minutesFromStart * NUM_MILLISECONDS_IN_MIN
        );

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
