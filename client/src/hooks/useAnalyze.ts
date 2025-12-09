import { useMutation } from "@tanstack/react-query";

import api from "../lib/api";
import { AnalyzeSchema } from "../lib/schema";
import { Analysis } from "../types/analysis";

/**
 * Hook for analyzing resume against job description.
 *
 * @returns React Query mutation for analysis.
 */
export function useAnalyze() {
  return useMutation<
    Analysis,
    Error,
    { resumeText: string; jdText: string; options?: unknown }
  >(async (request_body) => {
    // Validate request payload
    AnalyzeSchema.parse(request_body);

    // Send analysis request
    const response = await api.post("/ai-analyze", request_body);

    if (!response.data || response.data.success !== true) {
      throw new Error(response.data?.message || "Resume analysis failed.");
    }

    return response.data as Analysis;
  });
}
