import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Accent } from '../Accent.tsx';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { Term } from '../Term.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';
import { PERSONAL_INFO } from '../../data/portfolioData.ts';

// Suggestion Method Cube Icon (20px SVG line icon)
const MethodCubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#c586c0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SUGGESTIONS = [
  {
    id: 'web-apps',
    title: 'Web apps',
    signature: 'buildWebApps()',
    returns: 'returns: websites that feel good to use',
    details: 'Fast, clean websites that feel good to use.',
    tools: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'behind-the-scenes',
    title: 'Behind the scenes',
    signature: 'runTheServers()',
    returns: 'returns: reliable backends and databases',
    details: 'The servers and databases that keep apps running.',
    tools: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'computer-vision',
    title: 'Computer vision',
    signature: 'teachComputersToSee()',
    returns: 'returns: real-time visual perception models',
    details: 'Teaching computers to understand images and live video.',
    tools: ['TensorFlow', 'OpenCV'],
  },
  {
    id: 'document-ai',
    title: 'Document AI',
    signature: 'answerFromDocuments()',
    returns: 'returns: cited answers from long manuals',
    details: 'Tools that answer questions from long documents and show where the answer came from.',
    tools: ['ChromaDB', 'Gemini API'],
  },
];

const HOW_I_WORK = [
  '// Keep it simple: clear for users, clear for the next developer.',
  '// Make it reliable: tested, typed, predictable.',
  '// Make it fast: smooth experiences, quick responses.',
];

