import { METER_READINGS_TABLE_NAME } from '../constants/sql-generator.constants';
import { MeterReading } from '../types/meter-reading.types';

export class SQLGenerator {
  private tableName: string;

  constructor(tableName: string = METER_READINGS_TABLE_NAME) {
    this.tableName = tableName;
  }

  private formatTimestamp(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  generateBatchInsert(readings: MeterReading[]): string {
    if (readings.length === 0) {
      return '';
    }

    const values = readings.map((reading) => {
      const timestamp = this.formatTimestamp(reading.timestamp);
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
