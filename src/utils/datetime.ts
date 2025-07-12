import {
  DateIndex,
  NUM_MILLISECONDS_IN_MIN,
} from '../constants/nem12-parser.constants';

export function formatTimestampWithoutTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function parseDateStrFromNEM12(dateStr: string): Date {
  /*
    AEMO spec: 3.3.2. Date and time
    Date(8) format means a reverse notation date field (i.e. CCYYMMDD) with no separators between
    its components (century, years, months and days). The "8" indicates that the total field length is
    always 8 character -. e.g. "20030501" is the 1st May 2003.
    */
  if (dateStr.length !== 8) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const year = parseInt(
    dateStr.substring(DateIndex.YEAR_START, DateIndex.YEAR_END)
  );
  const month =
    parseInt(dateStr.substring(DateIndex.MONTH_START, DateIndex.MONTH_END)) - 1; // Month is 0-indexed in Node JS
  const day = parseInt(
    dateStr.substring(DateIndex.DAY_START, DateIndex.DAY_END)
  );

  return new Date(year, month, day);
}

export function calculateIntervalTimestamp(input: {
  baseDate: Date;
  intervalLen: number;
  index: number;
}): Date {
  /*
  AEMO spec: 3.3.3 Interval Metering Data
  Interval metering data is presented in time sequence order, with the first Interval for a day being
  the first Interval after midnight for the interval length that is programmed into the meter.
  */
  const { baseDate, intervalLen, index } = input;
  const minutesFromStart = (index + 1) * intervalLen;
  const timestamp = new Date(
    baseDate.getTime() + minutesFromStart * NUM_MILLISECONDS_IN_MIN
  );
  return timestamp;
}
