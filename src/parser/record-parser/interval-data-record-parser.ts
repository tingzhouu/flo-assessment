import Decimal from 'decimal.js';
import {
  IntervalDataIndex,
  NUM_MINS_IN_DAY,
  RecordType,
} from '../../constants/nem12-parser.constants';
import { MeterReading } from '../../types/meter-reading.types';
import {
  ParseContext,
  ParseInput,
  ParseResults,
} from '../../types/parser.types';
import {
  calculateIntervalTimestamp,
  parseDateStrFromNEM12,
} from '../../utils/datetime';
import { NEM12Validator } from '../../validator/nem12-validator';
import { RecordParser } from './record-parser.interface';

export class IntervalDataRecordParser implements RecordParser {
  constructor(private validator: NEM12Validator) {}

  parse(input: ParseInput): ParseResults {
    const { fields, lineNumber, context } = input;

    const validationErrors = this.validator.validateIntervalRecord({
      fields,
      lineNumber,
      intervalLength: context.currentIntervalLength,
    });

    if (validationErrors.length > 0) {
      return {
        recordType: RecordType.INTERVAL_DATA,
        validationErrors,
        meterReadings: null,
      };
    }

    const readings = this.parseIntervalData({ fields, context });
    return {
      recordType: RecordType.INTERVAL_DATA,
      validationErrors,
      meterReadings: readings,
    };
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
