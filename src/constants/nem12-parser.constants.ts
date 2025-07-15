export const NUM_MINS_IN_DAY = 60 * 24;
export const NUM_MILLISECONDS_IN_MIN = 60 * 1000;

export const RECORD_TYPE_INDEX = 0;

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

export enum HeaderRecordIndex {
  VERSION = 1,
}

export enum NMIDataDetailsIndex {
  NMI = 1,
  INTERVAL_LENGTH = 8,
}

export enum IntervalDataIndex {
  INTERVAL_DATE = 1,
  INTERVAL_VALUES = 2,
}

/* 
Record Indicator, 
Interval Date, 
QualityMethod, 
ReasonCode, 
ReasonDescription, 
UpdateDateTime, 
MSATSLoadDateTime
*/
export const INTERVAL_DATA_NON_INTERVAL_VALUE_LENGTH = 7;

export const INTERVAL_LENGTHS = [5, 15, 30];

export enum DateIndex {
  YEAR_START = 0,
  YEAR_END = 4,
  MONTH_START = 4,
  MONTH_END = 6,
  DAY_START = 6,
  DAY_END = 8,
}

export const HEADER_RECORD_FIELD_LENGTH = 5;
export const NMI_RECORD_FIELD_LENGTH = 10;

export const VERSION_HEADER = 'NEM12';
