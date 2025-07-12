import { NEM12Validator } from './nem12-validator';

describe('validateHeaderRecord', () => {
  it('should validate a valid header record', () => {
    const validator = new NEM12Validator();
    const result = validator.validateHeaderRecord({
      fields: ['100', 'NEM12', '202401010000', 'AEMO', 'RETAILER'],
      lineNumber: 1,
    });
    expect(result).toEqual([]);
  });

  it('should validate a invalid header record - version not NEM12', () => {
    const validator = new NEM12Validator();
    const result = validator.validateHeaderRecord({
      fields: ['100', 'NEM99', '202401010000', 'AEMO', 'RETAILER'],
      lineNumber: 1,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "INVALID_VERSION",
          "line": 1,
          "message": "Expected NEM12 format, got: NEM99",
          "severity": "fatal",
        },
      ]
    `);
  });

  it('should validate a invalid header record - missing fields', () => {
    const validator = new NEM12Validator();
    const result = validator.validateHeaderRecord({
      fields: ['100', 'NEM12', '202401010000', 'AEMO'],
      lineNumber: 1,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "MISSING_HEADER_FIELDS",
          "line": 1,
          "message": "Header record missing required fields",
          "severity": "error",
        },
      ]
    `);
  });
});

describe('validateNMIRecord', () => {
  it('should validate a valid nmi record', () => {
    const validator = new NEM12Validator();
    const result = validator.validateNMIRecord({
      fields: [
        '200',
        '1234567890',
        'E1',
        '1',
        'E1',
        'N1',
        'METER001',
        'kWh',
        '30',
        '20240201',
      ],
      lineNumber: 1,
    });
    expect(result).toEqual([]);
  });

  it('should validate a invalid nmi record - invalid interval length', () => {
    const validator = new NEM12Validator();
    const result = validator.validateNMIRecord({
      fields: [
        '200',
        '1234567890',
        'E1',
        '1',
        'E1',
        'N1',
        'METER001',
        'kWh',
        '90', // invalid interval length
        '20240201',
      ],
      lineNumber: 1,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "INVALID_INTERVAL_LENGTH",
          "line": 1,
          "message": "Invalid interval length: 90",
          "severity": "error",
        },
      ]
    `);
  });
});

describe('validateIntervalRecord', () => {
  it('should validate a valid interval record', () => {
    const validator = new NEM12Validator();
    const result = validator.validateIntervalRecord({
      fields: [
        '300',
        '20240101',
        '1.25',
        '1.30',
        '1.28',
        '1.35',
        '1.40',
        '1.45',
        '1.50',
        '1.55',
        '1.60',
        '1.65',
        '1.70',
        '1.75',
        '1.80',
        '1.85',
        '1.90',
        '1.95',
        '2.00',
        '2.05',
        '2.10',
        '2.15',
        '2.20',
        '2.25',
        '2.30',
        '2.35',
        '2.40',
        '2.45',
        '2.50',
        '2.55',
        '2.60',
        '2.65',
        '2.70',
        '2.75',
        '2.80',
        '2.85',
        '2.90',
        '2.95',
        '3.00',
        '3.05',
        '3.10',
        '3.15',
        '3.20',
        '3.25',
        '3.30',
        '3.35',
        '3.40',
        '3.45',
        '3.50',
        '3.55',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        '20240201010000',
        '20240201010000',
      ],
      lineNumber: 1,
      intervalLength: 30,
    });
    expect(result).toEqual([]);
  });

  it('should validate a possible invalid interval record - suspicious consumption value', () => {
    const validator = new NEM12Validator();
    const result = validator.validateIntervalRecord({
      fields: [
        '300',
        '20240101',
        '1.25',
        '1.30',
        '1.28',
        '1.35',
        '1.40',
        '1.45',
        '1.50',
        '1.55',
        '1.60',
        '1.65',
        '1.70',
        '1.75',
        '1.80',
        '1.85',
        '1.90',
        '1.95',
        '2.00',
        '2.05',
        '2.10',
        '2.15',
        '2.20',
        '2.25',
        '2.30',
        '2.35',
        '99999999.40', // suspicious consumption value
        '2.45',
        '2.50',
        '2.55',
        '2.60',
        '2.65',
        '2.70',
        '2.75',
        '2.80',
        '2.85',
        '2.90',
        '2.95',
        '3.00',
        '3.05',
        '3.10',
        '3.15',
        '3.20',
        '3.25',
        '3.30',
        '3.35',
        '3.40',
        '3.45',
        '3.50',
        '3.55',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        '20240201010000',
        '20240201010000',
      ],
      lineNumber: 1,
      intervalLength: 30,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "SUSPICIOUS_CONSUMPTION_HIGH",
          "line": 1,
          "message": "Suspicious consumption value at interval 25: '99999999.40' seems unusually high",
          "severity": "warning",
        },
      ]
    `);
  });

  it('should validate an invalid interval record - invalid consumption value', () => {
    const validator = new NEM12Validator();
    const result = validator.validateIntervalRecord({
      fields: [
        '300',
        '20240101',
        '1.25',
        '1.30',
        '1.28',
        'abcdef', // invalid consumption value
        '1.40',
        '1.45',
        '1.50',
        '1.55',
        '1.60',
        '1.65',
        '1.70',
        '1.75',
        '1.80',
        '1.85',
        '1.90',
        '1.95',
        '2.00',
        '2.05',
        '2.10',
        '2.15',
        '2.20',
        '2.25',
        '2.30',
        '2.35',
        '2.40',
        '2.45',
        '2.50',
        '2.55',
        '2.60',
        '2.65',
        '2.70',
        '2.75',
        '2.80',
        '2.85',
        '2.90',
        '2.95',
        '3.00',
        '3.05',
        '3.10',
        '3.15',
        '3.20',
        '3.25',
        '3.30',
        '3.35',
        '3.40',
        '3.45',
        '3.50',
        '3.55',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        'A',
        '20240201010000',
        '20240201010000',
      ],
      lineNumber: 1,
      intervalLength: 30,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "INVALID_CONSUMPTION_FORMAT",
          "line": 1,
          "message": "Invalid consumption value at interval 4: 'abcdef' is not a valid decimal",
          "severity": "error",
        },
      ]
    `);
  });

  it('should validate an invalid interval record - missing fields', () => {
    const validator = new NEM12Validator();
    const result = validator.validateIntervalRecord({
      fields: ['300', '20240101', '1.25', '1.30'],
      lineNumber: 1,
      intervalLength: 30,
    });
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "code": "MISSING_INTERVAL_FIELDS",
          "line": 1,
          "message": "Interval record missing required fields. Expected 55, got 4",
          "severity": "error",
        },
      ]
    `);
  });
});
