import { describe, expect, it } from 'vitest';
import { formatAmount, formatDueDate, formatIBAN, formatRFReference, formatReference } from '../src/format';

describe('format helpers', () => {
  it('formats IBAN', () => {
    expect(formatIBAN('FI5810171000000122')).toBe('FI58 1017 1000 0001 22');
  });

  it('formats national reference in groups of 5 from right', () => {
    expect(formatReference('559582243294671')).toBe('55958 22432 94671');
  });

  it('formats RF reference in groups of 4 after RF', () => {
    expect(formatRFReference('RF06559582243294671')).toBe('RF06 5595 8224 3294 671');
  });

  it('formats amount in Finnish locale', () => {
    expect(formatAmount(482.99)).toBe('482,99');
  });

  it('formats due date as pp.kk.vvvv', () => {
    expect(formatDueDate('2012-01-31')).toBe('31.1.2012');
  });

  it('preserves 4-digit year from ISO input', () => {
    expect(formatDueDate('2099-12-24')).toBe('24.12.2099');
  });
});
