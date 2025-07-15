import * as fs from 'fs';

export interface ConversionContext {
  readonly inputPath: string;
  readonly outputPath: string;
  readonly tempPath: string;
  readonly errorPath: string;
  sqlStream: fs.WriteStream | null;
  errorStream: fs.WriteStream | null;
}

export interface ConversionStats {
  totalReadings: number;
  headerRowCount: number;
  footerRowCount: number;
  nmiSet: Set<string>;
  dateRange: { min: Date | null; max: Date | null };
}

export interface ConversionState {
  hasErrors: boolean;
  prematureEndOfFile: boolean;
}

export interface ConversionInput {
  inputPath: string;
  outputPath: string;
}