export const AboutSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredPara, setHoveredPara] = useState<number | null>(null);
  const [reachedLastRow, setReachedLastRow] = useState(false);
  const runwayRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);
  const lastScrollY = useRef(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress listener through the runway
  useEffect(() => {
    if (prefersReducedMotion) return;

    const runway = runwayRef.current;
    const scrollContainer = document.getElementById('editor-scroll-container');
    if (!runway || !scrollContainer) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = runway.getBoundingClientRect();
          const runwayHeight = rect.height;
          const stickyTop = 96;

          // Compute how far we have scrolled past stickyTop inside the runway
          const scrolledIntoRunway = stickyTop - rect.top;
          const scrollableDistance = runwayHeight - (window.innerHeight - stickyTop);

          if (scrollableDistance > 0 && scrolledIntoRunway >= 0 && scrolledIntoRunway <= scrollableDistance) {
            const progress = Math.max(0, Math.min(1, scrolledIntoRunway / scrollableDistance));
            const targetIndex = Math.min(
              SUGGESTIONS.length - 1,
              Math.floor(progress * SUGGESTIONS.length)
            );

            // Little hysteresis check to prevent flicker
            const isMoving = Math.abs(scrollContainer.scrollTop - lastScrollY.current) > 3;
            if (isMoving && !userInteractedRef.current) {
              setSelectedIndex(targetIndex);
            }
            if (targetIndex === SUGGESTIONS.length - 1) {
              setReachedLastRow(true);
            }
          }

          // Reset user interaction override if scroll moved noticeably
          if (Math.abs(scrollContainer.scrollTop - lastScrollY.current) > 40) {
            userInteractedRef.current = false;
          }

          lastScrollY.current = scrollContainer.scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, [prefersReducedMotion]);

  const handleSelect = (idx: number) => {
    userInteractedRef.current = true;
    setSelectedIndex(idx);
    if (idx === SUGGESTIONS.length - 1) {
      setReachedLastRow(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    userInteractedRef.current = true;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (selectedIndex + 1) % SUGGESTIONS.length;
      setSelectedIndex(next);
      if (next === SUGGESTIONS.length - 1) setReachedLastRow(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
    }
  };

  const handleScrollToAfterHours = () => {
    const el = document.getElementById('after-hours');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSuggestion = SUGGESTIONS[selectedIndex];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      {/* Accent Teal Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#4ec9b0]/10 blur-[150px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-7 relative z-10">
        <SectionWatermark index="02" />

        {/* Eyebrow */}
        <div className="font-mono text-[13px] text-[#4ec9b0]">
          // chapter 02 · about.html
        </div>
        {/* Heading with Accent Selection Highlight */}
        <div>
          <h2
            id="about-heading"
            className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            I like making things <Accent color="#4ec9b0">work</Accent>.
            <SectionAnchor sectionId="about" />
          </h2>
        </div>

        {/* 2-Column: Left = Story Paragraphs with Blame Lens, Right = Green Pull Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Story Paragraphs wrapped in faint HTML tags in the margins */}
          <div className="lg:col-span-8 relative pl-5 sm:pl-7 space-y-4 max-w-[65ch]">
            <div
              aria-hidden="true"
              className="font-mono text-xs text-[#4ec9b0]/25 select-none -ml-4"
            >
              &lt;section id="story"&gt;
            </div>

            {/* Paragraph 1 */}
            <div
              className="relative group/p"
              onMouseEnter={() => setHoveredPara(1)}
              onMouseLeave={() => setHoveredPara(null)}
            >
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none mr-2">
                &lt;p&gt;
              </span>
              <span className="text-[18px] text-[#f4f6fb] leading-relaxed [text-wrap:pretty]">
                I'm Rohan, a developer from Bengaluru who's happiest with an empty editor and a problem worth solving.
              </span>
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none ml-2">
                &lt;/p&gt;
              </span>
              {/* Git Blame Lens */}
              {hoveredPara === 1 && (
                <span className="hidden sm:inline-block ml-3 font-mono text-[11px] text-[#aab2c0]/40 select-none animate-fade-in pointer-events-none">
                  Rohan Sai Jagan, 2026 · initial commit
                </span>
              )}
            </div>

            {/* Paragraph 2 */}
            <div
              className="relative group/p"
              onMouseEnter={() => setHoveredPara(2)}
              onMouseLeave={() => setHoveredPara(null)}
            >
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none mr-2">
                &lt;p&gt;
              </span>
              <span className="text-[18px] text-[#f4f6fb] leading-relaxed [text-wrap:pretty]">
                I build the whole thing: the screens you see, the servers behind them, and the AI that makes them smarter. I enjoy the small stuff too, like the bug that eats a whole evening and turns out to be one missing character.
              </span>
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none ml-2">
                &lt;/p&gt;
              </span>
              {/* Git Blame Lens */}
              {hoveredPara === 2 && (
                <span className="hidden sm:inline-block ml-3 font-mono text-[11px] text-[#aab2c0]/40 select-none animate-fade-in pointer-events-none">
                  Rohan Sai Jagan, 2026 · initial commit
                </span>
              )}
            </div>

            {/* Paragraph 3 */}
            <div
              className="relative group/p"
              onMouseEnter={() => setHoveredPara(3)}
              onMouseLeave={() => setHoveredPara(null)}
            >
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none mr-2">
                &lt;p&gt;
              </span>
              <span className="text-[18px] text-[#f4f6fb] leading-relaxed [text-wrap:pretty]">
                Nothing beats the moment something you built works for someone else. That's the part I keep chasing.
              </span>
              <span aria-hidden="true" className="font-mono text-xs text-[#4ec9b0]/25 select-none ml-2">
                &lt;/p&gt;
              </span>
              {/* Git Blame Lens */}
              {hoveredPara === 3 && (
                <span className="hidden sm:inline-block ml-3 font-mono text-[11px] text-[#aab2c0]/40 select-none animate-fade-in pointer-events-none">
                  Rohan Sai Jagan, 2026 · initial commit
                </span>
              )}
            </div>

            <div
              aria-hidden="true"
              className="font-mono text-xs text-[#4ec9b0]/25 select-none -ml-4"
            >
              &lt;/section&gt;
            </div>
          </div>

          {/* Right Column: Faint Pull Quote in Comment Green */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#12151c]/60 border border-white/[0.06] select-none font-mono">
            <div className="text-[#6a9955] text-sm leading-relaxed">
              // the bug that eats a whole evening is usually one missing character.
            </div>
            <div className="text-[11px] text-[#aab2c0]/40 pt-3 border-t border-white/5 mt-3">
              rohan.config.ts
            </div>
          </div>
        </div>

        {/* =========================================================================
            WHAT I DO: SCROLL-DRIVEN RUNWAY (Sticky-Pinned)
            Runway height ~1.6x on desktop, ~1.3x on mobile. Widget sticky at top 96px.
        ========================================================================= */}
        <div
          ref={runwayRef}
          className={`relative ${
            prefersReducedMotion
              ? 'py-6'
              : 'min-h-[130vh] sm:min-h-[160vh]'
          }`}
        >
          <div
            className={`${
              prefersReducedMotion ? 'relative' : 'sticky top-24'
            } space-y-3 z-20`}
          >
            <div className="font-mono text-xs text-[#6a9955]">// what I do</div>

            {/* Mid-typing mono line: Bug 6 fix: antialiased, no smudged shadows or strokes, no gap between rohan and dot */}
            <div className="font-mono text-sm text-[#f4f6fb] flex items-center pl-1 antialiased [text-shadow:none] [-webkit-text-stroke:0]">
              <span className="text-[#9cdcfe]">rohan</span><span className="text-[#f4f6fb]">.</span>
              <span
                aria-hidden="true"
                className="inline-block w-2 h-4 bg-[#569cd6] ml-1 animate-caret-blink"
              />
            </div>

            {/* Suggestion Window with 2 Panes */}
            <div
              tabIndex={0}
              role="listbox"
              aria-label="What I do suggestions"
              aria-activedescendant={`suggest-opt-${currentSuggestion.id}`}
              onKeyDown={handleKeyDown}
              className="rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#569cd6]"
            >
              {/* Window Title Bar */}
              <div className="px-4 py-2 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono text-[#aab2c0]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                  <span className="text-[11px] ml-2 text-[#aab2c0]">rohan.methods.ts — IntelliSense</span>
                </div>
                <span className="text-[10px] text-[#569cd6]">suggest</span>
              </div>

              {/* 2-Pane Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
                {/* Left Pane: Suggestion List (Rows at least 56px on mobile) */}
                <div className="md:col-span-5 p-2 space-y-1 bg-[#12151c]">
                  {SUGGESTIONS.map((item, idx) => {
                    const isSelected = selectedIndex === idx;

                    return (
                      <div
                        key={item.id}
                        id={`suggest-opt-${item.id}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(idx)}
                        onMouseEnter={() => handleSelect(idx)}
                        className={`group flex items-center justify-between px-3 py-3.5 sm:py-3 min-h-[56px] sm:min-h-0 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#04395e] text-white border-l-2 border-[#569cd6] shadow-sm'
                            : 'text-[#aab2c0] hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <MethodCubeIcon />
                          <span className="text-[17px] sm:text-[18px] font-heading font-semibold text-[#f4f6fb] truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-[#aab2c0]/60 shrink-0 ml-2 hidden sm:inline">
                          {item.signature}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right Pane: Details Panel (150ms cross-fade) */}
                <div
                  aria-live="polite"
                  className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-[#0e1117]"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSuggestion.id}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      {/* Top Signature */}
                      <div className="space-y-1 pb-3 border-b border-white/5 font-mono text-sm">
                        <div className="text-[#dcdcaa] font-semibold">
                          rohan.<span className="text-[#dcdcaa]">{currentSuggestion.signature}</span>
                        </div>
                        <div className="text-xs text-[#aab2c0]/60">
                          {currentSuggestion.returns}
                        </div>
                      </div>

                      {/* Middle Plain-English sentence at 18-20px bright */}
                      <p className="text-[19px] sm:text-[20px] font-heading font-bold text-[#f4f6fb] leading-relaxed">
                        {currentSuggestion.details}
                      </p>

                      {/* Bottom Tools Chips */}
                      <div className="pt-1 space-y-2">
                        <div className="text-xs font-mono text-[#aab2c0]">tools:</div>
                        <div className="flex flex-wrap gap-2">
                          {currentSuggestion.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 rounded-lg bg-[#181c25] border border-white/[0.08] text-xs font-mono text-[#4ec9b0]"
                            >
                              <Term term={tool}>{tool}</Term>
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Tiny mono hint: fades out once last row is reached */}
            <div
              className={`text-center transition-opacity duration-300 font-mono text-xs text-[#aab2c0]/60 pt-1 ${
                reachedLastRow || prefersReducedMotion ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              // scroll to step through
            </div>
          </div>
        </div>

        {/* How I Work: 3 Code Comments in a Faint Window */}
        <div className="rounded-2xl bg-[#12151c]/80 border border-white/[0.08] p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#aab2c0] pb-2 border-b border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#4ec9b0]" />
            <span>how_I_work.config</span>
          </div>
          <div className="space-y-1.5 font-mono text-sm leading-relaxed">
            {HOW_I_WORK.map((rule, idx) => (
              <div key={idx} className="text-[#6a9955] hover:text-[#7bb362] transition-colors">
                {rule}
              </div>
            ))}
          </div>
        </div>

        {/* End of About: ONE Quiet Factual Mono Education Line + Narrator Link */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="font-mono text-xs text-[#aab2c0]/60">
            {PERSONAL_INFO.educationFactual}
          </p>

          <button
            onClick={handleScrollToAfterHours}
            className="font-mono text-xs text-[#aab2c0]/60 hover:text-[#4ec9b0] transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>// next chapter: after hours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
