import { Decimal } from 'decimal.js';

export interface MeterReading {
  nmi: string;
  timestamp: Date;
  consumption: Decimal;
}
