import { BarcodeError, BarcodeErrorCode } from './errors';
import type { DueDateInput } from './types';

const IBAN_FI_LENGTH = 18;

const mod97 = (input: string): number => {
  let remainder = 0;
  for (const char of input) {
    const value = /\d/.test(char) ? char : (char.charCodeAt(0) - 55).toString();
    for (const digit of value) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
};

const parseIsoDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
};

/** Validate and normalize a Finnish IBAN. */
export const validateIBAN = (iban: string): string => {
  const normalized = iban.replace(/\s+/g, '').toUpperCase();

  if (!normalized.startsWith('FI') || normalized.length !== IBAN_FI_LENGTH) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_IBAN, 'IBAN must be Finnish and 18 characters long.');
  }

  if (!/^FI\d{16}$/.test(normalized)) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_IBAN, 'Finnish IBAN must contain only digits after FI.');
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  if (mod97(rearranged) !== 1) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_IBAN, 'IBAN checksum failed.');
  }

  return normalized;
};

/** Validate and split amount into euros and cents. */
export const validateAmount = (amount: number): { euros: number; cents: number } => {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_AMOUNT, 'Amount must be a non-negative finite number.');
  }

  const totalCents = Math.round((amount + Number.EPSILON) * 100);
  if (totalCents > 99_999_999) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_AMOUNT, 'Amount exceeds the maximum allowed value.');
  }

  return {
    euros: Math.floor(totalCents / 100),
    cents: totalCents % 100,
  };
};

/** Validate and normalize Finnish national reference. */
export const validateNationalReference = (ref: string): string => {
  const normalized = ref.replace(/\s+/g, '');

  if (!/^\d{4,20}$/.test(normalized)) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_REFERENCE, 'Reference must contain 4-20 digits.');
  }

  const body = normalized.slice(0, -1);
  const checkDigit = Number(normalized[normalized.length - 1]);
  const weights = [7, 3, 1];

  let sum = 0;
  let weightIndex = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * weights[weightIndex];
    weightIndex = (weightIndex + 1) % weights.length;
  }

  const expected = (10 - (sum % 10)) % 10;
  if (checkDigit !== expected) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_REFERENCE, 'Finnish reference checksum failed.');
  }

  return normalized;
};

/** Validate and normalize RF reference. */
export const validateRFReference = (ref: string): string => {
  const normalized = ref.replace(/\s+/g, '').toUpperCase();

  if (!/^RF\d{2}[A-Z0-9]+$/.test(normalized)) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_RF_REFERENCE, 'RF reference format is invalid.');
  }

  if (!/^RF\d{2}\d+$/.test(normalized)) {
    throw new BarcodeError(
      BarcodeErrorCode.RF_REFERENCE_CONTAINS_LETTERS,
      'RF reference must only contain digits after the checksum.',
    );
  }

  if (normalized.length > 25) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_RF_REFERENCE,
      'RF reference is too long for Finnish barcode v5 encoding.',
    );
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  if (mod97(rearranged) !== 1) {
    throw new BarcodeError(BarcodeErrorCode.INVALID_RF_REFERENCE, 'RF reference checksum failed.');
  }

  return normalized;
};

/**
 * Validate due date and encode as YYMMDD or 000000.
 * Date inputs are interpreted in local time; prefer YYYY-MM-DD strings for timezone-stable behavior.
 */
export const validateDueDate = (date: DueDateInput): string => {
  if (date == null) {
    return '000000';
  }

  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;

  if (date instanceof Date) {
    if (!Number.isNaN(date.getTime())) {
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
    }
  } else if (typeof date === 'string') {
    const parsed = parseIsoDate(date);
    if (parsed) {
      year = parsed.getFullYear();
      month = parsed.getMonth() + 1;
      day = parsed.getDate();
    }
  }

  if (year == null || month == null || day == null) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_DUE_DATE,
      'Due date must be a Date, YYYY-MM-DD string, null, or undefined.',
    );
  }

  const yy = String(year % 100).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  return `${yy}${mm}${dd}`;
};
