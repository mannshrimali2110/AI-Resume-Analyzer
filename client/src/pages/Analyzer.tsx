// src/pages/Analyzer.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisResult } from "../hooks/useAnalysisResult";
import { useAnalyze } from "../hooks/useAnalyze";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Lenis from "lenis";

import FileDrop from "../components/FileDrop";
import TextArea from "../components/TextArea";
import LoadingOverlay from "../components/LoadingOverlay";

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
  // clear any previous errors (dismiss any existing toast)
  toast.dismiss();

    try {
      const data = await analyzeMutation.mutateAsync({ resumeText, jdText });
      saveResult(data);
      navigate("/results");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      // Build a friendly message
      let msg = "Analysis failed. Please try again.";

      // Axios error with response
      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 429) {
          // Try to extract retry time from headers or message
          const ra = error.response.headers?.["retry-after"] || error.response.headers?.["Retry-After"];
          if (ra) {
            msg = `Rate limit exceeded. Please wait ${ra}s and try again.`;
          } else if (data?.message) {
            // some responses include a suggested retry time in the message
            msg = `Rate limit exceeded. ${data.message}`;
          } else {
            msg = "Rate limit exceeded. Please wait a moment and try again.";
          }
        } else if (data?.message) {
          msg = data.message;
        } else {
          msg = `Request failed with status ${status}`;
        }
      } else if (error?.message) {
        msg = error.message;
      }

      // show transient toast (6s)
      toast.error(msg, { duration: 6000, position: "top-center" });
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
      {/* react-hot-toast Toaster is mounted globally in main.tsx; toasts are triggered in code */}
    </div>
  );
};

export default Analyzer;
