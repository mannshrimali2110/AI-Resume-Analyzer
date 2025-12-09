import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MIN) || 1;
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 5;

export const aiRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  keyGenerator: (req: Request) => {
    // req.ip can be undefined in typings → fallback to empty string
    return ipKeyGenerator(req.ip || "");
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      code: 429,
      message: "Rate limit exceeded. Please wait and try again.",
    });
  },
});

// Polling endpoint uses a higher rate limit to allow frequent status checks.
export const jobPollRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  // allow up to 120 polls per window (e.g., every 0.5s for 1 minute) by default
  max: Number(process.env.RATE_LIMIT_POLL_MAX) || 120,
  keyGenerator: (req: Request) => ipKeyGenerator(req.ip || ""),
  handler: (req: Request, res: Response) => {
    res.status(429).json({ success: false, code: 429, message: "Polling rate limit exceeded." });
  },
});
