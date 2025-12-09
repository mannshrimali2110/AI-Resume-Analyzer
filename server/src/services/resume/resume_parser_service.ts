import { extractResumeText } from "../../utils/extractResume";
import { IResumeParserService } from "./iresume_parser_service";

/**
 * Concrete implementation of resume parsing using local file utilities.
 */
export class ResumeParserService implements IResumeParserService {
    /**
     * Parse a resume file and return extracted text.
     *
     * @param file_path - Path to the uploaded resume file.
     * @returns Extracted text content from the resume.
     * @throws Error if parsing fails.
     */
    public async parse_resume(file_path: string): Promise<string> {
        try {
            const extracted_text = await extractResumeText(file_path);
            return extracted_text;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Resume parsing failed: ${error.message}`);
            }

            throw new Error("Resume parsing failed due to an unknown error.");
        }
    }
}
