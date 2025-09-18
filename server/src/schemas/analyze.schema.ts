import { z } from 'zod';

export const AnalysisSchema = z.object({
  matchScore: z.number().min(0).max(100),
  missingKeywords: z.array(z.object({
    term: z.string(),
    importance: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    reason: z.string().optional(),
  })),
  sectionFeedback: z.object({
    experience: z.object({
      summary: z.string(),
      items: z.array(z.object({
        issue: z.string(),
        fix: z.string(),
        priority: z.enum(['low', 'med', 'high']),
      })),
    }),
    skills: z.object({
      summary: z.string(),
      items: z.array(z.object({
        issue: z.string(),
        fix: z.string(),
        priority: z.enum(['low', 'med', 'high']),
      })),
    }),
    education: z.object({
      summary: z.string(),
      items: z.array(z.object({
        issue: z.string(),
        fix: z.string(),
        priority: z.enum(['low', 'med', 'high']),
      })),
    }),
    certifications: z.object({
      summary: z.string(),
      items: z.array(z.object({
        issue: z.string(),
        fix: z.string(),
        priority: z.enum(['low', 'med', 'high']),
      })),
    }),
  }),
  improvementSuggestions: z.array(z.object({
    action: z.string(),
    example: z.string(),
    impact: z.enum(['low', 'med', 'high']),
  })),
  keywordCoverage: z.record(z.object({
    present: z.boolean(),
    occurrences: z.number(),
  })),
  atsHints: z.array(z.string()),
});
