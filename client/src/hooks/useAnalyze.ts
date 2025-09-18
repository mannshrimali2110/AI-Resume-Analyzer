import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { AnalyzeSchema } from "../lib/schema";
import { Analysis } from "../types/analysis";

// Mutation hook for analyzing resume vs JD
export function useAnalyze() {
  return useMutation<
    Analysis, // ✅ successful response type
    Error,    // ❌ error type
    { resumeText: string; jdText: string; options?: any } // 🔑 variables
  >(
    async (body) => {
      // Validate request body against Zod schema
      AnalyzeSchema.parse(body);

      // Call backend
      const res = await api.post("/ai-analyze", body);

      if (!res.data.success) {
        throw new Error(res.data.message || "Analysis failed");
      }

      return res.data as Analysis;
    },
    {
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    }
  );
}
