// nem12-parser.test.ts

import * as path from 'path';
import { NEM12Parser } from '../nem12.parser';

describe('NEM12Parser', () => {
  let parser: NEM12Parser;

  beforeEach(() => {
    parser = new NEM12Parser();
  });

  it('should parse file without throwing errors', async () => {
    const testFilePath = path.join(__dirname, 'file-valid.csv');
    const results = [];

    for await (const batch of parser.parseFile(testFilePath)) {
      results.push(batch);
    }

    expect(results).toMatchInlineSnapshot(`
      [
        {
          "meterReadings": null,
          "recordType": "100",
          "validationErrors": [],
        },
        {
          "meterReadings": [
            {
              "consumption": "1.25",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T16:30:00.000Z,
            },
            {
              "consumption": "1.3",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T17:00:00.000Z,
            },
            {
              "consumption": "1.28",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T17:30:00.000Z,
            },
            {
              "consumption": "1.35",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T18:00:00.000Z,
            },
            {
              "consumption": "1.4",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T18:30:00.000Z,
            },
            {
              "consumption": "1.45",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T19:00:00.000Z,
            },
            {
              "consumption": "1.5",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T19:30:00.000Z,
            },
            {
              "consumption": "1.55",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T20:00:00.000Z,
            },
            {
              "consumption": "1.6",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T20:30:00.000Z,
            },
            {
              "consumption": "1.65",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T21:00:00.000Z,
            },
            {
              "consumption": "1.7",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T21:30:00.000Z,
            },
            {
              "consumption": "1.75",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T22:00:00.000Z,
            },
            {
              "consumption": "1.8",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T22:30:00.000Z,
            },
            {
              "consumption": "1.85",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T23:00:00.000Z,
            },
            {
              "consumption": "1.9",
              "nmi": "1234567890",
              "timestamp": 2023-12-31T23:30:00.000Z,
            },
            {
              "consumption": "1.95",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T00:00:00.000Z,
            },
            {
              "consumption": "2",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T00:30:00.000Z,
            },
            {
              "consumption": "2.05",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T01:00:00.000Z,
            },
            {
              "consumption": "2.1",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T01:30:00.000Z,
            },
            {
              "consumption": "2.15",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T02:00:00.000Z,
            },
            {
              "consumption": "2.2",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T02:30:00.000Z,
            },
            {
              "consumption": "2.25",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T03:00:00.000Z,
            },
            {
              "consumption": "2.3",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T03:30:00.000Z,
            },
            {
              "consumption": "2.35",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T04:00:00.000Z,
            },
            {
              "consumption": "2.4",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T04:30:00.000Z,
            },
            {
              "consumption": "2.45",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T05:00:00.000Z,
            },
            {
              "consumption": "2.5",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T05:30:00.000Z,
            },
            {
              "consumption": "2.55",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T06:00:00.000Z,
            },
            {
              "consumption": "2.6",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T06:30:00.000Z,
            },
            {
              "consumption": "2.65",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T07:00:00.000Z,
            },
            {
              "consumption": "2.7",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T07:30:00.000Z,
            },
            {
              "consumption": "2.75",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T08:00:00.000Z,
            },
            {
              "consumption": "2.8",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T08:30:00.000Z,
            },
            {
              "consumption": "2.85",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T09:00:00.000Z,
            },
            {
              "consumption": "2.9",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T09:30:00.000Z,
            },
            {
              "consumption": "2.95",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T10:00:00.000Z,
            },
            {
              "consumption": "3",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T10:30:00.000Z,
            },
            {
              "consumption": "3.05",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T11:00:00.000Z,
            },
            {
              "consumption": "3.1",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T11:30:00.000Z,
            },
            {
              "consumption": "3.15",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T12:00:00.000Z,
            },
            {
              "consumption": "3.2",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T12:30:00.000Z,
            },
            {
              "consumption": "3.25",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T13:00:00.000Z,
            },
            {
              "consumption": "3.3",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T13:30:00.000Z,
            },
            {
              "consumption": "3.35",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T14:00:00.000Z,
            },
            {
              "consumption": "3.4",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T14:30:00.000Z,
            },
            {
              "consumption": "3.45",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T15:00:00.000Z,
            },
            {
              "consumption": "3.5",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T15:30:00.000Z,
            },
            {
              "consumption": "3.55",
              "nmi": "1234567890",
              "timestamp": 2024-01-01T16:00:00.000Z,
            },
          ],
          "recordType": "300",
          "validationErrors": [],
        },
        {
          "meterReadings": [
            {
              "consumption": "2.15",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T16:30:00.000Z,
            },
            {
              "consumption": "2.2",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T17:00:00.000Z,
            },
            {
              "consumption": "2.25",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T17:30:00.000Z,
            },
            {
              "consumption": "2.3",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T18:00:00.000Z,
            },
            {
              "consumption": "2.35",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T18:30:00.000Z,
            },
            {
              "consumption": "2.4",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T19:00:00.000Z,
            },
            {
              "consumption": "2.45",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T19:30:00.000Z,
            },
            {
              "consumption": "2.5",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T20:00:00.000Z,
            },
            {
              "consumption": "2.55",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T20:30:00.000Z,
            },
            {
              "consumption": "2.6",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T21:00:00.000Z,
            },
            {
              "consumption": "2.65",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T21:30:00.000Z,
            },
            {
              "consumption": "2.7",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T22:00:00.000Z,
            },
            {
              "consumption": "2.75",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T22:30:00.000Z,
            },
            {
              "consumption": "2.8",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T23:00:00.000Z,
            },
            {
              "consumption": "2.85",
              "nmi": "1234567891",
              "timestamp": 2023-12-31T23:30:00.000Z,
            },
            {
              "consumption": "2.9",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T00:00:00.000Z,
            },
            {
              "consumption": "2.95",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T00:30:00.000Z,
            },
            {
              "consumption": "3",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T01:00:00.000Z,
            },
            {
              "consumption": "3.05",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T01:30:00.000Z,
            },
            {
              "consumption": "3.1",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T02:00:00.000Z,
            },
            {
              "consumption": "3.15",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T02:30:00.000Z,
            },
            {
              "consumption": "3.2",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T03:00:00.000Z,
            },
            {
              "consumption": "3.25",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T03:30:00.000Z,
            },
            {
              "consumption": "3.3",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T04:00:00.000Z,
            },
            {
              "consumption": "3.35",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T04:30:00.000Z,
            },
            {
              "consumption": "3.4",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T05:00:00.000Z,
            },
            {
              "consumption": "3.45",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T05:30:00.000Z,
            },
            {
              "consumption": "3.5",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T06:00:00.000Z,
            },
            {
              "consumption": "3.55",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T06:30:00.000Z,
            },
            {
              "consumption": "3.6",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T07:00:00.000Z,
            },
            {
              "consumption": "3.65",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T07:30:00.000Z,
            },
            {
              "consumption": "3.7",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T08:00:00.000Z,
            },
            {
              "consumption": "3.75",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T08:30:00.000Z,
            },
            {
              "consumption": "3.8",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T09:00:00.000Z,
            },
            {
              "consumption": "3.85",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T09:30:00.000Z,
            },
            {
              "consumption": "3.9",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T10:00:00.000Z,
            },
            {
              "consumption": "3.95",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T10:30:00.000Z,
            },
            {
              "consumption": "4",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T11:00:00.000Z,
            },
            {
              "consumption": "4.05",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T11:30:00.000Z,
            },
            {
              "consumption": "4.1",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T12:00:00.000Z,
            },
            {
              "consumption": "4.15",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T12:30:00.000Z,
            },
            {
              "consumption": "4.2",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T13:00:00.000Z,
            },
            {
              "consumption": "4.25",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T13:30:00.000Z,
            },
            {
              "consumption": "4.3",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T14:00:00.000Z,
            },
            {
              "consumption": "4.35",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T14:30:00.000Z,
            },
            {
              "consumption": "4.4",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T15:00:00.000Z,
            },
            {
              "consumption": "4.45",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T15:30:00.000Z,
            },
            {
              "consumption": "4.5",
              "nmi": "1234567891",
              "timestamp": 2024-01-01T16:00:00.000Z,
            },
          ],
          "recordType": "300",
          "validationErrors": [],
        },
        {
          "meterReadings": null,
          "recordType": "900",
          "validationErrors": [],
        },
      ]
    `);
    expect(parser.getCurrentNMI()).toBe('1234567891');
    expect(parser.getCurrentIntervalLength()).toBe(30);
  });

  it('should handle empty files', async () => {
    const results = [];
    const testFilePath = path.join(__dirname, 'file-empty.csv');
    for await (const batch of parser.parseFile(testFilePath)) {
      results.push(batch);
    }

    expect(results).toHaveLength(0);
  });
});
