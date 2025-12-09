import { ResumeService } from "../../../../src/services/resume/resume_service";
import { ResumeParserService } from "../../../../src/services/resume/resume_parser_service";
import { TextCleanerService } from "../../../../src/services/text/text_cleaner_service";

/**
 * Unit tests for ResumeService.
 * These tests validate orchestration between parser and cleaner
 * when dependencies are instantiated internally.
 */
describe("ResumeService", () => {
    let resume_service: ResumeService;

    /**
     * Set up a fresh ResumeService instance before each test.
     */
    beforeEach(() => {
        resume_service = new ResumeService();
        jest.clearAllMocks();
    });

    /**
     * Should process resume successfully through parser and cleaner.
     */
    it("should process resume successfully", async () => {
        const mock_file_path = "uploads/test_resume.pdf";
        const mock_parsed_text = "Raw   resume   text";
        const mock_cleaned_text = "Raw resume text";

        jest
            .spyOn(ResumeParserService.prototype, "parse_resume")
            .mockResolvedValue(mock_parsed_text);

        jest
            .spyOn(TextCleanerService.prototype, "clean_text")
            .mockReturnValue(mock_cleaned_text);

        const result = await resume_service.process_resume(mock_file_path);

        expect(result).toBe(mock_cleaned_text);
        expect(ResumeParserService.prototype.parse_resume).toHaveBeenCalledTimes(1);
        expect(ResumeParserService.prototype.parse_resume).toHaveBeenCalledWith(mock_file_path);

        expect(TextCleanerService.prototype.clean_text).toHaveBeenCalledTimes(1);
        expect(TextCleanerService.prototype.clean_text).toHaveBeenCalledWith(mock_parsed_text);
    });

    /**
     * Should throw wrapped error when resume parsing fails.
     */
    it("should throw error when resume parsing fails", async () => {
        const mock_file_path = "uploads/broken_resume.pdf";

        jest
            .spyOn(ResumeParserService.prototype, "parse_resume")
            .mockRejectedValue(new Error("Parsing failed"));

        await expect(
            resume_service.process_resume(mock_file_path)
        ).rejects.toThrow("Resume processing failed");
    });

    /**
     * Should throw wrapped error when text cleaning fails.
     */
    it("should throw error when text cleaning fails", async () => {
        const mock_file_path = "uploads/test_resume.pdf";
        const mock_parsed_text = "Raw resume text";

        jest
            .spyOn(ResumeParserService.prototype, "parse_resume")
            .mockResolvedValue(mock_parsed_text);

        jest
            .spyOn(TextCleanerService.prototype, "clean_text")
            .mockImplementation(() => {
                throw new Error("Cleaning failed");
            });

        await expect(
            resume_service.process_resume(mock_file_path)
        ).rejects.toThrow("Resume processing failed");
    });

    /**
     * Should throw generic error when unknown failure occurs.
     */
    it("should throw generic error on unknown failure", async () => {
        const mock_file_path = "uploads/unknown_error.pdf";

        jest
            .spyOn(ResumeParserService.prototype, "parse_resume")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .mockRejectedValue(undefined as any);

        await expect(
            resume_service.process_resume(mock_file_path)
        ).rejects.toThrow("Resume processing failed due to an unknown error.");
    });
});
