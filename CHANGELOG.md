# Changelog

All notable changes to `finnish-bank-barcode` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-25

### Added

- `encodePayload`, `encodeV4`, `encodeV5` — encode Finnish bank barcode payloads (version 4 national reference and version 5 RF reference) per Finanssiala ry specification v5.3.
- `generateBarcodeSVG`, `generateBarcodePNG`, `generateBarcodeDataURL` — render Code 128 barcodes via `bwip-js`.
- Validation helpers: `validateIBAN`, `validateAmount`, `validateNationalReference`, `validateRFReference`, `validateDueDate`.
- Formatting helpers: `formatIBAN`, `formatReference`, `formatRFReference`, `formatAmount`, `formatDueDate`.
- `BarcodeError` / `BarcodeErrorCode` for structured error handling.
- Render options: `heightMm`, `widthMm`, `includeHumanReadableText`, `backgroundColor`, `barColor`.
- Dual CJS/ESM build with TypeScript declarations.
