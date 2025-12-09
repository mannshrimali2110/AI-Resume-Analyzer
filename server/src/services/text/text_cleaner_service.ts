import { cleanText as clean_text_utility } from "../cleanText";
import { ITextCleaner } from "./itext_cleaner";

/**
 * Concrete implementation of text cleaning using local utility functions.
 */
export class TextCleanerService implements ITextCleaner {
    /**
     * Clean and normalize raw extracted text.
     *
     * @param raw_text - Raw resume text before normalization.
     * @returns Cleaned and normalized resume text.
     * @throws Error if text cleaning fails.
     */
    public clean_text(raw_text: string): string {
        try {
            const cleaned_text: string = clean_text_utility(raw_text);
            return cleaned_text;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Text cleaning failed: ${error.message}`);
            }

            throw new Error("Text cleaning failed due to an unknown error.");
        }
    }
}
