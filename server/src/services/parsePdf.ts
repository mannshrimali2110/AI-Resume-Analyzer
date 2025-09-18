import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import { cleanText } from './cleanText';

export async function parsePdf(filePath: string) {
  const dataBuffer = await fs.readFile(filePath);
  const pdfData = await pdfParse(dataBuffer);
  const text = cleanText(pdfData.text);
  return {
    text,
    meta: {
      pages: pdfData.numpages,
      fileName: path.basename(filePath),
      sizeKB: Math.round(dataBuffer.length / 1024),
      type: 'pdf',
    },
  };
}
