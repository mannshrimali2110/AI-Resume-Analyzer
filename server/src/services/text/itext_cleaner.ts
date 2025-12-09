/**
 * Interface for text cleaning services.
 * Defines the contract for normalizing and cleaning extracted resume text.
 */
export interface ITextCleaner {
    /**
     * Clean and normalize raw text extracted from resumes.
     *
     * @param raw_text - Raw extracted text.
     * @returns Cleaned and normalized text.
     * @throws Error if text cleaning fails.
     */
    clean_text(raw_text: string): string;
}
