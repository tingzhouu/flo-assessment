/**
 * NEM12 Record Types
 *
 * Based on Australian National Electricity Market (NEM) file format specification
 */

export interface HeaderRecord {
  // 100 record
  recordIndicator: RecordType.HEADER;
  versionHeader: string; // 'NEM12'
  dateTime: string;
  fromParticipant: string;
  toParticipant: string;
}

export interface NMIDetailsRecord {
  // 200 record
  recordIndicator: RecordType.NMI_DATA_DETAILS;
  nmi: string;
  nmiConfiguration: string;
  registerId: string;
  nmiSuffix: string;
  mdmDataStreamIdentifier: string;
  meterSerialNumber: string;
  uom: string;
  intervalLength: number;
  nextScheduledReadDate?: string;
}

export interface IntervalDataRecord {
  // 300 record
  recordIndicator: RecordType.INTERVAL_DATA;
  intervalDate: string; // '20050301'
  intervalValues: string[]; // ['0', '0', '0', ..., '0.461', '0.810']
  qualityMethod: string; // 'A'
  reasonCode?: string;
  reasonDescription?: string;
  updateDateTime?: string;
  msatsLoadDateTime?: string;
}

export interface IntervalEventRecord {
  // 400 record
  recordIndicator: RecordType.INTERVAL_EVENT;
  startInterval: number; // First interval this applies to (1-48)
  endInterval: number; // Last interval this applies to (1-48)
  qualityMethod: string; // e.g., 'A', 'S14', 'E52'
  reasonCode?: string; // e.g., '43', '79'
  reasonDescription?: string; // Human readable description
}

export interface B2BDetailsRecord {
  // 500 record
  recordIndicator: RecordType.B2B_DETAILS;
  transCode: string; // Transaction code (N, A, S, etc.)
  retServiceOrder?: string; // Retailer service order number
  readDateTime?: string; // When meter was actually read
  indexRead?: string; // Total accumulated reading from meter
}

export interface NEM12Footer {
  // 900 record
  recordIndicator: RecordType.END_OF_DATA;
}

/**
 * NEM12 record types
 */
export enum RecordType {
  /** Header record */
  HEADER = '100',

  /** NMI data details */
  NMI_DATA_DETAILS = '200',

  /** Interval data */
  INTERVAL_DATA = '300',

  /** Interval event */
  INTERVAL_EVENT = '400',

  /** B2B details */
  B2B_DETAILS = '500',

  /** End of data */
  END_OF_DATA = '900',
}
