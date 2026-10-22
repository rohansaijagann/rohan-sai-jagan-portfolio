import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Accent } from '../Accent.tsx';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';
import { RubiksCube } from '../RubiksCube.tsx';

// 20px line icons with consistent 1.5px stroke style in pink accent (#d16d9e)
const BoxingGloveIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9a4 4 0 0 1 8 0v2h2a3 3 0 0 1 3 3v3a4 4 0 0 1-4 4H9a5 5 0 0 1-5-5v-3a4 4 0 0 1 2-3.46" />
    <path d="M10 11V7" />
  </svg>
);

const DumbbellIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

const RunningShoeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 17h16a1 1 0 0 0 1-1v-2a4 4 0 0 0-4-4h-3l-2-3H7L5 11l-2 3v2a1 1 0 0 0 1 1z" />
    <path d="M7 11h4" />
    <path d="M6 14h6" />
  </svg>
);

const BicycleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l4-2 3 4.5h3" />
    <path d="m5.5 17.5 4-6.5h3" />
  </svg>
);

const MountainIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const SwimmerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="2" />
    <path d="M2 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    <path d="M7 12l4-2 4 3 4-2" />
  </svg>
);

const ClapperboardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="15" x="2" y="6" rx="2" />
    <path d="M2 10h20" />
    <path d="m5 6 3 4" />
    <path d="m11 6 3 4" />
    <path d="m17 6 3 4" />
  </svg>
);

const BookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
  </svg>
);

const HeadphonesIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

const HangerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7a2 2 0 1 0-2-2" />
    <path d="M12 7l9 9H3l9-9z" />
  </svg>
);

const HouseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SkateboardIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#d16d9e] shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13c3 1 15 1 18 0" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const RAW_SOURCE_LINES = [
  '# after-hours.md',
  '',
  'Away from the keyboard I box, lift, run, ride, hike and swim...',
  'const routine = ["boxing", "lifting", "running", "cube"];',
  '## Training',
  '+ Movement is how I reset.',
  '+ Coaching beginners.',
  '## Off-screen',
  '+ Movies on day one.',
  '## Latest release',
  '+ Solved the Rubik\'s cube.',
  '+ Learned to skateboard.',
];

