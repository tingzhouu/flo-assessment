import { ParseInput, ParseResults } from '../../types/parser.types';

export interface RecordParser {
  parse(input: ParseInput): ParseResults;
}
