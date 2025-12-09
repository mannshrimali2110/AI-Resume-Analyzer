import { analyze_resume_gemini } from "../gemini";
import { IAIService } from "./iai_service";

/**
 * Concrete implementation of the IAIService using Google Gemini.
 */
export class GeminiAIService implements IAIService {
    /**
     * Analyze a resume using the Gemini AI model.
     *
     * @param resume_text - Cleaned resume text.
     * @param job_description_text - Job description text.
     * @param options - Optional configuration parameters.
     * @returns AI analysis result.
     * @throws Error if AI processing fails.
     */
    public async analyze_resume(
        resume_text: string,
        job_description_text: string,
        options?: Record<string, unknown>
    ): Promise<Record<string, unknown>> {
        try {
            console.log("[GeminiAIService] Starting analysis...");
            const analysis_result = await analyze_resume_gemini(
                resume_text,
                job_description_text,
                options
            );
            console.log("[GeminiAIService] Analysis completed successfully");
            return analysis_result;
        } catch (error: unknown) {
            console.error("[GeminiAIService] Error during analysis:", error);
            if (error instanceof Error) {
                throw new Error(`Gemini AI analysis failed: ${error.message}`);
            }

            throw new Error("Gemini AI analysis failed due to an unknown error.");
        }
    }
}
