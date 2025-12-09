/**
 * Interface for AI-based resume analysis services.
 * This defines the contract that all AI providers must follow.
 */
export interface IAIService {
    /**
     * Analyze a resume against a job description.
     *
     * @param resume_text - Cleaned resume text.
     * @param job_description_text - Job description text.
     * @param options - Optional configuration for AI analysis.
     * @returns A structured AI analysis result.
     * @throws Error if AI processing fails.
     */
    analyze_resume(
        resume_text: string,
        job_description_text: string,
        options?: Record<string, unknown>
    ): Promise<Record<string, unknown>>;
}
