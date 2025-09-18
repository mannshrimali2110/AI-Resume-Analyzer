
Project: AI‑Powered Resume Tailoring & Feedback AssistantStack: MERN (React + Tailwind, Node + Express) + Gemini AITheme: Modern, sleek, dark UI using palette: #16213E, #0F3460, #533483, #E94560Goal: Produce a production‑ready MVP that matches the PRD and runs locally & on Render/Railway/Vercel with minimal setup.

0) What to Deliver (High Level)

Full codebase with clear file structure and complete source files for both client and server.

MVP features exactly as in PRD: paste/upload resume (PDF/DOCX), paste JD, analyze via Gemini, show match score, missing keywords/skills, section‑wise feedback, improvement suggestions, copy‑to‑clipboard, rate limiting.

Non‑functional: performance target 5–7s, temp file handling + auto‑delete, secure config, CORS/HTTPS ready.

Docs: README.md with setup, environment variables, run & deploy steps; .env.example.

Tests: basic backend unit/integration tests (parsing + AI route) and minimal frontend tests.

Postman/Thunder collection and example payloads.

Important: Do not omit files. Print each file with a heading // filepath then the file contents in a code block. Keep secrets in .env only.

1) Functional Requirements (Implement Exactly)

Inputs:

Resume: textarea paste OR file upload (PDF/DOCX).

Job Description: textarea paste.

Optional (not used in MVP logic yet): LinkedIn job link (text field, stored in state only).

Parsing & Preprocessing:

Use pdf-parse for PDF, mammoth for DOCX.

Sanitize/normalize text: remove non‑printables, excessive whitespace, headers/footers when obvious, keep sections if present (Experience, Skills, Education, Certifications).

AI Analysis (Gemini):

Send resumeText + jdText to Gemini using a structured prompt to return strict JSON (schema provided below).

Compute Match Percentage, Missing Skills/Keywords, Section‑wise Feedback, Improvement Suggestions.

Output UI:

Prominent Match Score (%) (radial progress).

Lists of Missing Keywords/Skills (chips with copy‑all).

Section tabs: Experience, Skills, Education, Certifications.

Improvement Tips as bullet list with actionability.

Copy feedback to clipboard button (copies all as formatted Markdown).

Rate Limiting & Abuse Prevention:

Max 5 requests/minute per IP on /api/ai-analyze.

Randomized small delay (100–300ms jitter) to avoid burst profile.

(Placeholder) reCAPTCHA stub on frontend (disabled by env flag).

2) Non‑Functional & Acceptance Criteria

Performance: Typical request ≤ 7 seconds end‑to‑end for ~2–4 page resumes.

Security:

Use helmet, strict CORS, size limits, MIME/type checks for uploads, delete temp files after parse or after request completes.

Never log PII (resume/JD text).

Sanitize user input.

Reliability: Graceful error states; if Gemini fails, return a friendly message with retry CTA.

Compliance: Process only user‑provided content; no scraping.

Uptime posture: Health check route /api/health.

3) Tech & Versions

Node.js: 20.x LTS

Express: 4.x

Frontend: React 18+ with Vite, Tailwind CSS

Upload: multer

Parse: pdf-parse, mammoth

AI: Gemini via Axios HTTP client (wrap in service).

Validation: zod (frontend + backend)

State/Data: React Query (TanStack Query) for async flows

Testing: Jest + Supertest (API), Vitest + Testing Library (UI)

Lint/Format: ESLint + Prettier

Logging: morgan (dev) and light structured logs for prod

4) Project Structure (Monorepo style)

