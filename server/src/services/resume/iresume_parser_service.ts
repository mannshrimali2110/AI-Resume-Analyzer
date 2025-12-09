/**
 * Interface for resume parsing services.
 * Defines the contract for extracting text from uploaded resume files.
 */
export interface IResumeParserService {
    /**
     * Parse a resume file and extract clean text.
     *
     * @param file_path - Absolute or relative path to the uploaded resume file.
     * @returns Extracted resume text.
     * @throws Error if parsing fails.
     */
    parse_resume(file_path: string): Promise<string>;
}
