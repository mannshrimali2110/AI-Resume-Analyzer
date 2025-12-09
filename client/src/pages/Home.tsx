import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";

const Home: React.FC = () => {
  // Lenis smooth scroll (simple init)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className="container-page flex flex-col">
      {/* HERO */}
      <section className="hero rounded-[2rem] mt-10 md:mt-16 p-8 md:p-14 relative overflow-hidden">
        {/* Accent orbs */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,.45), transparent 60%)" }}
          initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }}
        />
        <motion.div
          className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,.35), transparent 60%)" }}
          initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .1 }}
        />

        <div className="relative z-10">
          {/* Large brand title above the hero content */}
          <div className="mb-8 text-center w-full">
            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight"
              style={{
                background: 'linear-gradient(90deg, rgba(124,58,237,1), rgba(6,182,212,1))',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Resumetric <span className="text-[var(--accent-2)] font-extrabold">AI</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="kicker">AI-Powered • Resume + JD</div>
            <h1 className="h1 mt-3">
              Tailor your resume <span className="text-[var(--accent)]">perfectly</span> to the job.
            </h1>
            <p className="subtle mt-4 md:mt-5 max-w-xl">
              Paste or upload your resume, add the job description, and get instant, targeted feedback:
              match score, missing keywords, and improvement tips.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link to="/analyzer" className="btn btn-primary">
                Get Started
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-ghost ring-accent"
              >
                How it works
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">Dark Theme</span>
              <span className="chip">Resume Parsing</span>
              <span className="chip">Keyword Extraction</span>
              <span className="chip">Job Matching</span>
              <span className="chip">Match Score & Insights</span>
              <span className="chip">PDF Upload & Parse</span>
              <span className="chip">Tailored Suggestions</span>
              <span className="chip">Real-time Feedback</span>
              <span className="chip">Privacy-first</span>
              <span className="chip">Export / Share</span>
            </div>
          </div>

          {/* Right preview panel */}
            <motion.div
            className="card p-6 md:p-8 rounded-3xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .15 }}
            >
            {/* Preview box */}
            <div className="relative h-56 md:h-72 w-full rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,.08)",
                // Use multiple backgrounds: logo on top, gradient below
                backgroundImage: `url('/Resumetric%20Logo%20fix.png'), linear-gradient(135deg, rgba(124,58,237,.18), rgba(6,182,212,.18))`,
                backgroundRepeat: 'no-repeat, no-repeat',
                // size logo to ~60% height, gradient covers entire box
                backgroundSize: '120% auto, cover',
                backgroundPosition: 'top center, center'
              }}
            />

            <p className="subtle mt-4">
              Clean, modern results view with gauge, keywords, sections, and copyable JSON.
            </p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section id="how-it-works" className=" mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "1. Provide Inputs", desc: "Paste or upload your resume, then paste the job description." },
          { title: "2. AI Analysis", desc: "Gemini compares resume↔JD for match %, keywords, and relevance." },
          { title: "3. Improve & Apply", desc: "Follow actionable tips; copy results to refine your resume." },
        ].map((item, i) => (
          <motion.div
        key={item.title}
        className="panel"
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: .45, delay: i * .05 }}
          >
        <div className="h3">{item.title}</div>
        <p className="subtle mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Bottom spacer to ensure the page can scroll past this section and avoid a cutoff */}
      <div aria-hidden="true" className="h-16 md:h-28" />
      
    </main>
  );
};

export default Home;
