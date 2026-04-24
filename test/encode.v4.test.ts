import { describe, expect, it } from 'vitest';
import { encodePayload, encodeV4 } from '../src/encode';

const vectors = [
  {
    input: { iban: 'FI79 4405 2020 0360 82', amount: 4883.15, reference: '86851 62596 19897', dueDate: '2010-06-12' },
    expected: '479440520200360820048831500000000868516259619897100612',
  },
  {
    input: { iban: 'FI58 1017 1000 0001 22', amount: 482.99, reference: '55958 22432 94671', dueDate: '2012-01-31' },
    expected: '458101710000001220004829900000000559582243294671120131',
  },
  {
    input: { iban: 'FI02 5000 4640 0013 02', amount: 693.8, reference: '69 87567 20834 35364', dueDate: '2011-07-24' },
    expected: '402500046400013020006938000000069875672083435364110724',
  },
  {
    input: { iban: 'FI15 6601 0001 5306 41', amount: 7444.54, reference: '7 75847 47906 47489', dueDate: '2019-12-19' },
    expected: '415660100015306410074445400000007758474790647489191219',
  },
  {
    input: { iban: 'FI16 8000 1400 0502 67', amount: 935.85, reference: '78 77767 96566 28687', dueDate: null },
    expected: '416800014000502670009358500000078777679656628687000000',
  },
  {
    input: { iban: 'FI73 3131 3001 0000 58', amount: 0, reference: '8 68624', dueDate: '2013-08-09' },
    expected: '473313130010000580000000000000000000000000868624130809',
  },
  {
    input: {
      iban: 'FI83 3301 0001 1007 75',
      amount: 150000.2,
      reference: '92125 37425 25398 97737',
      dueDate: '2016-05-25',
    },
    expected: '483330100011007751500002000092125374252539897737160525',
  },
  {
    input: { iban: 'FI39 3636 3002 0924 92', amount: 1.03, reference: '5907 38390', dueDate: '2023-03-11' },
    expected: '439363630020924920000010300000000000000590738390230311',
  },
  {
    input: { iban: 'FI92 3939 0001 0033 91', amount: 0.02, reference: '13 57914', dueDate: '2099-12-24' },
    expected: '492393900010033910000000200000000000000001357914991224',
  },
] as const;

describe('encodeV4', () => {
  it.each(vectors)('encodes v4 test vector', ({ input, expected }) => {
    expect(encodeV4(input)).toBe(expected);
    expect(encodeV4(input)).toHaveLength(54);
  });

  it('encodePayload dispatches to v4 for national reference', () => {
    expect(encodePayload(vectors[0].input)).toBe(vectors[0].expected);
  });
});
