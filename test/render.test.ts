import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BarcodeErrorCode } from '../src/errors';

const bwipMock = vi.hoisted(() => ({
  toSVG: vi.fn(() => '<svg>mock</svg>'),
  toBuffer: vi.fn(async () => Buffer.from('mock')),
}));

vi.mock('bwip-js', () => ({
  default: bwipMock,
}));

import { generateBarcodeDataURL, generateBarcodePNG, generateBarcodeSVG } from '../src/render';

const input = {
  iban: 'FI58 1017 1000 0001 22',
  amount: 482.99,
  reference: '55958 22432 94671',
  dueDate: '2012-01-31',
} as const;

describe('render', () => {
  beforeEach(() => {
    bwipMock.toSVG.mockClear();
    bwipMock.toBuffer.mockClear();
  });

  it('generates SVG output', () => {
    const svg = generateBarcodeSVG(input);
    expect(svg).toContain('<svg');
    expect(bwipMock.toSVG).toHaveBeenCalledOnce();
  });

  it('generates a data URL', () => {
    expect(generateBarcodeDataURL(input)).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('generates PNG bytes as Uint8Array', async () => {
    const png = await generateBarcodePNG(input);
    expect(png).toBeInstanceOf(Uint8Array);
    expect(bwipMock.toBuffer).toHaveBeenCalledOnce();
  });

  it('enforces width and height constraints', () => {
    try {
      generateBarcodeSVG(input, { widthMm: 69 });
      throw new Error('expected width validation to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RENDER_OPTIONS);
    }

    try {
      generateBarcodeSVG(input, { heightMm: 13 });
      throw new Error('expected height validation to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RENDER_OPTIONS);
    }
  });

  it('rejects non-finite width and height values', () => {
    try {
      generateBarcodeSVG(input, { widthMm: Number.NaN });
      throw new Error('expected width validation to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RENDER_OPTIONS);
    }

    try {
      generateBarcodeSVG(input, { heightMm: Number.POSITIVE_INFINITY });
      throw new Error('expected height validation to throw');
    } catch (error) {
      expect((error as { code?: string }).code).toBe(BarcodeErrorCode.INVALID_RENDER_OPTIONS);
    }
  });

  it('treats explicit undefined dimensions as not provided', () => {
    generateBarcodeSVG(input, { widthMm: undefined, heightMm: undefined });

    expect(bwipMock.toSVG).toHaveBeenCalledOnce();
    expect(bwipMock.toSVG).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 100,
        height: 11,
      }),
    );
  });
});
