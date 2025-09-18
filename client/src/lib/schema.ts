import { z } from 'zod';

export const AnalyzeSchema = z.object({
  resumeText: z.string().min(200),
  jdText: z.string().min(100),
  options: z.object({
    maxSuggestions: z.number().optional(),
    tone: z.enum(['concise', 'detailed']).optional(),
  }).optional(),
});
