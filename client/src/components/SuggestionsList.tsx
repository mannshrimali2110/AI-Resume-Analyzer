import React from "react";
import { motion } from "framer-motion";

interface Suggestion {
  action: string;
  example: string;
  impact: "low" | "med" | "high";
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

const impactColors: Record<Suggestion["impact"], string> = {
  high: "text-[var(--danger)] border-[rgba(239,68,68,0.3)]",
  med: "text-[var(--accent)] border-[rgba(124,58,237,0.3)]",
  low: "text-[var(--text-secondary)] border-[rgba(255,255,255,0.08)]",
};

const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions }) => {
  return (
    <div className="my-6 w-full max-w-3xl">

      <motion.ul
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {suggestions.map((s, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, y: 6 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`panel border-l-4 ${impactColors[s.impact]} p-4`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{s.action}</span>
              <span
                className={`chip uppercase text-xs ${s.impact === "high"
                    ? "text-[var(--danger)]"
                    : s.impact === "med"
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)]"
                  }`}
              >
                {s.impact} impact
              </span>
            </div>
            {s.example && (
              <p className="text-sm text-[var(--text-secondary)]">
                {s.example}
              </p>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SuggestionsList;
