import axios from "axios";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Allow overriding the api base and model via env. Defaults chosen to match common Google GenAI endpoints.
const ENV_GEMINI_API_URL = process.env.GEMINI_API_URL;
const ENV_GEMINI_MODEL = process.env.GEMINI_MODEL;

const DEFAULT_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.5-flash";

// The RPC method to call on the model resource. Different SDKs/examples have used
// generateText, generateMessage, generateContent, etc. Make this configurable to
// avoid 404s if the wrong RPC name is used. Default to `generateText` which is
// commonly supported.
const ENV_GEMINI_METHOD = process.env.GEMINI_METHOD;
const DEFAULT_METHOD = "generateText";
const GEMINI_METHOD = ENV_GEMINI_METHOD || DEFAULT_METHOD;

const GEMINI_API_URL = ENV_GEMINI_API_URL || DEFAULT_API_URL;
const GEMINI_MODEL = ENV_GEMINI_MODEL || DEFAULT_MODEL;

// Helper: POST with retries for transient errors (429 / rate limits, network blips)
async function postWithRetries(url: string, payload: any, opts: any = {}) {
  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      if (attempt > 1) console.debug(`➡️ Retry attempt ${attempt} for ${url}`);
      return await axios.post(url, payload, opts);
    } catch (err: any) {
      const status = err?.response?.status;
      const headers = err?.response?.headers || {};

      // If rate-limited (429), honor Retry-After header if present and retry
      if (status === 429 && attempt < maxAttempts) {
        const ra = headers['retry-after'] || headers['Retry-After'];
        let waitSec = 2 ** (attempt - 1); // 1,2,4
        if (ra) {
          const parsed = parseFloat(ra as string);
          if (!Number.isNaN(parsed)) waitSec = parsed;
        }
        console.warn(`⚠️ Received 429, retrying in ${waitSec}s (attempt ${attempt}/${maxAttempts})`);
        await new Promise((r) => setTimeout(r, Math.max(500, waitSec * 1000)));
        continue;
      }

      // For network errors without response, retry once
      if (!err?.response && attempt < maxAttempts) {
        const waitMs = 500 * attempt;
        console.warn(`⚠️ Network error, retrying in ${waitMs}ms (attempt ${attempt}/${maxAttempts})`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      // Otherwise rethrow the original error
      throw err;
    }
  }

  // If loop exits unexpectedly, throw
  throw new Error('Failed to POST after retries');
}

