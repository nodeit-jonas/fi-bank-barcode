# finnish-bank-barcode

Generate Finnish bank barcodes (`pankkiviivakoodi`) according to Finanssiala ry specification v5.3: https://www.finanssiala.fi/wp-content/uploads/2021/03/Pankkiviivakoodi-opas.pdf

## Installation

```bash
npm install finnish-bank-barcode
```

## Quickstart (version 4, national reference)

```ts
import { encodePayload, generateBarcodeSVG } from 'finnish-bank-barcode';

const input = {
  iban: 'FI58 1017 1000 0001 22',
  amount: 482.99,
  reference: '55958 22432 94671',
  dueDate: '2012-01-31',
};

const payload = encodePayload(input);
const svg = generateBarcodeSVG(input);
```

## Quickstart (version 5, RF reference)

```ts
import { encodePayload } from 'finnish-bank-barcode';

const payload = encodePayload({
  iban: 'FI58 1017 1000 0001 22',
  amount: 482.99,
  rfReference: 'RF06559582243294671',
  dueDate: '2012-01-31',
});
```

## API

- `encodePayload(input)`
- `encodeV4(input)`
- `encodeV5(input)`
- `generateBarcodeSVG(input, options?)`
- `generateBarcodePNG(input, options?)` (returns `Promise<Uint8Array>`)
- `generateBarcodeDataURL(input, options?)`
- `validateIBAN/validateAmount/validateNationalReference/validateRFReference/validateDueDate`
- `formatIBAN/formatReference/formatRFReference/formatAmount/formatDueDate`
- `BarcodeError`, `BarcodeErrorCode`

## Render Options

- `heightMm` default `11` (must be `10.0–12.7`)
- `widthMm` default `100` (must be `70–105`)
- `includeHumanReadableText` default `false`
- `backgroundColor` default `FFFFFF`
- `barColor` default `000000`

## Notes on Compliance

- FI IBAN only (`FI` + 16 digits)
- Missing due date encoded as `000000`
- `dueDate` passed as `Date` is interpreted in local time; prefer `YYYY-MM-DD` string for timezone-stable behavior
- Width and height are constrained to spec ranges
- Human-readable text should not be placed directly above/below the barcode per spec

## FAQ

- **Non-FI IBAN?** Not supported.
- **No due date?** Use `null`/`undefined` and barcode uses `000000`.
- **Zero amount?** Supported (`0.00`).

## Examples

- `examples/node-invoice.ts`
- `examples/browser.html`

## Contributing

Open an issue or PR. Always reference the official specification PDF for behavior changes.
