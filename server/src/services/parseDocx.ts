import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import { cleanText } from './cleanText';

export async function parseDocx(filePath: string) {
  const dataBuffer = await fs.readFile(filePath);
  const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
  const text = cleanText(value);
  return {
    text,
    meta: {
      fileName: path.basename(filePath),
      sizeKB: Math.round(dataBuffer.length / 1024),
      type: 'docx',
    },
  };
}
