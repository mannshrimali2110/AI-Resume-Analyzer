// src/routes/analyze.ts
import { Router } from "express";
import { aiRateLimiter, jobPollRateLimiter } from "../middleware/rateLimit.middleware";
import { createAnalyzeJob, getAnalyzeJob, analyzeResume } from "../controllers/analyze.controller";

const router = Router();

// Create an asynchronous job for analysis

// Create job (rate limited)
router.post("/", aiRateLimiter, createAnalyzeJob);
// Poll job status/result (higher limit for polling)
router.get("/:id", jobPollRateLimiter, getAnalyzeJob);

// Legacy synchronous endpoint (kept but not used by default)
router.post("/sync", aiRateLimiter, analyzeResume);

export default router;
