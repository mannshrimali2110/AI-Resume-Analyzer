export function cleanText(text: string): string {
  // Remove non-printable ASCII, excessive whitespace, flatten bullets, preserve section headings
  return text
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/•/g, '-')
    .replace(/\r?\n/g, '\n')
    .trim();
}
