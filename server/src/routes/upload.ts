import { Router } from "express";

import { UploadController } from "../controllers/upload.controller";
import { uploadResumeMiddleware } from "../middleware/upload.middleware";

/**
 * Configure routes for resume upload and processing.
 *
 * @returns Express router instance for upload routes.
 */
function create_upload_routes(): Router {
    const router = Router();

    /**
     * Handle resume upload and text extraction.
     * Endpoint: POST /api/upload/resume
     */
    router.post(
        "/resume",
        uploadResumeMiddleware.single("resume"),
        UploadController.upload_resume
    );

    return router;
}

export default create_upload_routes();
