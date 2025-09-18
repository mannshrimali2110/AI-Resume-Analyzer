import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionFeedback {
  experience: any;
  skills: any;
  education: any;
  certifications: any;
}

interface SectionTabsProps {
  feedback: SectionFeedback;
}

const tabs = ["Experience", "Skills", "Education", "Certifications"] as const;

const SectionTabs: React.FC<SectionTabsProps> = ({ feedback }) => {
  const [active, setActive] = useState<typeof tabs[number]>("Experience");

  return (
    <div className="my-6 w-full max-w-3xl">
      {/* Tab buttons */}
      <div className="inline-flex bg-[rgba(255,255,255,0.04)] rounded-lg p-1 border border-[rgba(255,255,255,0.08)] mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`btn rounded-lg text-sm px-4 py-2 transition ${active === tab ? "btn-primary" : "btn-ghost"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active tab panel */}
      <div className="panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] font-mono">
              {JSON.stringify(
                feedback[active.toLowerCase() as keyof SectionFeedback],
                null,
                2
              )}
            </pre>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectionTabs;
