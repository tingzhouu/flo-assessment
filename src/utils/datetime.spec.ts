import {
  calculateIntervalTimestamp,
  formatTimestampWithoutTimezone,
  isValidNEM12Date,
  parseDateStrFromNEM12,
} from './datetime';

describe('formatTimestampWithoutTimezone', () => {
  it('should format a date without timezone', () => {
    const date = new Date(2024, 0, 1, 0, 30, 0);
    const result = formatTimestampWithoutTimezone(date);
    expect(result).toBe('2024-01-01 00:30:00');
  });
});

describe('isValidNEM12Date', () => {
  it('should return true for valid date', () => {
    expect(isValidNEM12Date('20240101')).toBe(true);
  });

  it('should return false for invalid date - too short', () => {
    expect(isValidNEM12Date('2024010')).toBe(false);
  });

  it('should return false for invalid date - too long', () => {
    expect(isValidNEM12Date('202401010')).toBe(false);
  });

  it('should return false for invalid date - non-numeric', () => {
    expect(isValidNEM12Date('20240101a')).toBe(false);
  });
});

describe('calculateIntervalTimestamp', () => {
  it('should calculate the correct timestamp for the first interval', () => {
    const baseDate = new Date(2024, 0, 1, 0, 0, 0);
    const intervalLen = 30;
    const index = 0;
    const result = calculateIntervalTimestamp({ baseDate, intervalLen, index });
    expect(result).toEqual(new Date(2024, 0, 1, 0, 30, 0));
  });

  it('should calculate the correct timestamp for the second interval', () => {
    const baseDate = new Date(2024, 0, 1, 0, 0, 0);
    const intervalLen = 30;
    const index = 1;
    const result = calculateIntervalTimestamp({ baseDate, intervalLen, index });
    expect(result).toEqual(new Date(2024, 0, 1, 1, 0, 0));
  });
});

describe('parseDateStrFromNEM12', () => {
  it('should parse a valid date', () => {
    const dateStr = '20240101';
    const result = parseDateStrFromNEM12(dateStr);
    expect(result).toEqual(new Date(2024, 0, 1));
  });

  it('should throw an error for an invalid date', () => {
    const dateStr = '202401010';
    expect(() => parseDateStrFromNEM12(dateStr)).toThrow('Invalid date format');
  });
});
