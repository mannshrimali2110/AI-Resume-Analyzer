// src/pages/Analyzer.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisResult } from "../hooks/useAnalysisResult";
import { useAnalyze } from "../hooks/useAnalyze";
import { motion } from "framer-motion";
import Lenis from "lenis";

import FileDrop from "../components/FileDrop";
import TextArea from "../components/TextArea";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorBanner from "../components/ErrorBanner";

const Analyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");

  const analyzeMutation = useAnalyze();
  const navigate = useNavigate();
  const { saveResult } = useAnalysisResult();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  const handleAnalyze = async () => {
    try {
      const data = await analyzeMutation.mutateAsync({ resumeText, jdText });
      saveResult(data);
      navigate("/results");
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return (
    <div className="container-page py-10 md:py-12">
      <div className="mb-8">
        <div className="kicker">Analyzer</div>
        <h2 className="h2 mt-2">Resume & Job Description</h2>
        <p className="subtle mt-2">Choose paste or upload for your resume, then paste the job description.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Panel */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h3">Your Resume</div>
            <span className="chip">Required</span>
          </div>

          {/* Tabs */}
          <div className="inline-flex bg-[rgba(255,255,255,0.06)] rounded-lg p-1 border border-[rgba(255,255,255,0.08)]">
            <button
              className={`btn ${activeTab === "paste" ? "btn-primary" : "btn-ghost"} rounded-lg`}
              onClick={() => setActiveTab("paste")}
            >
              Paste Text
            </button>
            <button
              className={`btn ${activeTab === "upload" ? "btn-primary" : "btn-ghost"} rounded-lg`}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "paste" ? (
              <TextArea
                value={resumeText}
                onChange={setResumeText}
                label="Paste Resume Text"
                minLength={200}
              /* Component keeps its internal logic; just gets dark input styles via global classes */
              />
            ) : (
              <FileDrop onExtracted={setResumeText} />
            )}
          </div>
        </motion.div>

        {/* JD Panel */}
        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: .05 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h3">Job Description</div>
            <span className="chip">Required</span>
          </div>

          <TextArea
            value={jdText}
            onChange={setJdText}
            label="Paste Job Description"
            minLength={100}
          />
        </motion.div>
      </div>

      {/* Footer CTA */}
      <div className="mt-8 flex items-center justify-between gap-4 flex-col md:flex-row">
        <div className="flex items-center gap-3">
          <span className="chip">Gemini AI</span>
          <span className="chip">Rate Limited</span>
          <span className="chip">Privacy First</span>
        </div>

        <button
          className="btn btn-primary"
          disabled={
            resumeText.length < 200 ||
            jdText.length < 100 ||
            analyzeMutation.isLoading
          }
          onClick={handleAnalyze}
        >
          {analyzeMutation.isLoading ? "Analyzing..." : "Analyze Now"}
        </button>
      </div>

      {/* System helpers */}
      <LoadingOverlay show={analyzeMutation.isPending} />
      <ErrorBanner message={analyzeMutation.error?.message || null} />
    </div>
  );
};

export default Analyzer;