// ✅ Schema definition for validation
const AnalysisSchema = z.object({
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

export async function analyzeResumeGemini(
  resumeText: string,
  jdText: string,
  options?: any
) {
  if (!GEMINI_API_KEY) {
    throw new Error("❌ Missing GEMINI_API_KEY in .env");
  }

  // ✅ Stronger prompt enforcing strict JSON
  const prompt = `
I will provide you with two text inputs:

1. Resume Text: ${resumeText}
2. Job Description (JD) Text: ${jdText}

Your task is to analyze how well the resume aligns with the job description.

STRICT REQUIREMENT:
- Return **only valid JSON**
- Use double quotes around ALL keys and string values
- Do NOT include comments, explanations, markdown, or extra text
- Do NOT return JavaScript object syntax (keys must be quoted)

The JSON must strictly follow this schema:

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
    // Build URL carefully so we don't end up with duplicate `/models` segments.
    const base = GEMINI_API_URL.replace(/\/+$/, "");
    let modelPath = GEMINI_MODEL;

    // If model is like "models/gemini-1.5-flash" keep it. If it's just the model name, prefix with "models/" unless base already ends with "/models".
    if (!modelPath.startsWith("models/")) {
      if (!base.endsWith("/models")) {
        modelPath = `models/${modelPath}`;
      }
    } else {
      // modelPath already contains "models/"; if base ends with "/models" avoid duplicating
      if (base.endsWith("/models")) {
        modelPath = modelPath.replace(/^models\//, "");
      }
    }

    const url = `${base}/${modelPath}:${GEMINI_METHOD}?key=${GEMINI_API_KEY}`;
  // Avoid printing the API key in logs. Mask the key when logging.
  const safeUrl = url.replace(/([?&]key=)[^&]+/, "$1***");
  console.debug("➡️ Calling Gemini URL:", safeUrl);

    // Build request payload depending on the RPC method — different RPCs expect
    // different JSON shapes. This prevents INVALID_ARGUMENT errors like
    // "Unknown name 'contents'".
    let payload: any;
    const trimmedPrompt = prompt.length > 200 ? prompt.slice(0, 200) + "..." : prompt;

    switch (GEMINI_METHOD) {
      case "generateText":
        // Common REST shape for `generateText` on Google Generative Language
        // API: { prompt: { text: "..." }, ... }
        payload = { prompt: { text: prompt } };
        break;
      case "generateMessage":
        // Message-style multi-turn APIs
        payload = {
          messages: [
            { author: "user", content: [{ type: "text", text: prompt }] },
          ],
        };
        break;
      case "generateContent":
      default:
        // Legacy / other shapes that some examples use
        payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        break;
    }

    // Debug the outgoing request body but avoid printing the full prompt+key.
    try {
      const debugPayload = JSON.parse(JSON.stringify(payload));
      // mask long text fields
      if (debugPayload?.prompt?.text) debugPayload.prompt.text = trimmedPrompt;
      if (debugPayload?.messages?.[0]?.content?.[0]?.text)
        debugPayload.messages[0].content[0].text = trimmedPrompt;
      if (debugPayload?.contents?.[0]?.parts?.[0]?.text)
        debugPayload.contents[0].parts[0].text = trimmedPrompt;
      console.debug("➡️ Gemini request payload:", debugPayload);
    } catch (e) {
      /* noop */
    }

  // Use a longer timeout for model calls — some models or network conditions
  // can take longer than 20s. 2 minutes gives room for heavier workloads.
  const response = await postWithRetries(url, payload, { timeout: 120000 });

    // The GenAI responses can vary depending on endpoint/version. Try multiple
    // common locations to find generated text.
    const res = response.data;
    let aiText: string | undefined;

    // common older pattern
    aiText = res?.candidates?.[0]?.content?.parts?.[0]?.text;
    // some endpoints return `output[].content[].text`
    if (!aiText) aiText = res?.output?.[0]?.content?.[0]?.text;
    // some return `candidates[0].output_text` or `text`
    if (!aiText) aiText = res?.candidates?.[0]?.output_text || res?.text || res?.output_text;
    // fallback: if response has a top-level string
    if (!aiText && typeof res === "string") aiText = res as string;
    if (!aiText) {
      console.error("❌ Gemini response body (no text found):", JSON.stringify(res, null, 2));
      throw { code: "AI_ERROR", message: "No text found in AI response." };
    }

    // 🧹 Clean up formatting issues (strip markdown fences)
    aiText = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any;

    // ✅ First try strict JSON.parse
    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.warn("⚠️ JSON.parse failed, attempting auto-fix...");

      // ✅ Option 2: Auto-fix missing quotes around keys
      const fixed = aiText.replace(
        /([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,
        '$1"$2":'
      );

      try {
        parsed = JSON.parse(fixed);
      } catch (err2) {
        console.error("❌ Still failed to parse AI response:", aiText);
        throw { code: "AI_ERROR", message: "AI returned invalid JSON." };
      }
    }

    // ✅ Validate against schema
    const analysis = AnalysisSchema.safeParse(parsed);
    if (!analysis.success) {
      console.error("❌ Gemini returned invalid response:", parsed);
      throw { code: "AI_ERROR", message: "Invalid AI response format." };
    }

    return analysis.data;
  } catch (err: any) {
    // Provide richer logs for diagnostics
    if (err?.response) {
      console.error("❌ Gemini call failed - response:", {
        status: err.response.status,
        data: err.response.data,
      });
    } else {
      console.error("❌ Gemini call failed:", err.message || err);
    }

    // Re-throw a structured error for callers, but include original message and headers for troubleshooting locally.
    throw {
      code: "AI_ERROR",
      message: "AI service unavailable. Please retry.",
      details: err?.response
        ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
            message: err.message,
          }
        : err?.message || err,
    };
  }
}
