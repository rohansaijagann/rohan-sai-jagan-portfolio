import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  Download,
  Github,
  Linkedin,
  BookOpen,
  Code2,
  ChevronDown,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PERSONAL_INFO } from '../../data/portfolioData.ts';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { PhraseRotator, VERB_PHRASES } from '../PhraseRotator.tsx';
import { PaintWithCodeCanvas } from '../PaintWithCodeCanvas.tsx';
import { PortraitArtwork } from '../PortraitArtwork.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

interface HomeSectionProps {
  onNavigate: (sectionId: string) => void;
  hasScrolled: boolean;
}

const CODE_WALL_SNIPPETS = `
// ComplianceX — Vector Search Route
@router.post("/query", response_model=QueryResponse)
async def semantic_search(request: QueryRequest, db: Session = Depends(get_db)):
    embeddings = embedding_model.encode(request.clause_text)
    results = chroma_collection.query(query_embeddings=[embeddings], n_results=5)
    return {"matches": results["documents"][0], "similarity": results["distances"][0]}

// DocuMind AI — RAG Answer Generation
export async function generateDocumentAnswer(docId: string, prompt: string): Promise<Answer> {
  const chunks = await retrieveVectorChunks(docId, prompt, { topK: 4 });
  const context = chunks.map(c => \`[Page \${c.page}]: \${c.text}\`).join("\\n\\n");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const response = await model.generateContent(\`Context:\\n\${context}\\n\\nQuestion: \${prompt}\`);
  return { text: response.text, citations: chunks.map(c => c.page) };
}

// DrowsiGuard — Eye Aspect Ratio & Alarm Detection
def compute_ear(eye_landmarks):
    A = dist.euclidean(eye_landmarks[1], eye_landmarks[5])
    B = dist.euclidean(eye_landmarks[2], eye_landmarks[4])
    C = dist.euclidean(eye_landmarks[0], eye_landmarks[3])
    ear = (A + B) / (2.0 * C)
    return ear

while cap.isOpened():
    ret, frame = cap.read()
    landmarks = detector.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if ear < EYE_AR_THRESH:
        COUNTER += 1
        if COUNTER >= EYE_AR_CONSEC_FRAMES:
            trigger_auditory_alarm()

// TerraGuard — Geospatial Wildfire Score Engine
def predict_hazard_zone(latitude: float, longitude: float, weather_data: dict):
    features = np.array([[weather_data["temp"], weather_data["humidity"], weather_data["wind_speed"]]])
    risk_score = rf_classifier.predict_proba(features)[0][1]
    return {"lat": latitude, "lon": longitude, "risk": risk_score, "level": get_alert_level(risk_score)}
`;

const SCRAMBLE_CHARS = '{};<>=/[]()*_01#&%';

const MARQUEE_ITEMS = [
  { label: 'ComplianceX', id: 'compliance-x' },
  { label: 'TerraGuard', id: 'terraguard' },
  { label: 'DrowsiGuard', id: 'driver-drowsiness' },
  { label: 'DocuMind AI', id: 'ai-doc-assistant' },
  { label: 'web apps' },
  { label: 'AI that can see' },
  { label: 'things that work' },
];

