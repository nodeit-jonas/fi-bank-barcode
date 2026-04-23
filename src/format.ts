import { validateAmount, validateDueDate, validateIBAN, validateNationalReference, validateRFReference } from './validation';

const groupRight = (value: string, groupSize: number): string => {
  const groups: string[] = [];
  for (let i = value.length; i > 0; i -= groupSize) {
    groups.unshift(value.slice(Math.max(0, i - groupSize), i));
  }
  return groups.join(' ');
};

const groupLeft = (value: string, groupSize: number): string => {
  const groups: string[] = [];
  for (let i = 0; i < value.length; i += groupSize) {
    groups.push(value.slice(i, i + groupSize));
  }
  return groups.join(' ');
};

/** Format IBAN in groups of 4. */
export const formatIBAN = (iban: string): string => {
  const normalized = validateIBAN(iban);
  return groupLeft(normalized, 4);
};

/** Format national reference in 5-digit groups from right. */
export const formatReference = (ref: string): string => {
  const normalized = validateNationalReference(ref);
  return groupRight(normalized, 5);
};

/** Format RF reference with groups of 4 after RFxx. */
export const formatRFReference = (ref: string): string => {
  const normalized = validateRFReference(ref);
  return normalized.slice(0, 4) + ' ' + groupLeft(normalized.slice(4), 4);
};

/** Format amount using locale formatting. */
export const formatAmount = (amount: number, locale = 'fi-FI'): string => {
  const { euros, cents } = validateAmount(amount);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros + cents / 100);
};

/** Format due date as d.m.yyyy. */
export const formatDueDate = (date: Date | string): string => {
  validateDueDate(date);

  if (typeof date === 'string') {
    const [yyyy, mm, dd] = date.split('-');
    return `${Number(dd)}.${Number(mm)}.${yyyy}`;
  }

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};
