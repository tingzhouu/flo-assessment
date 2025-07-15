import * as fs from 'fs';
import * as path from 'path';
import { NEM12Converter } from '../nem12-converter';
import {
  ERROR_FILE_EXTENSION,
  SQL_FILE_EXTENSION,
} from '../../constants/nem12-converter.constants';
import { NEM12Parser } from '../../parser/nem12.parser';
import { CompositeParser } from '../../parser/record-parser/composite-parser';
import { NEM12SQLGenerator } from '../../sql-generator/nem12-sql-generator';

describe('NEM12Converter', () => {
  let parser: NEM12Converter;

  beforeEach(() => {
    parser = new NEM12Converter(
      new NEM12Parser(new CompositeParser()),
      new NEM12SQLGenerator()
    );
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  it('should parse file without throwing errors', async () => {
    const input = {
      inputPath: path.join(__dirname, 'file-valid.csv'),
      outputPath: path.join(__dirname, 'file-valid'),
    };

    await parser.convertFile(input);

    const output = fs.readFileSync(
      `${input.outputPath}${SQL_FILE_EXTENSION}`,
      'utf8'
    );
    expect(output).toMatchInlineSnapshot(`
      "-- Generated NEM12 meter readings
      -- Source: file-valid.csv
      -- Generated: 2020-01-01T00:00:00.000Z

      INSERT INTO meter_readings (nmi, timestamp, consumption)
      VALUES
      ('1234567890', '2024-01-01 00:30:00', 1.25),
      ('1234567890', '2024-01-01 01:00:00', 1.3),
      ('1234567890', '2024-01-01 01:30:00', 1.28),
      ('1234567890', '2024-01-01 02:00:00', 1.35),
      ('1234567890', '2024-01-01 02:30:00', 1.4),
      ('1234567890', '2024-01-01 03:00:00', 1.45),
      ('1234567890', '2024-01-01 03:30:00', 1.5),
      ('1234567890', '2024-01-01 04:00:00', 1.55),
      ('1234567890', '2024-01-01 04:30:00', 1.6),
      ('1234567890', '2024-01-01 05:00:00', 1.65),
      ('1234567890', '2024-01-01 05:30:00', 1.7),
      ('1234567890', '2024-01-01 06:00:00', 1.75),
      ('1234567890', '2024-01-01 06:30:00', 1.8),
      ('1234567890', '2024-01-01 07:00:00', 1.85),
      ('1234567890', '2024-01-01 07:30:00', 1.9),
      ('1234567890', '2024-01-01 08:00:00', 1.95),
      ('1234567890', '2024-01-01 08:30:00', 2),
      ('1234567890', '2024-01-01 09:00:00', 2.05),
      ('1234567890', '2024-01-01 09:30:00', 2.1),
      ('1234567890', '2024-01-01 10:00:00', 2.15),
      ('1234567890', '2024-01-01 10:30:00', 2.2),
      ('1234567890', '2024-01-01 11:00:00', 2.25),
      ('1234567890', '2024-01-01 11:30:00', 2.3),
      ('1234567890', '2024-01-01 12:00:00', 2.35),
      ('1234567890', '2024-01-01 12:30:00', 2.4),
      ('1234567890', '2024-01-01 13:00:00', 2.45),
      ('1234567890', '2024-01-01 13:30:00', 2.5),
      ('1234567890', '2024-01-01 14:00:00', 2.55),
      ('1234567890', '2024-01-01 14:30:00', 2.6),
      ('1234567890', '2024-01-01 15:00:00', 2.65),
      ('1234567890', '2024-01-01 15:30:00', 2.7),
      ('1234567890', '2024-01-01 16:00:00', 2.75),
      ('1234567890', '2024-01-01 16:30:00', 2.8),
      ('1234567890', '2024-01-01 17:00:00', 2.85),
      ('1234567890', '2024-01-01 17:30:00', 2.9),
      ('1234567890', '2024-01-01 18:00:00', 2.95),
      ('1234567890', '2024-01-01 18:30:00', 3),
      ('1234567890', '2024-01-01 19:00:00', 3.05),
      ('1234567890', '2024-01-01 19:30:00', 3.1),
      ('1234567890', '2024-01-01 20:00:00', 3.15),
      ('1234567890', '2024-01-01 20:30:00', 3.2),
      ('1234567890', '2024-01-01 21:00:00', 3.25),
      ('1234567890', '2024-01-01 21:30:00', 3.3),
      ('1234567890', '2024-01-01 22:00:00', 3.35),
      ('1234567890', '2024-01-01 22:30:00', 3.4),
      ('1234567890', '2024-01-01 23:00:00', 3.45),
      ('1234567890', '2024-01-01 23:30:00', 3.5),
      ('1234567890', '2024-01-02 00:00:00', 3.55)
      ON CONFLICT (nmi, timestamp) DO NOTHING;

      INSERT INTO meter_readings (nmi, timestamp, consumption)
      VALUES
      ('1234567891', '2024-01-01 00:30:00', 2.15),
      ('1234567891', '2024-01-01 01:00:00', 2.2),
      ('1234567891', '2024-01-01 01:30:00', 2.25),
      ('1234567891', '2024-01-01 02:00:00', 2.3),
      ('1234567891', '2024-01-01 02:30:00', 2.35),
      ('1234567891', '2024-01-01 03:00:00', 2.4),
      ('1234567891', '2024-01-01 03:30:00', 2.45),
      ('1234567891', '2024-01-01 04:00:00', 2.5),
      ('1234567891', '2024-01-01 04:30:00', 2.55),
      ('1234567891', '2024-01-01 05:00:00', 2.6),
      ('1234567891', '2024-01-01 05:30:00', 2.65),
      ('1234567891', '2024-01-01 06:00:00', 2.7),
      ('1234567891', '2024-01-01 06:30:00', 2.75),
      ('1234567891', '2024-01-01 07:00:00', 2.8),
      ('1234567891', '2024-01-01 07:30:00', 2.85),
      ('1234567891', '2024-01-01 08:00:00', 2.9),
      ('1234567891', '2024-01-01 08:30:00', 2.95),
      ('1234567891', '2024-01-01 09:00:00', 3),
      ('1234567891', '2024-01-01 09:30:00', 3.05),
      ('1234567891', '2024-01-01 10:00:00', 3.1),
      ('1234567891', '2024-01-01 10:30:00', 3.15),
      ('1234567891', '2024-01-01 11:00:00', 3.2),
      ('1234567891', '2024-01-01 11:30:00', 3.25),
      ('1234567891', '2024-01-01 12:00:00', 3.3),
      ('1234567891', '2024-01-01 12:30:00', 3.35),
      ('1234567891', '2024-01-01 13:00:00', 3.4),
      ('1234567891', '2024-01-01 13:30:00', 3.45),
      ('1234567891', '2024-01-01 14:00:00', 3.5),
      ('1234567891', '2024-01-01 14:30:00', 3.55),
      ('1234567891', '2024-01-01 15:00:00', 3.6),
      ('1234567891', '2024-01-01 15:30:00', 3.65),
      ('1234567891', '2024-01-01 16:00:00', 3.7),
      ('1234567891', '2024-01-01 16:30:00', 3.75),
      ('1234567891', '2024-01-01 17:00:00', 3.8),
      ('1234567891', '2024-01-01 17:30:00', 3.85),
      ('1234567891', '2024-01-01 18:00:00', 3.9),
      ('1234567891', '2024-01-01 18:30:00', 3.95),
      ('1234567891', '2024-01-01 19:00:00', 4),
      ('1234567891', '2024-01-01 19:30:00', 4.05),
      ('1234567891', '2024-01-01 20:00:00', 4.1),
      ('1234567891', '2024-01-01 20:30:00', 4.15),
      ('1234567891', '2024-01-01 21:00:00', 4.2),
      ('1234567891', '2024-01-01 21:30:00', 4.25),
      ('1234567891', '2024-01-01 22:00:00', 4.3),
      ('1234567891', '2024-01-01 22:30:00', 4.35),
      ('1234567891', '2024-01-01 23:00:00', 4.4),
      ('1234567891', '2024-01-01 23:30:00', 4.45),
      ('1234567891', '2024-01-02 00:00:00', 4.5)
      ON CONFLICT (nmi, timestamp) DO NOTHING;

      -- Total readings: 96
      -- NMI count: 2
      -- Date range: 2024-01-01 00:30:00 to 2024-01-02 00:00:00
      "
    `);

    fs.unlinkSync(`${input.outputPath}${SQL_FILE_EXTENSION}`);
  });

  it('should handle invalid filetype by terminating processing', async () => {
    const input = {
      inputPath: path.join(__dirname, 'file-invalid-filetype.csv'),
      outputPath: path.join(__dirname, 'file-invalid-filetype'),
    };

    await parser.convertFile(input);

    const output = fs.readFileSync(
      `${input.outputPath}${SQL_FILE_EXTENSION}`,
      'utf8'
    );
    const error = fs.readFileSync(
      `${input.outputPath}${ERROR_FILE_EXTENSION}`,
      'utf8'
    );
    expect(output).toMatchInlineSnapshot(`
      "-- Generated NEM12 meter readings
      -- Source: file-invalid-filetype.csv
      -- Generated: 2020-01-01T00:00:00.000Z

      -- Total readings: 0
      -- NMI count: 0
      "
    `);
    expect(error).toMatchInlineSnapshot(`
      "1: (INVALID_VERSION) Expected NEM12 format, got: NEM88
      "
    `);

    fs.unlinkSync(`${input.outputPath}${SQL_FILE_EXTENSION}`);
    fs.unlinkSync(`${input.outputPath}${ERROR_FILE_EXTENSION}`);
  });

  it('should handle invalid meter record by skipping row processing', async () => {
    const input = {
      inputPath: path.join(__dirname, 'file-invalid-meter-record.csv'),
      outputPath: path.join(__dirname, 'file-invalid-meter-record'),
    };

    await parser.convertFile(input);

    const output = fs.readFileSync(
      `${input.outputPath}${SQL_FILE_EXTENSION}`,
      'utf8'
    );
    const error = fs.readFileSync(
      `${input.outputPath}${ERROR_FILE_EXTENSION}`,
      'utf8'
    );
    expect(output).toMatchInlineSnapshot(`
      "-- Generated NEM12 meter readings
      -- Source: file-invalid-meter-record.csv
      -- Generated: 2020-01-01T00:00:00.000Z

      -- Total readings: 0
      -- NMI count: 0
      "
    `);
    expect(error).toMatchInlineSnapshot(`
      "3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 1: 'aaa' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 2: 'bbb' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 3: 'ccc' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 4: 'ddd' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 5: 'eee' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 6: 'fff' is not a valid decimal
      3: (INVALID_CONSUMPTION_FORMAT) Invalid consumption value at interval 7: 'ggg' is not a valid decimal
      "
    `);

    fs.unlinkSync(`${input.outputPath}${SQL_FILE_EXTENSION}`);
    fs.unlinkSync(`${input.outputPath}${ERROR_FILE_EXTENSION}`);
  });
});
