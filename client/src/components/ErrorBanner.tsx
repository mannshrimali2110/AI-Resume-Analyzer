import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeSlide } from "../lib/motion";

const ErrorBanner: React.FC<{ message: string | null }> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          {...fadeSlide}
          className="mt-4 p-4 rounded-xl border border-[rgba(239,68,68,0.25)]
                     bg-[rgba(239,68,68,0.08)] text-[var(--danger)]
                     text-sm font-medium text-center shadow-md"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorBanner;
