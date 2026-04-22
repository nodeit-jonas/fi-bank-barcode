export enum BarcodeErrorCode {
  INVALID_IBAN = 'INVALID_IBAN',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_REFERENCE = 'INVALID_REFERENCE',
  INVALID_RF_REFERENCE = 'INVALID_RF_REFERENCE',
  RF_REFERENCE_CONTAINS_LETTERS = 'RF_REFERENCE_CONTAINS_LETTERS',
  INVALID_DUE_DATE = 'INVALID_DUE_DATE',
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_RENDER_OPTIONS = 'INVALID_RENDER_OPTIONS',
  INTERNAL_ENCODING_ERROR = 'INTERNAL_ENCODING_ERROR',
}

export class BarcodeError extends Error {
  readonly code: BarcodeErrorCode;

  constructor(code: BarcodeErrorCode, message: string) {
    super(message);
    this.name = 'BarcodeError';
    this.code = code;
  }
}
