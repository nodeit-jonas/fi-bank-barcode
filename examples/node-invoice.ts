import { writeFile } from 'node:fs/promises';
import { generateBarcodePNG, generateBarcodeSVG } from '../src';

const input = {
  iban: 'FI58 1017 1000 0001 22',
  amount: 482.99,
  reference: '55958 22432 94671',
  dueDate: '2012-01-31',
};

const main = async () => {
  const svg = generateBarcodeSVG(input);
  const png = await generateBarcodePNG(input);

  await writeFile('invoice.svg', svg, 'utf8');
  await writeFile('invoice.png', png);
};

void main();
