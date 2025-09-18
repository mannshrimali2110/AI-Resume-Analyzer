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
