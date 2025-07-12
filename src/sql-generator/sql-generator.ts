import { METER_READINGS_TABLE_NAME } from '../constants/sql-generator.constants';
import { MeterReading } from '../types/meter-reading.types';
import { formatTimestampWithoutTimezone } from '../utils/datetime';

export class SQLGenerator {
  private tableName: string;

  constructor(tableName: string = METER_READINGS_TABLE_NAME) {
    this.tableName = tableName;
  }

  generateBatchInsert(readings: MeterReading[]): string {
    if (readings.length === 0) {
      return '';
    }

    const values = readings.map((reading) => {
      const timestamp = formatTimestampWithoutTimezone(reading.timestamp);
      const consumption = reading.consumption.toString();
      return `('${reading.nmi}', '${timestamp}', ${consumption})`;
    });

    return `INSERT INTO ${this.tableName} (nmi, timestamp, consumption)\nVALUES\n${values.join(',\n')}\nON CONFLICT (nmi, timestamp) DO NOTHING;`;
  }

  generateIndividualInserts(readings: MeterReading[]): string[] {
    // TODO: Implement individual INSERTs
    return [];
  }
}