root/
  package.json            # workspace scripts using concurrently
  README.md
  .env.example
  /client                 # React + Vite + Tailwind
    index.html
    vite.config.ts
    package.json
    postcss.config.js
    tailwind.config.js
    src/
      main.tsx
      App.tsx
      lib/
        api.ts           # axios instance
        theme.ts         # theme constants
        schema.ts        # zod schemas
        clipboard.ts
      components/
        FileDrop.tsx
        TextArea.tsx
        MatchGauge.tsx
        KeywordsList.tsx
        SectionTabs.tsx
        SuggestionsList.tsx
        CopyBlock.tsx
        ErrorBanner.tsx
        LoadingOverlay.tsx
        RateLimitNotice.tsx
      pages/
        Home.tsx
        Analyzer.tsx
        Results.tsx
      styles/index.css
      hooks/useAnalyze.ts
      types/analysis.ts
      tests/*
  /server
    package.json
    src/
      index.ts
      routes/
        health.ts
        upload.ts
        analyze.ts
      middleware/
        rateLimit.ts
        errors.ts
        uploads.ts
      services/
        parsePdf.ts
        parseDocx.ts
        cleanText.ts
        gemini.ts
      schemas/
        analyze.schema.ts
      utils/
        logger.ts
        asyncHandler.ts
    tests/*
  /collections
    AI-Analyzer.postman_collection.json

5) Environment Variables & Config

Create .env.example with:

# Server
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_UPLOAD_MB=4
TEMP_DIR=./tmp
RATE_LIMIT_WINDOW_MIN=1
RATE_LIMIT_MAX=5
ENABLE_RECAPTCHA=false

# Gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash   # or suitable model
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models

Rules:

Never commit .env.

Read MAX_UPLOAD_MB for multer/file size limits.

Delete temp files after parsing (even on error) using finally.

6) Backend — Detailed Requirements

6.1 Express Setup

Middlewares: helmet, cors (origin from env), express.json({ limit: '1mb' }), morgan in dev.

Global error handler with consistent JSON errors: { success:false, code, message, details? }.

Health route: GET /api/health → { status:'ok', uptime }.

6.2 File Uploads

multer disk storage to TEMP_DIR with UUID filenames; whitelist .pdf and .docx by MIME and extension; max size from env.

Routes:

POST /api/upload-resume — accepts single resume (PDF). Parses text via pdf-parse.

POST /api/upload-resume-docx — accepts single resume (DOCX). Parses via mammoth (extractRawText: true).

Response (both):

{
  "success": true,
  "text": "<plain text>",
  "meta": { "fileName": "cv.pdf", "sizeKB": 321, "pages": 2, "type": "pdf|docx" }
}

Always remove uploaded file after parse completes.

6.3 Text Cleaning

cleanText.ts normalizes whitespace, removes non‑ASCII control chars, flattens bullets, preserves section headings when clear.

6.4 AI Analysis Route

POST /api/ai-analyze body schema:

{
  "resumeText": "string (min 200 chars)",
  "jdText": "string (min 100 chars)",
  "options"?: { "maxSuggestions"?: number, "tone"?: "concise"|"detailed" }
}

Rate limit: 5/min/IP. Add 100–300ms jitter before calling AI.

Call services/gemini.ts with the prompt template below.

Return exact JSON from AI plus computed fallback fields if missing.

Error behavior: if AI fails, return 502 with {success:false, message:"AI service unavailable. Please retry."}.

6.5 Gemini Service

Implement analyzeResume(resumeText, jdText, opts) using Axios:

Construct prompt (section 8) asking for strict JSON only.

Validate response JSON against zod schema; if invalid, attempt a single automatic retry with a repair instruction.

7) Frontend — Detailed Requirements

Vite + React + TypeScript + Tailwind.

Theme: configure Tailwind with custom colors:

primary: #16213E, secondary: #0F3460, accent: #533483, danger: #E94560.

Use text-slate-200 for body text, text-slate-400 for secondary.

Pages:

Home: headline, short explainer, CTA → Analyzer.

Analyzer: two columns (Resume, JD). Resume supports paste and upload (tabs). JD is textarea. Analyze button.

Results: shows MatchGauge, KeywordsList, SectionTabs, SuggestionsList, and CopyBlock. Include RateLimitNotice when 429.

Components:

FileDrop: drag‑and‑drop + click to upload, file type validation, progress, error states.

TextArea: with char count, validation messages.

MatchGauge: SVG circular progress (animated) with large % value.

KeywordsList: chips with checkmarks for found vs. missing; “Copy All” button.

SectionTabs: tabs for Experience/Skills/Education/Certifications.

SuggestionsList: list with action, example, impact; filter by priority.

CopyBlock: copies a formatted Markdown report.

LoadingOverlay & ErrorBanner for network/AI errors; skeletons while waiting.

State & Data:

Use React Query mutations for /api/ai-analyze with retries=1; show exponential backoff.

Basic client‑side zod validation before submit (min lengths).

Accessibility: semantic elements, keyboard navigation, visible focus states.

8) AI JSON Schema & Prompt Template (Use Exactly)

8.1 Zod/TypeScript Types

export type Analysis = {
  matchScore: number; // 0..100
  missingKeywords: { term: string; importance: 1|2|3; reason?: string }[];
  sectionFeedback: {
    experience: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    skills: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    education: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
    certifications: { summary: string; items: { issue: string; fix: string; priority: 'low'|'med'|'high' }[] };
  };
  improvementSuggestions: { action: string; example: string; impact: 'low'|'med'|'high' }[];
  keywordCoverage: { [term: string]: { present: boolean; occurrences: number } };
  atsHints: string[];
};

8.2 Gemini Prompt (system/content)

I will provide you with two text inputs:

1. **Resume Text**: <<RESUME_TEXT>>
2. **Job Description (JD) Text**: <<JD_TEXT>>

Your task is to analyze how well the resume aligns with the job description and return a structured JSON response with the following fields:

{
  "match_score": "A percentage number (0-100) representing how well the resume matches the JD.",
  "missing_keywords": ["List of important skills, tools, or keywords mentioned in the JD but missing in the resume."],
  "section_feedback": {
    "experience": "Feedback on how relevant the candidate’s work experience is compared to the JD.",
    "skills": "Feedback on candidate’s skills section in relation to the JD requirements.",
    "education": "Feedback on educational qualifications vs JD expectations.",
    "certifications": "Feedback on certifications vs JD expectations."
  },
  "improvement_suggestions": [
    "Actionable, concise recommendations to improve the resume (e.g., 'Add experience with React Hooks', 'Emphasize leadership in project X')."
  ],
  "ats_friendly_tips": [
    "Tips for improving ATS compatibility such as formatting, keyword density, or avoiding images/tables."
  ]
}

Guidelines:
- Keep responses concise and bullet-pointed.
- Use simple language suitable for job seekers.
- Do not rewrite the resume; only provide analysis and feedback.
- Ensure JSON is properly formatted and parsable.