export const AfterHoursSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasCompiled, setHasCompiled] = useState(false);
  const [compilePhase, setCompilePhase] = useState<'idle' | 'typing' | 'resolving' | 'done'>('idle');

  // Trigger signature compile-in entrance once per session
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHasCompiled(true);
      setCompilePhase('done');
      return;
    }

    if (sessionStorage.getItem('after_hours_compiled')) {
      setHasCompiled(true);
      setCompilePhase('done');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && compilePhase === 'idle') {
          sessionStorage.setItem('after_hours_compiled', 'true');
          setCompilePhase('typing');

          // Phase 1: fast source typing (500ms)
          setTimeout(() => {
            setCompilePhase('resolving');
            // Phase 2: text resolve & cube assemble (600ms)
            setTimeout(() => {
              setCompilePhase('done');
              setHasCompiled(true);
            }, 650);
          }, 500);

          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [compilePhase]);

  // Click/scroll skips immediately to final state
  const handleSkip = () => {
    if (compilePhase !== 'done') {
      setCompilePhase('done');
      setHasCompiled(true);
    }
  };

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="after-hours"
      aria-labelledby="after-hours-heading"
      onClick={handleSkip}
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      {/* Pink Accent Ambient Glow under Cube */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full bg-[#d16d9e]/10 blur-[150px] pointer-events-none -z-10 animate-soft-pulse"
      />

      {/* Compile-in Fast Source Code Layer (aria-hidden, pointer-events none) */}
      {compilePhase === 'typing' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 p-8 font-mono text-xs text-[#d16d9e]/70 bg-[#0a0c10]/90 pointer-events-none select-none overflow-hidden"
        >
          <div className="space-y-1">
            {RAW_SOURCE_LINES.map((line, idx) => (
              <div key={idx} className="flex space-x-3">
                <span className="text-[#aab2c0]/40 w-6 text-right">{idx + 1}</span>
                <span className="text-[#d16d9e]">{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Container: max-w-[1200px], aligned left edge */}
      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-7 relative z-10">
        <SectionWatermark index="03" />

        {/* Eyebrow */}
        <div className="font-mono text-[13px] text-[#d16d9e]">
          // chapter 03 · after-hours.md
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2
            id="after-hours-heading"
            className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            After <Accent color="#d16d9e">hours</Accent>.
            <SectionAnchor sectionId="after-hours" />
          </h2>
          <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
            What happens when the laptop closes.
          </p>
        </div>

        {/* Intro line */}
        <p className="text-[18px] text-[#f4f6fb] leading-relaxed max-w-[65ch] [text-wrap:pretty]">
          Away from the keyboard I box, lift, run, ride, hike and swim, and the discipline carries over. It's the same loop everywhere: show up, repeat, get a little better.
        </p>

        {/* Open 2-Column Composition (NO card wrapper around cube per spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          {/* Left Column: Rubik's Cube Scene (No card wrapper around cube; soft floor shadow and pink glow under it) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <RubiksCube />
          </div>

          {/* Right Column: CHANGELOG.md window with git-diff style release notes */}
          <div className="lg:col-span-7 rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                <span className="text-[#aab2c0] text-[11px] ml-2 font-mono">CHANGELOG.md</span>
              </div>
              <span className="text-[10px] text-[#d16d9e] font-mono">diff: master</span>
            </div>

            {/* Changelog Diff Content: Text is soft white (#e6edf3) 17px, '+' markers green, '##' headings comment green mono 14px uppercase */}
            <div className="p-6 sm:p-7 font-sans text-[17px] leading-relaxed space-y-6 bg-[#0a0c10] select-text">
              {/* Section: Training */}
              <div className="space-y-3">
                <div className="text-[#6a9955] font-mono font-bold text-[14px] uppercase tracking-wide">
                  ## Training
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <BoxingGloveIcon />
                  </div>
                  <span>Boxing, lifting, running, cycling, hiking, swimming. Movement is how I reset.</span>
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <DumbbellIcon />
                  </div>
                  <span>I coach a few beginners for fun. Watching someone land their first real rep never gets old.</span>
                </div>
              </div>

              {/* Section: Off-screen */}
              <div className="space-y-3 pt-1">
                <div className="text-[#6a9955] font-mono font-bold text-[14px] uppercase tracking-wide">
                  ## Off-screen
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <ClapperboardIcon />
                  </div>
                  <span>Good movie out? I'm there on day one, front of the queue.</span>
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <BookIcon />
                  </div>
                  <span>Books and podcasts when I want to refill the tank.</span>
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <HangerIcon />
                  </div>
                  <span>Style and grooming. Good design applies to people too.</span>
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <HouseIcon />
                  </div>
                  <span>Family time, always.</span>
                </div>
              </div>

              {/* Section: Latest release */}
              <div className="space-y-3 pt-1">
                <div className="text-[#6a9955] font-mono font-bold text-[14px] uppercase tracking-wide">
                  ## Latest release
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <CubeIcon />
                  </div>
                  <span>Solved the Rubik's cube.</span>
                </div>
                <div className="text-[#e6edf3] flex items-start space-x-3 group/item">
                  <span className="select-none font-mono text-[#4ec9b0] font-bold shrink-0">+</span>
                  <div className="group-hover/item:translate-x-1 transition-transform shrink-0 pt-0.5">
                    <SkateboardIcon />
                  </div>
                  <span>Learned to skateboard.</span>
                </div>
                <div className="text-[#6a9955] font-mono text-xs pt-1.5">
                  // When I get bored, I learn something new. That's how the last two happened.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Edge: Small decorative line-art skateboard doing a slow ollie loop (SVG, transform only) */}
        <div className="relative h-10 w-full overflow-hidden select-none pointer-events-none opacity-40">
          <svg
            className="w-10 h-6 text-[#d16d9e] animate-skate-ollie absolute bottom-1"
            viewBox="0 0 40 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M 4 12 C 10 14, 30 14, 36 12" strokeLinecap="round" />
            <circle cx="10" cy="18" r="3" />
            <circle cx="30" cy="18" r="3" />
            <line x1="10" y1="13" x2="10" y2="15" />
            <line x1="30" y1="13" x2="30" y2="15" />
          </svg>
        </div>

        {/* Narrator Link at End (Inside bottom padding) */}
        <div className="pt-6 border-t border-white/[0.08]">
          <button
            onClick={handleScrollToProjects}
            className="font-mono text-xs text-[#aab2c0]/60 hover:text-[#d16d9e] transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>// next chapter: the things I built</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
