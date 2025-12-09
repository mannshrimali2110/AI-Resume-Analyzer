import { Router } from "express";

import { AnalyzeController } from "../controllers/analyze.controller";
import { aiRateLimiter } from "../middleware/rateLimit.middleware";

/**
 * Configure routes for resume analysis.
 *
 * @returns Express router instance for analyze routes.
 */
function create_analyze_routes(): Router {
    const router = Router();

    /**
     * Handle resume analysis using AI.
     * Endpoint: POST /api/analyze
     */
    router.post(
        "/",
        aiRateLimiter,
        AnalyzeController.analyze_resume
    );

    return router;
}

export default create_analyze_routes();
