import { BarcodeError, BarcodeErrorCode } from './errors';
import type { BarcodeInput, BarcodeInputV4, BarcodeInputV5 } from './types';
import {
  validateAmount,
  validateDueDate,
  validateIBAN,
  validateNationalReference,
  validateRFReference,
} from './validation';

const assertPayloadLength = (payload: string): string => {
  if (payload.length !== 54) {
    throw new BarcodeError(
      BarcodeErrorCode.INTERNAL_ENCODING_ERROR,
      `Encoded payload must be exactly 54 digits, got ${payload.length}.`,
    );
  }
  return payload;
};

/** Encode a version 4 Finnish bank barcode payload. */
export const encodeV4 = (input: BarcodeInputV4): string => {
  const iban = validateIBAN(input.iban);
  const { euros, cents } = validateAmount(input.amount);
  const reference = validateNationalReference(input.reference);
  const dueDate = validateDueDate(input.dueDate);

  return assertPayloadLength(
    [
      '4',
      iban.slice(2),
      String(euros).padStart(6, '0'),
      String(cents).padStart(2, '0'),
      '000',
      reference.padStart(20, '0'),
      dueDate,
    ].join(''),
  );
};

/** Encode a version 5 Finnish bank barcode payload. */
export const encodeV5 = (input: BarcodeInputV5): string => {
  const iban = validateIBAN(input.iban);
  const { euros, cents } = validateAmount(input.amount);
  const rfReference = validateRFReference(input.rfReference);
  const dueDate = validateDueDate(input.dueDate);

  const rfNumericRaw = rfReference.slice(2, 4) + rfReference.slice(4);
  if (rfNumericRaw.length > 23) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_RF_REFERENCE,
      'RF reference is too long for v5 barcode payload.',
    );
  }
  const rfNumeric = rfNumericRaw.padStart(23, '0');

  return assertPayloadLength(
    ['5', iban.slice(2), String(euros).padStart(6, '0'), String(cents).padStart(2, '0'), rfNumeric, dueDate].join(
      '',
    ),
  );
};

/** Encode a Finnish bank barcode payload (v4 or v5). */
export const encodePayload = (input: BarcodeInput): string => {
  const candidate = input as {
    reference?: unknown;
    rfReference?: unknown;
  };
  const hasRef = typeof candidate.reference === 'string' && candidate.reference.trim() !== '';
  const hasRfRef = typeof candidate.rfReference === 'string' && candidate.rfReference.trim() !== '';

  if (hasRef === hasRfRef) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_INPUT,
      'Input must contain exactly one of reference or rfReference.',
    );
  }

  return hasRef ? encodeV4(input as BarcodeInputV4) : encodeV5(input as BarcodeInputV5);
};
