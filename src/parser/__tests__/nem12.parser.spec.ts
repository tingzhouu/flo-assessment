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

    expect(results).toBeDefined();
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
