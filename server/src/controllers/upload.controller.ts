import { Request, Response, NextFunction } from "express";

import { IResumeService } from "../services/resume/iresume_service";
import { ResumeService } from "../services/resume/resume_service";

/**
 * Controller responsible for handling resume upload and processing requests.
 * This controller delegates the full resume processing pipeline (parse + clean)
 * to a high-level resume service.
 */
export class UploadController {
    private static resume_service: IResumeService = new ResumeService();

    /**
     * Handle resume upload and full processing workflow.
     *
     * @param request - Express request containing the uploaded resume file.
     * @param response - Express response object for sending processed text.
     * @param next - Express next middleware function.
     * @returns A JSON response with processed resume text.
     */
    public static async upload_resume(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            if (!request.file || !request.file.path) {
                return response.status(400).json({
                    success: false,
                    message: "No resume file uploaded."
                });
            }

            const file_path: string = request.file.path;

            const processed_text: string =
                await UploadController.resume_service.process_resume(file_path);

            return response.json({
                success: true,
                text: processed_text
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return response.status(500).json({
                    success: false,
                    message: error.message
                });
            }

            return response.status(500).json({
                success: false,
                message: "Unexpected error occurred while processing the uploaded resume."
            });
        }
    }
}
