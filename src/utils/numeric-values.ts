export function isValidDecimal(valueStr: string): boolean {
  // Allow integers and decimals, but not scientific notation or invalid formats
  const decimalRegex = /^-?\d+(\.\d+)?$/;

  if (!decimalRegex.test(valueStr)) {
    return false;
  }

  // Additional check using parseFloat
  const parsed = parseFloat(valueStr);
  return !isNaN(parsed) && isFinite(parsed);
}
