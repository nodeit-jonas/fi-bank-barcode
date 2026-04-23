import bwipjs from 'bwip-js';
import { BarcodeError, BarcodeErrorCode } from './errors';
import { encodePayload } from './encode';
import type { BarcodeInput, BarcodeRenderOptions } from './types';

const DEFAULT_OPTIONS: Required<BarcodeRenderOptions> = {
  heightMm: 11,
  widthMm: 100,
  includeHumanReadableText: false,
  backgroundColor: 'FFFFFF',
  barColor: '000000',
};

const resolveOptions = (options?: BarcodeRenderOptions): Required<BarcodeRenderOptions> => {
  const resolved = { ...DEFAULT_OPTIONS, ...options };

  if (resolved.widthMm < 70 || resolved.widthMm > 105) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_RENDER_OPTIONS,
      'Barcode width must be between 70 and 105 millimeters.',
    );
  }

  if (resolved.heightMm < 10 || resolved.heightMm > 12.7) {
    throw new BarcodeError(
      BarcodeErrorCode.INVALID_RENDER_OPTIONS,
      'Barcode height must be between 10.0 and 12.7 millimeters.',
    );
  }

  return resolved;
};

const toB64 = (value: string): string => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64');
  }
  const bytes = new TextEncoder().encode(value);
  const chunkSize = 0x8000;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    parts.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return btoa(parts.join(''));
};

const buildBwipOptions = (payload: string, options: Required<BarcodeRenderOptions>) => ({
  bcid: 'code128',
  text: payload,
  includetext: options.includeHumanReadableText,
  backgroundcolor: options.backgroundColor,
  barcolor: options.barColor,
  width: options.widthMm,
  height: options.heightMm,
});

/** Generate a Code 128 barcode as SVG. */
export const generateBarcodeSVG = (input: BarcodeInput, options?: BarcodeRenderOptions): string => {
  const payload = encodePayload(input);
  const resolved = resolveOptions(options);
  return bwipjs.toSVG(buildBwipOptions(payload, resolved));
};

/** Generate a Code 128 barcode as PNG bytes (Node.js). */
export const generateBarcodePNG = async (
  input: BarcodeInput,
  options?: BarcodeRenderOptions,
): Promise<Uint8Array> => {
  const payload = encodePayload(input);
  const resolved = resolveOptions(options);
  return bwipjs.toBuffer(buildBwipOptions(payload, resolved));
};

/** Generate a data:image/svg+xml;base64 URL. */
export const generateBarcodeDataURL = (input: BarcodeInput, options?: BarcodeRenderOptions): string => {
  const svg = generateBarcodeSVG(input, options);
  return `data:image/svg+xml;base64,${toB64(svg)}`;
};
