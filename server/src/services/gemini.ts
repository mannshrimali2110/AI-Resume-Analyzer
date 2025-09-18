import axios from "axios";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "models/gemini-1.5-flash";

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
    const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { timeout: 20000 }
    );

    let aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
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
    console.error("❌ Gemini call failed:", err.message || err);
    throw { code: "AI_ERROR", message: "AI service unavailable. Please retry." };
  }
}
