import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeywordsListProps {
  missingKeywords?: string[];
  foundKeywords?: string[];
}

const KeywordsList: React.FC<KeywordsListProps> = ({
  missingKeywords = [],
  foundKeywords = [],
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    let text = "📄 Keywords & Skills Analysis\n\n";

    if (foundKeywords.length > 0) {
      text += "✅ Present in Resume:\n";
      text += foundKeywords.map((t) => `• ${t}`).join("\n") + "\n\n";
    }

    if (missingKeywords.length > 0) {
      text += "⚠️ Missing from Resume:\n";
      text += missingKeywords.map((t) => `• ${t}`).join("\n") + "\n\n";
    }

    navigator.clipboard.writeText(text.trim());
    setCopied(true);

    setTimeout(() => setCopied(false), 2000); // auto-hide
  };

  return (
    <div className="my-6 w-full max-w-3xl relative">
      <h3 className="h3 mb-4">Keywords & Skills</h3>

      {/* Found keywords */}
      {foundKeywords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-[var(--success)]">
            ✅ Present in Resume
          </h4>
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {foundKeywords.map((term) => (
              <motion.span
                key={term}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="chip border-[rgba(34,197,94,0.3)] text-[var(--success)]"
              >
                {term}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 text-[var(--danger)]">
            ⚠️ Missing from Resume
          </h4>
          <motion.div
            className="flex flex-wrap gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {missingKeywords.map((term) => (
              <motion.span
                key={term}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="chip border-[rgba(239,68,68,0.3)] text-[var(--danger)]"
              >
                {term}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Copy button */}
      <button onClick={copyToClipboard} className="btn btn-primary">
        Copy All
      </button>

      {/* Animated toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[-2.5rem] left-0 px-4 py-2 rounded-lg bg-[var(--secondary)] text-[var(--success)] shadow-lg"
          >
           Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeywordsList;
