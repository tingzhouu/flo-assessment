import { ConversionStats } from './conversion-context';
import { MeterReading } from '../types/meter-reading.types';
import { RecordType } from '../constants/nem12-parser.constants';

export class StatisticsCollector {
  private stats: ConversionStats;

  constructor() {
    this.stats = {
      totalReadings: 0,
      headerRowCount: 0,
      footerRowCount: 0,
      nmiSet: new Set<string>(),
      dateRange: { min: null, max: null },
    };
  }

  updateRecordCounts(recordType: RecordType): void {
    if (recordType === RecordType.HEADER) {
      this.stats.headerRowCount++;
    } else if (recordType === RecordType.END_OF_DATA) {
      this.stats.footerRowCount++;
    }
  }

  addMeterReadings(meterReadings: MeterReading[]): void {
    meterReadings.forEach((reading) => {
      this.stats.nmiSet.add(reading.nmi);
      this.updateDateRange(reading.timestamp);
    });

    this.stats.totalReadings += meterReadings.length;
  }

  private updateDateRange(timestamp: Date): void {
    if (!this.stats.dateRange.min || timestamp < this.stats.dateRange.min) {
      this.stats.dateRange.min = timestamp;
    }
    if (!this.stats.dateRange.max || timestamp > this.stats.dateRange.max) {
      this.stats.dateRange.max = timestamp;
    }
  }

  getStats(): ConversionStats {
    return { ...this.stats };
  }

  getTotalReadings(): number {
    return this.stats.totalReadings;
  }

  getHeaderRowCount(): number {
    return this.stats.headerRowCount;
  }

  getFooterRowCount(): number {
    return this.stats.footerRowCount;
  }
}
