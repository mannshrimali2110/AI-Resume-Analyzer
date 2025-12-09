import { Request, Response, NextFunction } from "express";

import { IAIService } from "../services/ai/iai_service";
import { GeminiAIService } from "../services/ai/gemini_ai_service";
import logger from "../utils/logger";

/**
 * Controller responsible for handling resume analysis requests.
 * This controller delegates AI processing to an injected AI service
 * that follows the IAIService interface.
 */
export class AnalyzeController {
    private static ai_service: IAIService = new GeminiAIService();

    /**
     * Handle resume analysis requests.
     *
     * @param request - Express request object containing resume and job description text.
     * @param response - Express response object for sending analysis results.
     * @param next - Express next middleware function.
     * @returns A JSON response containing AI analysis results.
     */
    public static async analyze_resume(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            console.log("[AnalyzeController] Received analysis request");
            const resume_text: string = request.body.resumeText;
            const job_description_text: string = request.body.jdText;
            const options: Record<string, unknown> | undefined = request.body.options;

            console.log("[AnalyzeController] Input validated, calling AI service");
            const analysis_result = await AnalyzeController.ai_service.analyze_resume(
                resume_text,
                job_description_text,
                options
            );

            console.log("[AnalyzeController] Returning analysis result");
            return response.json({
                success: true,
                ...analysis_result
            });
        } catch (error: unknown) {
            console.error("[AnalyzeController] Error:", error);
            logger.error({ error }, "Error during resume analysis");
            
            if (error instanceof Error) {
                return response.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            return response.status(500).json({
                success: false,
                message: "Unexpected error occurred during resume analysis."
            });
        }
    }
}
