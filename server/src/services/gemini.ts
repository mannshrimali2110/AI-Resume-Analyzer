import axios, { AxiosRequestConfig } from "axios";
import { z } from "zod";


/**
 * Get environment configuration for Gemini API at runtime.
 */
function getGeminiConfig() {
  const gemini_api_key = process.env.GEMINI_API_KEY;
  const env_gemini_api_url = process.env.GEMINI_API_URL;
  const env_gemini_model = process.env.GEMINI_MODEL;
  const gemini_method = "generateContent";

  const default_api_url = "https://generativelanguage.googleapis.com/v1beta";
  const default_model = "gemini-2.5-flash";

  return {
    gemini_api_key,
    gemini_api_url: env_gemini_api_url || default_api_url,
    gemini_model: env_gemini_model || default_model,
    gemini_method,
  };
}

/**
 * Schema definition for AI response validation.
 */
const analysis_schema = z.object({
  matchScore: z.number(),
  missingKeywords: z.array(z.string()),
  sectionFeedback: z.object({
    experience: z.string(),
    skills: z.string(),
    education: z.string(),
    certifications: z.string(),
  }),
  improvementSuggestions: z.array(z.string()),
  atsHints: z.array(z.string()),
});

/**
 * Perform HTTP POST with retry support for transient errors.
 *
 * @param url - API endpoint URL.
 * @param payload - Request payload body.
 * @param options - Optional axios configuration.
 * @returns Axios response object.
 * @throws Error if all retry attempts fail.
 */
async function post_with_retries(url: string, payload: unknown, options: AxiosRequestConfig<unknown> = {}): Promise<any> {
  const max_attempts = 3;
  let attempt = 0;

  while (attempt < max_attempts) {
    attempt += 1;

    try {
      return await axios.post(url, payload, options);
    } catch (error: any) {
      const status_code = error?.response?.status;
      const headers = error?.response?.headers || {};

      if (status_code === 429 && attempt < max_attempts) {
        const retry_after = headers["retry-after"] || headers["Retry-After"];
        let wait_seconds = 2 ** (attempt - 1);

        if (retry_after) {
          const parsed = parseFloat(retry_after);
          if (!Number.isNaN(parsed)) {
            wait_seconds = parsed;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, Math.max(500, wait_seconds * 1000)));
        continue;
      }

      if (!error?.response && attempt < max_attempts) {
        const wait_ms = 500 * attempt;
        await new Promise((resolve) => setTimeout(resolve, wait_ms));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to POST request after multiple retry attempts.");
}

/**
 * Analyze resume text against job description using Gemini AI.
 *
 * @param resume_text - Cleaned resume text.
 * @param job_description_text - Job description text.
 * @param options - Optional AI configuration.
 * @returns Structured AI analysis result.
 * @throws Error if AI service fails or returns invalid data.
 */
export async function analyze_resume_gemini(
  resume_text: string,
  job_description_text: string,
  options?: unknown
): Promise<Record<string, unknown>> {
  const config = getGeminiConfig();
  
  if (!config.gemini_api_key) {
    throw new Error("Missing GEMINI_API_KEY in environment configuration.");
  }

  const prompt = `
I will provide you with two text inputs:

1. Resume Text: ${resume_text}
2. Job Description (JD) Text: ${job_description_text}

Your task is to analyze how well the resume aligns with the job description.

STRICT REQUIREMENT:
- Return only valid JSON
- Use double quotes around all keys and string values
- Do not include comments, explanations, markdown, or extra text

The JSON must follow this schema:

{
  matchScore: number;
  missingKeywords: string[];
  sectionFeedback: {
    experience: string;
    skills: string;
    education: string;
    certifications: string;
  };
  improvementSuggestions: string[];
  atsHints: string[];
}
`;

  try {
    const base_url = config.gemini_api_url.replace(/\/+$/, "");
    let model_path = config.gemini_model;

    if (!model_path.startsWith("models/")) {
      if (!base_url.endsWith("/models")) {
        model_path = `models/${model_path}`;
      }
    } else if (base_url.endsWith("/models")) {
      model_path = model_path.replace(/^models\//, "");
    }

    const request_url = `${base_url}/${model_path}:${config.gemini_method}?key=${config.gemini_api_key}`;

    let request_payload: any;

    // Use generateContent format (standard Gemini API)
    request_payload = { 
      contents: [{ 
        role: "user", 
        parts: [{ text: prompt }] 
      }]
    };

    const response = await post_with_retries(request_url, request_payload, { timeout: 120000 });

    const response_data = response.data;
    let ai_text: string | undefined;

    ai_text = response_data?.candidates?.[0]?.content?.parts?.[0]?.text
      || response_data?.output?.[0]?.content?.[0]?.text
      || response_data?.candidates?.[0]?.output_text
      || response_data?.text
      || response_data?.output_text;

    if (!ai_text && typeof response_data === "string") {
      ai_text = response_data;
    }

    if (!ai_text) {
      throw { code: "AI_ERROR", message: "No text found in AI response." };
    }

    ai_text = ai_text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed_json: unknown;

    try {
      parsed_json = JSON.parse(ai_text);
    } catch {
      const fixed_json = ai_text.replace(
        /([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,
        '$1"$2":'
      );

      try {
        parsed_json = JSON.parse(fixed_json);
      } catch {
        throw { code: "AI_ERROR", message: "AI returned invalid JSON." };
      }
    }

    const validation_result = analysis_schema.safeParse(parsed_json);

    if (!validation_result.success) {
      throw { code: "AI_ERROR", message: "Invalid AI response format." };
    }

    return validation_result.data;
  } catch (error: any) {
    throw {
      code: "AI_ERROR",
      message: "AI service unavailable. Please retry.",
      details: error?.message || error,
    };
  }
}
