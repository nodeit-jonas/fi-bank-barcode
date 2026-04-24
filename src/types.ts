export type DueDateInput = Date | string | null | undefined;

export type BarcodeInputV4 = {
  iban: string;
  amount: number;
  reference: string;
  dueDate?: DueDateInput;
};

export type BarcodeInputV5 = {
  iban: string;
  amount: number;
  rfReference: string;
  dueDate?: DueDateInput;
};

export type BarcodeInput = BarcodeInputV4 | BarcodeInputV5;

export type BarcodeVersion = 4 | 5;

export type BarcodeRenderOptions = {
  heightMm?: number;
  widthMm?: number;
  includeHumanReadableText?: boolean;
  backgroundColor?: string;
  barColor?: string;
};
