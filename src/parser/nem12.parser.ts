import * as fs from 'fs';
import * as readline from 'readline';
import { RECORD_TYPE_INDEX } from '../constants/nem12-parser.constants';
import { ParseContext, ParseResults } from '../types/parser.types';
import { CompositeParser } from './record-parser/composite-parser';

export class NEM12Parser {
  constructor(private compositeParser: CompositeParser) {}

  async *parseFile(filePath: string): AsyncGenerator<ParseResults> {
    const context: ParseContext = {
      currentNMI: null,
      currentIntervalLength: null,
    };

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
        const parser = this.compositeParser.getParser(recordType);
        if (!parser) {
          console.warn(
            `Line ${lineNumber}: Unknown record type: ${recordType}`
          );
          continue;
        }
        const results = parser.parse({ fields, lineNumber, context });
        yield results;
      } catch (error) {
        console.warn(`Line ${lineNumber}: ${error.message}`);
      }
    }
  }
}
