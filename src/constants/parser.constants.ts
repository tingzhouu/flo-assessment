export const NUM_MINS_IN_DAY = 60 * 24;
export const NUM_MILLISECONDS_IN_MIN = 60 * 1000;

export const RECORD_TYPE_INDEX = 0;

export enum NMIDataDetailsIndex {
  NMI = 1,
  INTERVAL_LENGTH = 8,
}

export enum IntervalDataIndex {
  INTERVAL_DATE = 1,
  INTERVAL_VALUES = 2,
}

export enum DateIndex {
  YEAR_START = 0,
  YEAR_END = 4,
  MONTH_START = 4,
  MONTH_END = 6,
  DAY_START = 6,
  DAY_END = 8,
}
