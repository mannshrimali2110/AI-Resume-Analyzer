import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../lib/motion";

const LoadingOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...fadeIn}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-[rgba(0,0,0,0.65)] backdrop-blur-sm"
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-12 h-12 border-4 border-[var(--accent)]
                            border-t-transparent rounded-full animate-spin" />
            <div className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">
              Analyzing...
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
