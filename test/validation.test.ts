import { describe, expect, it } from 'vitest';
import { BarcodeErrorCode } from '../src/errors';
import {
  validateAmount,
  validateDueDate,
  validateIBAN,
  validateNationalReference,
  validateRFReference,
} from '../src/validation';

describe('validateIBAN', () => {
  it('accepts valid Finnish IBAN and normalizes it', () => {
    expect(validateIBAN('FI79 4405 2020 0360 82')).toBe('FI7944052020036082');
  });

  it('rejects invalid IBAN with code', () => {
    try {
      validateIBAN('SE7944052020036082');
      throw new Error('expected validateIBAN to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_IBAN);
    }
  });

  it('rejects non-digit IBAN body and checksum mismatch', () => {
    try {
      validateIBAN('FI79A4052020036082');
      throw new Error('expected non-digit IBAN to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_IBAN);
    }

    try {
      validateIBAN('FI7944052020036081');
      throw new Error('expected IBAN checksum to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_IBAN);
    }
  });
});

describe('validateAmount', () => {
  it('splits euros and cents with rounding', () => {
    expect(validateAmount(1.005)).toEqual({ euros: 1, cents: 1 });
  });

  it('rejects negative and too large values with code', () => {
    try {
      validateAmount(-1);
      throw new Error('expected negative amount to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_AMOUNT);
    }

    try {
      validateAmount(1_000_000);
      throw new Error('expected too large amount to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_AMOUNT);
    }
  });
});

describe('validateNationalReference', () => {
  it('accepts valid Finnish reference', () => {
    expect(validateNationalReference('55958 22432 94671')).toBe('559582243294671');
  });

  it('rejects invalid checksum with code', () => {
    try {
      validateNationalReference('55958 22432 94672');
      throw new Error('expected national reference to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_REFERENCE);
    }
  });

  it('rejects non-numeric national reference format', () => {
    try {
      validateNationalReference('12A4');
      throw new Error('expected invalid reference format to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_REFERENCE);
    }
  });
});

describe('validateRFReference', () => {
  it('accepts valid RF reference', () => {
    expect(validateRFReference('RF06 5595 8224 3294 671')).toBe('RF06559582243294671');
  });

  it('rejects letters after checksum with dedicated code', () => {
    try {
      validateRFReference('RF18ABC123');
      throw new Error('expected RF letters to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.RF_REFERENCE_CONTAINS_LETTERS);
    }
  });

  it('rejects bad checksum with code', () => {
    try {
      validateRFReference('RF07559582243294671');
      throw new Error('expected RF checksum to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RF_REFERENCE);
    }
  });

  it('rejects malformed RF prefix', () => {
    try {
      validateRFReference('123456');
      throw new Error('expected RF format to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RF_REFERENCE);
    }
  });

  it('rejects RF references longer than v5 allows', () => {
    try {
      validateRFReference('RF19123456789012345678901234');
      throw new Error('expected overlong RF reference to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RF_REFERENCE);
    }
  });
});

describe('validateDueDate', () => {
  it('returns zeros for missing date', () => {
    expect(validateDueDate(undefined)).toBe('000000');
    expect(validateDueDate(null)).toBe('000000');
  });

  it('formats ISO date strings and local Date values', () => {
    expect(validateDueDate('2012-01-31')).toBe('120131');
    expect(validateDueDate(new Date(2012, 0, 31))).toBe('120131');
  });

  it('rejects invalid date strings with code', () => {
    try {
      validateDueDate('31.01.2012');
      throw new Error('expected invalid due date to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_DUE_DATE);
    }
  });

  it('rejects impossible and invalid Date values', () => {
    try {
      validateDueDate('2012-02-31');
      throw new Error('expected impossible date to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_DUE_DATE);
    }

    try {
      validateDueDate(new Date('invalid'));
      throw new Error('expected invalid Date to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_DUE_DATE);
    }
  });
});
