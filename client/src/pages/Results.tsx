// src/pages/Results.tsx
import React, { useEffect } from "react";
import MatchGauge from "../components/MatchGauge";
import KeywordsList from "../components/KeywordsList";
import SectionTabs from "../components/SectionTabs";
import SuggestionsList from "../components/SuggestionsList";
import CopyBlock from "../components/CopyBlock";
import RateLimitNotice from "../components/RateLimitNotice";
import { useAnalysisResult } from "../hooks/useAnalysisResult";
import { motion } from "framer-motion";
import Lenis from "lenis";

const Results: React.FC = () => {
  const { result } = useAnalysisResult();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--danger)] text-lg font-semibold">
        No analysis result found.
      </div>
    );
  }

  const keywordCoverage = result.keywordCoverage || {};
  const foundKeywords = Object.entries(keywordCoverage)
    .filter(([_, v]) => v?.present)
    .map(([term]) => term);

  const formattedSuggestions = (result.improvementSuggestions || []).map(
    (s: any) => ({ action: typeof s === "string" ? s : s.action, example: s.example || "", impact: s.impact || ("med" as const) })
  );

  return (
    <div className="container-page py-10 md:py-12">
      <div className="mb-8">
        <div className="kicker">Results</div>
        <h2 className="h2 mt-2">Analysis Summary</h2>
        <p className="subtle mt-2">Your AI-powered feedback is organized into clear sections below.</p>
      </div>

      {/* Top summary cards to improve scannability */}
      <div className="mb-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel flex flex-col items-center justify-center p-4 shadow-lg ring-1 ring-white/6">
          <div className="text-sm subtle">Overall Match</div>
          <div className="mt-2 text-3xl font-semibold">{result.matchScore ?? 0}%</div>
        </div>
        <div className="panel flex flex-col items-center justify-center p-4 shadow-lg ring-1 ring-white/6">
          <div className="text-sm subtle">Missing Keywords</div>
          <div className="mt-2 text-2xl font-semibold">{(result.missingKeywords || []).length}</div>
        </div>
        <div className="panel flex flex-col items-center justify-center p-4 shadow-lg ring-1 ring-white/6">
          <div className="text-sm subtle">Suggestions</div>
          <div className="mt-2 text-2xl font-semibold">{(result.improvementSuggestions || []).length}</div>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-6 mx-auto">
        {/* Match Score */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}
        >
          <div className="h3 mb-2 flex items-center gap-3">
            Overall Match Score
            <span className="chip">AI</span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="sm:col-span-1 flex items-center justify-center">
              <div className="relative">
                {/* Accent ring glow */}
                <div className="absolute inset-0 blur-2xl opacity-60 -z-10"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,.18), transparent 60%)" }}
                />
                <MatchGauge score={result.matchScore || 0} />
              </div>
            </div>
            <div className="sm:col-span-2 subtle">
              <p>
                This score reflects the overlap between your resume and the job description, including skills,
                experience signals, and terminology matches.
              </p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="chip">Keywords</span>
                <span className="chip">Experience</span>
                <span className="chip">Certifications</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Keywords */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .03 }}
        >
          <div className="h3 mb-2">Keyword Analysis</div>
          <KeywordsList
            missingKeywords={(result.missingKeywords || []).map((m: any) => (typeof m === "string" ? m : m.term))}
            foundKeywords={foundKeywords}
          />
        </motion.div>

        {/* Section Feedback */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .06 }}
        >
          <div className="h3 mb-2">Section Feedback</div>
          <SectionTabs feedback={result.sectionFeedback || {}} />
        </motion.div>

        {/* Suggestions */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .09 }}
        >
          <div className="h3 mb-2">Improvement Suggestions</div>
          <SuggestionsList suggestions={formattedSuggestions} />
        </motion.div>

        {/* JSON Copy */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: .12 }}
        >
          <div className="h3 mb-2">Full JSON Report</div>
          <CopyBlock markdownReport={JSON.stringify(result, null, 2)} />
        </motion.div>

        <RateLimitNotice show={false} />
      </div>
    </div>
  );
};

export default Results;
