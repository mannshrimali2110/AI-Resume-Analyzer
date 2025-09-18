// src/routes/analyze.ts
import { Router } from "express";
import { aiRateLimiter } from "../middleware/rateLimit.middleware";
import { analyzeResume } from "../controllers/analyze.controller";

const router = Router();

router.post("/", aiRateLimiter, analyzeResume);

export default router;
