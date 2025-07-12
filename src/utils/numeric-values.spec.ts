import { isValidDecimal } from './numeric-values';

describe('isValidDecimal', () => {
  it('should return true for valid decimal', () => {
    expect(isValidDecimal('1.23')).toBe(true);
  });

  it('should return false for invalid decimal - more than one decimal point', () => {
    expect(isValidDecimal('1.23.45')).toBe(false);
  });

  it('should return false for invalid decimal - string', () => {
    expect(isValidDecimal('abcdef')).toBe(false);
  });
});
