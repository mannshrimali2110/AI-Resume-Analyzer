import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyBlockProps {
  markdownReport: string;
}

const CopyBlock: React.FC<CopyBlockProps> = ({ markdownReport }) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownReport);
    setShowToast(true);

    // Auto-hide toast after 2.5s
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="my-6 w-full max-w-3xl relative">
      <h3 className="h3 mb-3">Copy Feedback</h3>

      {/* JSON Preview */}
      <div className="panel p-3 md:p-4 mb-3 overflow-y-auto max-h-64">
        <pre className="whitespace-pre-wrap text-sm font-mono text-[var(--text-secondary)]">
          {markdownReport}
        </pre>
      </div>

      {/* Copy Button */}
      <button onClick={copyToClipboard} className="btn btn-primary">
        Copy to Clipboard
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2
                       bg-[rgba(124,58,237,0.9)] text-white px-4 py-2
                       rounded-lg shadow-lg text-sm font-medium z-50"
          >
            ✅ Copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CopyBlock;
