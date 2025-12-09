// src/controllers/analyze.controller.ts
import { Request, Response, NextFunction } from "express";
import { analyzeResumeGemini } from "../services/gemini";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Simple in-memory job store. For production use a persistent queue/store.
type JobState =
    | { status: "pending" }
    | { status: "done"; result: any }
    | { status: "error"; error: any };

const jobs = new Map<string, JobState>();

const AnalyzeSchema = z.object({
    resumeText: z.string().min(200),
    jdText: z.string().min(100),
    options: z
        .object({
            maxSuggestions: z.number().optional(),
            tone: z.enum(["concise", "detailed"]).optional(),
        })
        .optional(),
});

// Create job: returns 202 with jobId and processes AI call in background.
export const createAnalyzeJob = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Create analyze job request received");

    try {
        const body = AnalyzeSchema.parse(req.body);
        const jobId = uuidv4();
        jobs.set(jobId, { status: "pending" });

        // Process in background
        (async () => {
            try {
                const result = await analyzeResumeGemini(body.resumeText, body.jdText, body.options);
                jobs.set(jobId, { status: "done", result });
            } catch (err: any) {
                console.error("Job processing error:", err?.message || err, err?.details || "");
                // capture structured error information
                const payload = {
                    message: err?.message || "AI service unavailable",
                    details: err?.details || undefined,
                };
                jobs.set(jobId, { status: "error", error: payload });
            }
        })();

        return res.status(202).json({ success: true, jobId });
    } catch (err: any) {
        if (err.name === "ZodError") {
            return res.status(400).json({ success: false, message: "Invalid input.", details: err.errors });
        }
        next(err);
    }
};

// Get job status/result
export const getAnalyzeJob = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, message: "Missing job id" });

    const job = jobs.get(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.status === "pending") return res.json({ success: true, status: "pending" });
    if (job.status === "done") return res.json({ success: true, status: "done", result: job.result });
    return res.status(502).json({ success: false, status: "error", error: job.error });
};

// Backwards-compatible synchronous analyze (kept for tests / direct calls)
export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Analyze request received (sync)");
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));

    try {
        const body = AnalyzeSchema.parse(req.body);
        const result = await analyzeResumeGemini(body.resumeText, body.jdText, body.options);
        res.json({ success: true, ...result });
    } catch (err: any) {
        if (err.name === "ZodError") {
            return res.status(400).json({ success: false, message: "Invalid input.", details: err.errors });
        }
        if (err.code === "AI_ERROR") {
            return res.status(502).json({ success: false, message: "AI service unavailable. Please retry.", details: err.details });
        }
        next(err);
    }
};
