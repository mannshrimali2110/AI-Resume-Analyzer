import React from "react";
import { motion } from "framer-motion";

interface MatchGaugeProps {
  score: number;
}

const CIRCUMFERENCE = 339.292; // 2 * Math.PI * r (r = 54)

const MatchGauge: React.FC<MatchGaugeProps> = ({ score }) => {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <motion.div
      className="relative flex flex-col items-center my-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Accent glow behind gauge */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-30 -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)",
        }}
      />

      <svg width="140" height="140" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="var(--muted)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="var(--accent)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        {/* Score text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1.8em"
          fill="var(--accent)"
          fontWeight="700"
        >
          {score}%
        </text>
      </svg>

      <div className="mt-3 text-base md:text-lg font-semibold text-[var(--text-primary)]">
        Match Score
      </div>
    </motion.div>
  );
};

export default MatchGauge;
