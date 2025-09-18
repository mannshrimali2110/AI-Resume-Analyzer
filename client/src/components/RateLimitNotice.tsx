import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeSlide } from "../lib/motion";

const RateLimitNotice: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...fadeSlide}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                     bg-[rgba(6,182,212,0.15)] border border-[rgba(6,182,212,0.25)]
                     text-[var(--accent-2)] text-sm font-medium
                     px-4 py-2 rounded-lg shadow-md"
        >
          Rate limit reached. Please try again later.
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RateLimitNotice;
