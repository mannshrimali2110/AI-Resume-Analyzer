/**
 * Interface for resume business services.
 * Defines the contract for end-to-end resume processing.
 */
export interface IResumeService {
    /**
     * Process a resume file by parsing and cleaning its content.
     *
     * @param file_path - Path to the uploaded resume file.
     * @returns Fully processed and cleaned resume text.
     * @throws Error if any processing step fails.
     */
    process_resume(file_path: string): Promise<string>;
}
