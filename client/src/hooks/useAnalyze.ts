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

      // Create job on backend
      const createRes = await api.post("/ai-analyze", body);
      if (!createRes.data?.success || !createRes.data.jobId) {
        throw new Error(createRes.data?.message || "Failed to create analysis job");
      }

      const jobId = createRes.data.jobId as string;

      // Poll for job completion
      const maxPollMs = 120000; // 2 minutes
      let pollInterval = 2000; // 2s
      const start = Date.now();

      while (Date.now() - start < maxPollMs) {
        try {
          const statusRes = await api.get(`/ai-analyze/${jobId}`);

          if (!statusRes.data?.success) {
            // job may be error with structured payload
            if (statusRes.status === 502 || statusRes.data.status === "error") {
              const err = statusRes.data.error || statusRes.data.message || "Analysis failed";
              throw new Error(typeof err === "string" ? err : JSON.stringify(err));
            }
          }

          if (statusRes.data.status === "done") {
            return statusRes.data.result as Analysis;
          }

          // still pending — reset poll interval to default
          pollInterval = 2000;
        } catch (err: any) {
          // Handle axios errors (e.g., 429) gracefully with backoff
          const status = err?.response?.status;
          const headers = err?.response?.headers || {};
          if (status === 429) {
            // Honor Retry-After header if present
            const ra = headers["retry-after"] || headers["Retry-After"];
            let waitMs = pollInterval * 2; // exponential backoff
            if (ra) {
              const parsed = parseFloat(ra);
              if (!Number.isNaN(parsed)) waitMs = Math.max(waitMs, parsed * 1000);
            }
            // increase pollInterval so we don't hammer the server
            pollInterval = Math.min(30000, pollInterval * 2);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }

          // Other errors: rethrow so mutation can surface them
          throw err;
        }

        // still pending
        await new Promise((r) => setTimeout(r, pollInterval));
      }

      throw new Error("Analysis timed out (polling)");
    },
    {
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    }
  );
}
