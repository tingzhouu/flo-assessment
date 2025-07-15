import { RecordType } from '../../constants/nem12-parser.constants';
import { NEM12Validator } from '../../validator/nem12-validator';
import { EndOfDataRecordParser } from './end-of-data-record-parser';
import { HeaderRecordParser } from './header-record-parser';
import { IntervalDataRecordParser } from './interval-data-record-parser';
import { NMIRecordParser } from './nmi-record-parser';
import { RecordParser } from './record-parser.interface';

export class CompositeParser {
  private recordParsers: Map<string, RecordParser> = new Map();
  private validator = new NEM12Validator();

  constructor() {
    this.recordParsers.set(
      RecordType.HEADER,
      new HeaderRecordParser(this.validator)
    );
    this.recordParsers.set(
      RecordType.NMI_DATA_DETAILS,
      new NMIRecordParser(this.validator)
    );
    this.recordParsers.set(
      RecordType.INTERVAL_DATA,
      new IntervalDataRecordParser(this.validator)
    );
    this.recordParsers.set(
      RecordType.END_OF_DATA,
      new EndOfDataRecordParser(this.validator)
    );
  }

  getParser(recordType: string): RecordParser | undefined {
    return this.recordParsers.get(recordType);
  }
}
