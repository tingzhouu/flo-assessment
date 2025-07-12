import Decimal from 'decimal.js';
import { NEM12SQLGenerator } from './nem12-sql-generator';
import { MeterReading } from '../types/meter-reading.types';

describe('NEM12SQLGenerator', () => {
  it('should generate a batch insert statement', () => {
    const generator = new NEM12SQLGenerator();
    const readings = [
      {
        nmi: 'NEM1201009',
        timestamp: new Date(2005, 2, 1, 6, 30, 0),
        consumption: new Decimal('0.461'),
      },
    ];

    const result = generator.generateBatchInsert(readings);
    expect(result).toMatchInlineSnapshot(`
      "INSERT INTO meter_readings (nmi, timestamp, consumption)
      VALUES
      ('NEM1201009', '2005-03-01 06:30:00', 0.461)
      ON CONFLICT (nmi, timestamp) DO NOTHING;"
    `);
  });

  it('should generate a batch insert statement for multiple readings', () => {
    const generator = new NEM12SQLGenerator();
    const readings = [
      {
        nmi: 'NEM1201009',
        timestamp: new Date(2005, 2, 1, 6, 30, 0),
        consumption: new Decimal('0.461'),
      },
      {
        nmi: 'NEM1201009',
        timestamp: new Date(2005, 2, 1, 7, 0, 0),
        consumption: new Decimal('0.462'),
      },
      {
        nmi: 'NEM1201009',
        timestamp: new Date(2005, 2, 1, 7, 30, 0),
        consumption: new Decimal('0.463'),
      },
    ];

    const result = generator.generateBatchInsert(readings);
    expect(result).toMatchInlineSnapshot(`
      "INSERT INTO meter_readings (nmi, timestamp, consumption)
      VALUES
      ('NEM1201009', '2005-03-01 06:30:00', 0.461),
      ('NEM1201009', '2005-03-01 07:00:00', 0.462),
      ('NEM1201009', '2005-03-01 07:30:00', 0.463)
      ON CONFLICT (nmi, timestamp) DO NOTHING;"
    `);
  });

  it('should generate a batch insert statement for multiple readings', () => {
    const generator = new NEM12SQLGenerator();
    const readings: MeterReading[] = [];

    const result = generator.generateBatchInsert(readings);
    expect(result).toBe('');
  });
});
