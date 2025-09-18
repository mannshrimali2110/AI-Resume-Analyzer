// src/routes/analyze.ts
import { Router } from 'express';
import { aiRateLimiter } from '../middleware/rateLimit';
import { analyzeResumeGemini } from '../services/gemini';
import { z } from 'zod';

const router = Router();

const AnalyzeSchema = z.object({
  resumeText: z.string().min(200),
  jdText: z.string().min(100),
  options: z.object({
    maxSuggestions: z.number().optional(),
    tone: z.enum(['concise', 'detailed']).optional(),
  }).optional(),
});

router.post('/', aiRateLimiter, async (req, res, next) => {
  console.log('Analyze request received');
  await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
  try {
    const body = AnalyzeSchema.parse(req.body);
    const result = await analyzeResumeGemini(body.resumeText, body.jdText, body.options);
    res.json({ success: true, ...result });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Invalid input.', details: err.errors });
    }
    if (err.code === 'AI_ERROR') {
      return res.status(502).json({ success: false, message: 'AI service unavailable. Please retry.' });
    }
    next(err);
  }
});

export default router;
