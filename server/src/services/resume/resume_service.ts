import { IResumeService } from "./iresume_service";
import { IResumeParserService } from "./iresume_parser_service";
import { ResumeParserService } from "./resume_parser_service";
import { ITextCleaner } from "../text/itext_cleaner";
import { TextCleanerService } from "../text/text_cleaner_service";

/**
 * Concrete implementation of resume business logic.
 * This service orchestrates resume parsing and text cleaning.
 */
export class ResumeService implements IResumeService {
    private resume_parser_service: IResumeParserService;
    private text_cleaner: ITextCleaner;

    /**
     * Initialize the resume service with default implementations.
     */
    public constructor() {
        this.resume_parser_service = new ResumeParserService();
        this.text_cleaner = new TextCleanerService();
    }

    /**
     * Process a resume file by extracting and cleaning its text.
     *
     * @param file_path - Path to the uploaded resume file.
     * @returns Fully processed resume text.
     * @throws Error if parsing or cleaning fails.
     */
    public async process_resume(file_path: string): Promise<string> {
        try {
            const raw_text: string =
                await this.resume_parser_service.parse_resume(file_path);

            const cleaned_text: string =
                this.text_cleaner.clean_text(raw_text);

            return cleaned_text;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Resume processing failed: ${error.message}`);
            }

            throw new Error("Resume processing failed due to an unknown error.");
        }
    }
}