const NAME_TARGET = 'Rohan Sai Jagan';

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate, hasScrolled }) => {
  const { phraseAccent, isReducedMotion } = useTheme();

  const [showHoverWidget, setShowHoverWidget] = useState(false);
  const [activeRoleTag, setActiveRoleTag] = useState('builder');
  const [isCompiled, setIsCompiled] = useState(false);

  // Letter compile scramble state
  const [displayChars, setDisplayChars] = useState<string[]>(NAME_TARGET.split(''));
  const [hoveredLetterIdx, setHoveredLetterIdx] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Slow weight wave across letters (variable font weight 700-850, ~6s loop)
  const [wavePhase, setWavePhase] = useState(0);

  // Scramble compile-in (~900ms)
  useEffect(() => {
    if (isReducedMotion) {
      setIsCompiled(true);
      setDisplayChars(NAME_TARGET.split(''));
      return;
    }

    const duration = 900;
    const startTime = performance.now();

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      const nextChars = NAME_TARGET.split('').map((char, i) => {
        if (char === ' ') return ' ';
        const charProgress = (i + 1) / NAME_TARGET.length;
        if (progress >= charProgress * 0.75) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      });

      setDisplayChars(nextChars);

      if (progress >= 1) {
        window.clearInterval(interval);
        setDisplayChars(NAME_TARGET.split(''));
        setIsCompiled(true);
      }
    }, 45);

    return () => window.clearInterval(interval);
  }, [isReducedMotion]);

  // Weight wave loop: updates wavePhase every ~50ms
  useEffect(() => {
    if (!isCompiled || isReducedMotion) return;

    let animId: number;
    let start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const phase = ((elapsed % 6000) / 6000) * 2 * Math.PI;
      setWavePhase(phase);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isCompiled, isReducedMotion]);

  const handleLetterHover = (idx: number) => {
    setHoveredLetterIdx(idx);
  };

  const handleNameMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowHoverWidget(true);
    }, 700);
  };

  const handleNameMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowHoverWidget(false);
    setHoveredLetterIdx(null);
  };

  const handleScrollToProject = (projectId: string) => {
    onNavigate('projects');
    setTimeout(() => {
      const el = document.getElementById(`project-${projectId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="section-snap-item min-h-screen flex flex-col justify-between pt-6 sm:pt-8 pb-0 relative overflow-hidden"
    >
      {/* Background Code Wall: Upward Drifting Code at 9% Opacity */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-30 opacity-[0.09] font-mono text-[11px] leading-relaxed text-[#f4f6fb]"
      >
        <div className="animate-code-drift whitespace-pre">
          {CODE_WALL_SNIPPETS}
          {CODE_WALL_SNIPPETS}
        </div>
      </div>

      {/* Text-protection vignette: keeps left content column crisp by darkening the code wall behind it */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-25 hidden md:block"
        style={{
          background: 'radial-gradient(ellipse 55% 80% at 30% 50%, rgba(10,12,16,0.82) 30%, transparent 100%)',
        }}
      />

      {/* Interactive Spotlight Reveal Layer on the Code Wall (~50% Opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-20 font-mono text-[11px] leading-relaxed text-[#569cd6] opacity-50 hidden md:block"
        style={{
          maskImage:
            'radial-gradient(circle 280px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle 280px at var(--mouse-x, 50vw) var(--mouse-y, 50vh), black 20%, transparent 100%)',
        }}
      >
        <div className="animate-code-drift whitespace-pre">
          {CODE_WALL_SNIPPETS}
          {CODE_WALL_SNIPPETS}
        </div>
      </div>

      {/* Signature Moment: Interactive Paint With Code Canvas */}
      <PaintWithCodeCanvas />


      {/* Atmosphere: 3 Soft Ambient Glows (cross-fading 600ms, following phraseAccent) */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, ${phraseAccent}26 0%, transparent 70%)`,
          transition: 'background 600ms ease, opacity 600ms ease',
        }}
        className="absolute top-1/4 right-1/4 w-[520px] h-[520px] rounded-full blur-[160px] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #4ec9b022 0%, transparent 70%)',
        }}
        className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full blur-[150px] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #ce917822 0%, transparent 70%)',
        }}
        className="absolute top-10 right-10 w-[450px] h-[450px] rounded-full blur-[150px] pointer-events-none -z-10"
      />

      {/* Main Content Container: max-w-[1200px], aligned left edge */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-8 lg:px-10 xl:px-16 my-auto relative z-10">
        <SectionWatermark index="01" />

        {/* Mobile 120px Round Portrait above Eyebrow, stacked on left edge */}
        <div className="md:hidden flex justify-start pb-2">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-white/10 shadow-xl bg-white relative">
            <picture className="w-full h-full block">
              <source srcSet="/photo/rohan-400.webp" type="image/webp" />
              <img
                src="/photo/rohan.jpg"
                alt="Portrait of Rohan Sai Jagan speaking into a microphone."
                width={120}
                height={120}
                loading="eager"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 32%' }}
              />
            </picture>
            <div
              style={{ color: phraseAccent }}
              className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-[#0a0c10] text-[9px] font-mono leading-none tracking-wide select-none shadow-md border border-white/10"
            >
              {activeRoleTag}
            </div>
          </div>
        </div>

        {/* ROW 1: Eyebrow — tight to name below, generous space above mobile portrait */}
        <div className="font-mono text-[13px] text-[#6a9955] tracking-wide mb-1 mt-4 lg:mt-5">
          // chapter 01 · Bengaluru, India
        </div>

        {/* TWO COLUMNS: Desktop ~60/40, vertically centred, gap */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-stretch">
          {/* LEFT (about 60%): Two-Line Name + Verb Roller + Buttons + Icons */}
          <div className="md:col-span-7 space-y-4 lg:space-y-5">
            {/* The Name on TWO LINES: "Rohan Sai" on line 1, "Jagan" on line 2 */}
            <div
              className="relative inline-block cursor-default select-none"
              onMouseEnter={handleNameMouseEnter}
              onMouseLeave={handleNameMouseLeave}
            >
              {/* VS Code IntelliSense Hover Widget anchored ABOVE the name */}
              <AnimatePresence>
                {showHoverWidget && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-3 left-0 p-3.5 rounded-xl bg-[#181c25] border border-white/10 shadow-2xl z-40 text-left pointer-events-none min-w-[280px] space-y-1.5 font-sans hidden md:block"
                  >
                    <div className="font-mono text-xs text-[#569cd6] pb-1 border-b border-white/5">
                      (constant) rohan: Developer
                    </div>
                    <div className="text-xs text-[#aab2c0] leading-relaxed">
                      Builds things for the web, and teaches computers to see.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <h1
                id="hero-title"
                className="font-heading text-[#f4f6fb] text-[clamp(44px,5.4vw,84px)] xl:text-[clamp(64px,8vw,128px)] leading-[0.95] tracking-tight"
              >
                {/* Line 1: "Rohan Sai" */}
                <div className="block leading-[0.95] tracking-tight whitespace-nowrap">
                  <span className="inline-block whitespace-nowrap">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const char = displayChars[idx] || NAME_TARGET[idx];
                      let calculatedWeight = 800;
                      if (isCompiled && !isReducedMotion) {
                        const wave = Math.sin(wavePhase - idx * 0.42);
                        calculatedWeight = Math.round(700 + ((wave + 1) / 2) * 150);
                      }
                      const isNearCursor = hoveredLetterIdx !== null && Math.abs(hoveredLetterIdx - idx) <= 1;
                      const fontW = isNearCursor ? 850 : calculatedWeight;
                      const translateY = isNearCursor ? -2 : 0;
                      return (
                        <span
                          key={idx}
                          onMouseEnter={() => handleLetterHover(idx)}
                          style={{
                            fontWeight: fontW,
                            color: '#f4f6fb',
                            transform: `translateY(${translateY}px)`,
                            transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), font-weight 0.12s ease',
                          }}
                          className="inline-block"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                  <span className="inline-block">&nbsp;</span>
                  <span className="inline-block whitespace-nowrap">
                    {[6, 7, 8].map((idx) => {
                      const char = displayChars[idx] || NAME_TARGET[idx];
                      let calculatedWeight = 800;
                      if (isCompiled && !isReducedMotion) {
                        const wave = Math.sin(wavePhase - idx * 0.42);
                        calculatedWeight = Math.round(700 + ((wave + 1) / 2) * 150);
                      }
                      const isNearCursor = hoveredLetterIdx !== null && Math.abs(hoveredLetterIdx - idx) <= 1;
                      const fontW = isNearCursor ? 850 : calculatedWeight;
                      const translateY = isNearCursor ? -2 : 0;
                      return (
                        <span
                          key={idx}
                          onMouseEnter={() => handleLetterHover(idx)}
                          style={{
                            fontWeight: fontW,
                            color: '#f4f6fb',
                            transform: `translateY(${translateY}px)`,
                            transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), font-weight 0.12s ease',
                          }}
                          className="inline-block"
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                </div>

                {/* Line 2: "Jagan" + blinking caret */}
                <div className="block leading-[0.95] tracking-tight whitespace-nowrap">
                  <span className="inline-block whitespace-nowrap">
                    {[10, 11, 12, 13, 14].map((idx) => {
                      const char = displayChars[idx] || NAME_TARGET[idx];
                      let calculatedWeight = 800;
                      if (isCompiled && !isReducedMotion) {
                        const wave = Math.sin(wavePhase - idx * 0.42);
                        calculatedWeight = Math.round(700 + ((wave + 1) / 2) * 150);
                      }
                      const isNearCursor = hoveredLetterIdx !== null && Math.abs(hoveredLetterIdx - idx) <= 1;
                      const fontW = isNearCursor ? 850 : calculatedWeight;
                      const translateY = isNearCursor ? -2 : 0;
                      return (
                        <span
                          key={idx}
                          onMouseEnter={() => handleLetterHover(idx)}
                          style={{
                            fontWeight: fontW,
                            color: '#f4f6fb',
                            transform: `translateY(${translateY}px)`,
                            transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), font-weight 0.12s ease',
                          }}
                          className="inline-block"
                        >
                          {char}
                        </span>
                      );
                    })}

                    {/* Caret after "Jagan": uses current --phrase-accent, one colour, blinking */}
                    <span
                      aria-hidden="true"
                      className="inline-block w-2.5 sm:w-3.5 h-[0.75em] ml-2.5 sm:ml-3 animate-caret-blink shrink-0 align-baseline"
                      style={{
                        backgroundColor: phraseAccent,
                        transition: 'background-color 600ms ease',
                      }}
                    />
                  </span>
                </div>
              </h1>
            </div>

            {/* Main Line: Verb Roller with slot-machine reel */}
            <PhraseRotator onPhraseChange={(p) => setActiveRoleTag(p.roleTag)} />

            {/* Buttons & Quiet Icon Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-mono font-semibold bg-[#569cd6] text-white hover:bg-[#488ac0] shadow-lg shadow-[#569cd6]/25 transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Start the story</span>
              </button>

              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <button
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center space-x-2 px-4.5 py-3 rounded-xl text-xs font-mono font-medium border border-white/10 bg-[#181c25] text-[#f4f6fb] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex-1 sm:flex-none justify-center"
                >
                  <Folder className="w-3.5 h-3.5 text-[#c586c0]" />
                  <span>See the work</span>
                </button>

                <button
                  onClick={() => onNavigate('resume')}
                  className="inline-flex items-center space-x-2 px-4.5 py-3 rounded-xl text-xs font-mono font-medium border border-white/10 bg-[#181c25] text-[#f4f6fb] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex-1 sm:flex-none justify-center"
                >
                  <Download className="w-3.5 h-3.5 text-[#569cd6]" />
                  <span>Resume</span>
                </button>
              </div>

              {/* Social Icon Row — with tooltip labels on hover */}
              <div className="flex items-center space-x-1 pl-1 text-[#aab2c0] w-full sm:w-auto">
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className="group relative p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#181c25] border border-white/10 text-[10px] font-mono text-[#aab2c0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                  className="group relative p-2 rounded-lg hover:text-[#569cd6] hover:bg-white/5 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#181c25] border border-white/10 text-[10px] font-mono text-[#aab2c0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">LinkedIn</span>
                </a>
                <a
                  href={PERSONAL_INFO.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Medium Blog"
                  title="Medium Blog"
                  className="group relative p-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#181c25] border border-white/10 text-[10px] font-mono text-[#aab2c0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Medium</span>
                </a>
                <a
                  href={PERSONAL_INFO.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LeetCode Profile"
                  title="LeetCode"
                  className="group relative p-2 rounded-lg hover:text-[#e6c35c] hover:bg-white/5 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#181c25] border border-white/10 text-[10px] font-mono text-[#aab2c0] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">LeetCode</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT (about 40%): The Round Portrait circle right-aligned, top aligned with Rohan Sai, caption aligned with icons */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between items-end h-full">
            <PortraitArtwork
              roleTag={activeRoleTag}
              sizeClass="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] xl:w-[clamp(240px,23vw,340px)] xl:h-[clamp(240px,23vw,340px)]"
            />
          </div>
        </div>
      </div>

      {/* Bottom Area: Section Counter + Infinite Marquee Ticker */}
      <div className="w-full relative z-20 flex flex-col items-center">
        {/* Section counter: "Turn the page" before first scroll, then "01 / 08" ghost after */}
        <div className="mb-1.5 h-7 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!hasScrolled ? (
              <motion.div
                key="turn"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center space-y-0.5 text-xs font-mono text-[#aab2c0]/60 pointer-events-none"
              >
                <span>Turn the page</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#569cd6]" />
              </motion.div>
            ) : (
              <motion.div
                key="counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="font-mono text-[11px] text-[#aab2c0]/30 tracking-widest pointer-events-none select-none"
              >
                01 / 08
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ticker: Thin full-width bar with top hairline — improved contrast */}
        <div className="w-full bg-[#12151c]/90 backdrop-blur-xs border-t border-white/[0.08] flex items-center h-9 overflow-hidden select-none text-xs font-mono">
          {/* Fixed Left: $ npm run build */}
          <div className="px-4 py-1 flex items-center space-x-2 border-r border-white/10 shrink-0 bg-[#0e1117] z-10">
            <span className="text-[#aab2c0]">$</span>
            <span className="font-semibold text-[#f4f6fb]">npm run build</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
          </div>

          {/* Infinite Marquee Items */}
          <div className="flex-1 overflow-hidden relative group/marquee py-1">
            <div className="flex items-center whitespace-nowrap animate-marquee group-hover/marquee:[animation-play-state:paused]">
              <div className="flex items-center space-x-6 shrink-0 pr-6">
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span key={`m1-${idx}`} className="inline-flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    {item.id ? (
                      <button
                        onClick={() => handleScrollToProject(item.id)}
                        className="text-[#f4f6fb] font-medium hover:text-[#569cd6] underline underline-offset-4 decoration-white/30 hover:decoration-[#569cd6] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-[#d4dae6]">{item.label}</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-6 shrink-0 pr-6" aria-hidden="true">
                {MARQUEE_ITEMS.map((item, idx) => (
                  <span key={`m2-${idx}`} className="inline-flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    {item.id ? (
                      <button
                        tabIndex={-1}
                        onClick={() => handleScrollToProject(item.id)}
                        className="text-[#f4f6fb] font-medium hover:text-[#569cd6] underline underline-offset-4 decoration-white/30 hover:decoration-[#569cd6] transition-colors cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <span className="text-[#d4dae6]">{item.label}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
