import { describe, expect, it } from 'vitest';
import { encodePayload, encodeV5 } from '../src/encode';

const vectors = [
  {
    input: { iban: 'FI79 4405 2020 0360 82', amount: 4883.15, rfReference: 'RF09868516259619897', dueDate: '2010-06-12' },
    expected: '579440520200360820048831500000009868516259619897100612',
  },
  {
    input: { iban: 'FI58 1017 1000 0001 22', amount: 482.99, rfReference: 'RF06559582243294671', dueDate: '2012-01-31' },
    expected: '558101710000001220004829900000006559582243294671120131',
  },
  {
    input: { iban: 'FI02 5000 4640 0013 02', amount: 693.8, rfReference: 'RF5869875672083435364', dueDate: '2011-07-24' },
    expected: '502500046400013020006938000005869875672083435364110724',
  },
  {
    input: { iban: 'FI15 6601 0001 5306 41', amount: 7444.54, rfReference: 'RF847758474790647489', dueDate: '2019-12-19' },
    expected: '515660100015306410074445400000847758474790647489191219',
  },
  {
    input: { iban: 'FI16 8000 1400 0502 67', amount: 935.85, rfReference: 'RF6078777679656628687', dueDate: null },
    expected: '516800014000502670009358500006078777679656628687000000',
  },
  {
    input: { iban: 'FI73 3131 3001 0000 58', amount: 0, rfReference: 'RF10868624', dueDate: '2013-08-09' },
    expected: '573313130010000580000000000000000000000010868624130809',
  },
  {
    input: {
      iban: 'FI83 3301 0001 1007 75',
      amount: 150000.2,
      rfReference: 'RF7192125374252539897737',
      dueDate: '2016-05-25',
    },
    expected: '583330100011007751500002007192125374252539897737160525',
  },
  {
    input: { iban: 'FI39 3636 3002 0924 92', amount: 1.03, rfReference: 'RF66590738390', dueDate: '2023-03-11' },
    expected: '539363630020924920000010300000000000066590738390230311',
  },
  {
    input: { iban: 'FI92 3939 0001 0033 91', amount: 0.02, rfReference: 'RF951357914', dueDate: '2099-12-24' },
    expected: '592393900010033910000000200000000000000951357914991224',
  },
] as const;

describe('encodeV5', () => {
  it.each(vectors)('encodes v5 test vector', ({ input, expected }) => {
    expect(encodeV5(input)).toBe(expected);
    expect(encodeV5(input)).toHaveLength(54);
  });

  it('pads RF numeric section to 23 digits', () => {
    expect(encodeV5(vectors[5].input).slice(25, 54 - 6)).toBe('00000000000000010868624');
    expect(encodeV5(vectors[6].input).slice(25, 54 - 6)).toBe('07192125374252539897737');
  });

  it('encodePayload dispatches to v5 for RF reference', () => {
    expect(encodePayload(vectors[0].input)).toBe(vectors[0].expected);
  });
});
