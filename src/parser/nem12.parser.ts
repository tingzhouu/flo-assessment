import * as fs from 'fs';
import * as readline from 'readline';
import { RecordType } from '../types/nem12.types';

export class NEM12Parser {
  private currentNMI: string | null = null;
  private currentIntervalLength: number | null = null;

  getCurrentNMI(): string | null {
    return this.currentNMI;
  }

  getCurrentIntervalLength(): number | null {
    return this.currentIntervalLength;
  }

  async *parseFile(filePath: string): AsyncGenerator<any[]> {
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
      const recordType = fields[0];

      try {
        switch (recordType) {
          case RecordType.HEADER:
            console.log('Found header:', fields[1]);
            break;

          case RecordType.NMI_DATA_DETAILS:
            this.currentNMI = fields[1];
            this.currentIntervalLength = parseInt(fields[8]);
            console.log(
              `NMI: ${this.currentNMI}, Interval: ${this.currentIntervalLength}min`
            );
            break;

          case RecordType.INTERVAL_DATA:
            const readings = this.parseIntervalData(fields);
            if (readings.length > 0) {
              yield readings;
            }
            break;

          case RecordType.END_OF_DATA:
            console.log('End of file reached');
            return;

          default:
            // Ignore 400, 500 for now
            break;
        }
      } catch (error) {
        console.warn(`Line ${lineNumber}: ${error.message}`);
      }
    }
  }

  private parseIntervalData(fields: string[]): any[] {
    return [];
  }
}
