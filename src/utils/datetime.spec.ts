import { formatTimestampWithoutTimezone } from './datetime';

describe('formatTimestampWithoutTimezone', () => {
  it('should format a date without timezone', () => {
    const date = new Date(2024, 0, 1, 0, 30, 0);
    const result = formatTimestampWithoutTimezone(date);
    expect(result).toBe('2024-01-01 00:30:00');
  });
});
