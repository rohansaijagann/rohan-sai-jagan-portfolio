import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, ArrowRight, GitCommit, Users, Mic, Trophy, Terminal } from 'lucide-react';
import { EXPERIENCES } from '../../data/portfolioData.ts';
import { Accent } from '../Accent.tsx';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';

interface ExperienceSectionProps {
  onNavigateProjects?: () => void;
}

// Stat cards — the "one focal point" signature moment for this section
const STATS = [
  { value: '24h', label: 'hackathon duration', icon: Terminal, accent: '#ce9178' },
  { value: '120+', label: 'participants managed', icon: Users, accent: '#569cd6' },
  { value: '3', label: 'industry mentors', icon: Mic, accent: '#4ec9b0' },
  { value: '2+', label: 'years of leadership', icon: Trophy, accent: '#dcdcaa' },
];

// Simulated git log lines (decorative, thematic)
const GIT_LOG = [
  { hash: 'a1f4c2e', msg: 'feat: coordinate campus-wide 24h hackathon', ref: 'HEAD -> main' },
  { hash: 'b3d9f1a', msg: 'feat: mentor 120+ participants during event', ref: null },
  { hash: 'c7e2b4d', msg: 'feat: collaborate with industry judges & faculty', ref: null },
  { hash: 'd8a1c3f', msg: 'feat: lead school-wide event team of 15', ref: null },
  { hash: 'e5f7d2b', msg: 'feat: deliver keynote event on schedule', ref: null },
  { hash: 'f2c9e1a', msg: 'init: public speaking · event operations', ref: null },
];

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onNavigateProjects }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate git log lines appearing one by one once visible
  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setRevealedLines(i);
      if (i >= GIT_LOG.length) clearInterval(interval);
    }, 220);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateProjects) {
      onNavigateProjects();
    } else {
      const target = document.getElementById('projects');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', '#projects');
      }
    }
  };

  const handleScrollToResume = () => {
    const el = document.getElementById('resume');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeExp = EXPERIENCES[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-heading"
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      <SectionWatermark index="06" />

      {/* Accent Orange Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/3 w-[450px] h-[450px] rounded-full bg-[#ce9178]/10 blur-[140px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-10 relative z-10">
        {/* Eyebrow & Heading */}
        <div className="space-y-3 pb-5 border-b border-white/[0.08]">
          <div className="font-mono text-[13px] text-[#ce9178]">
            // chapter 06 · experience.ts
          </div>
          <h2
            id="experience-heading"
            className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            Beyond <Accent color="#ce9178">the code</Accent>.
            <SectionAnchor sectionId="experience" />
          </h2>
          <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
            Leading teams and running events — the human side of building things.
          </p>
        </div>

        {/* SIGNATURE MOMENT: Two-column layout — git log + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Animated Git Log terminal */}
          <div className="rounded-xl bg-[#0e1117] border border-white/[0.08] overflow-hidden shadow-2xl">
            {/* Terminal title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#12151c] border-b border-white/[0.07]">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[11px] text-[#aab2c0]/60">git log --oneline</span>
              <GitBranch className="w-3.5 h-3.5 text-[#ce9178]" />
            </div>

            {/* Git log lines — revealed one by one */}
            <div className="p-4 font-mono text-[13px] space-y-2 min-h-[200px]">
              {GIT_LOG.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 transition-all duration-300"
                  style={{
                    opacity: idx < revealedLines ? 1 : 0,
                    transform: idx < revealedLines ? 'translateY(0)' : 'translateY(6px)',
                  }}
                >
                  <GitCommit className="w-3.5 h-3.5 text-[#ce9178] shrink-0 mt-0.5" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 leading-tight">
                    <span className="text-[#6a9955] shrink-0">{line.hash}</span>
                    <span className="text-[#aab2c0]">{line.msg}</span>
                    {line.ref && (
                      <span className="text-[#c586c0] text-[11px] mt-0.5 sm:mt-0">
                        ({line.ref})
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {/* Blinking cursor */}
              {revealedLines >= GIT_LOG.length && (
                <div className="flex items-center space-x-2 text-[#aab2c0]/50">
                  <span>$</span>
                  <span className="w-2 h-4 bg-[#ce9178]/70 animate-caret-blink inline-block" />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Interactive stat cards + experience selector */}
          <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-[#12151c] border border-white/[0.08] p-4 space-y-2 group hover:border-white/20 transition-colors"
                    style={{
                      boxShadow: `0 0 0 0 ${stat.accent}00`,
                      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${stat.accent}22`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${stat.accent}00`;
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: stat.accent }} />
                    <div
                      className="font-heading text-3xl font-extrabold tracking-tight"
                      style={{ color: stat.accent }}
                    >
                      {stat.value}
                    </div>
                    <div className="font-mono text-[11px] text-[#aab2c0] leading-tight">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Experience selector tabs */}
            <div className="flex space-x-2">
              {EXPERIENCES.map((exp, idx) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer text-left border ${
                    activeIdx === idx
                      ? 'bg-[#ce9178]/10 border-[#ce9178]/40 text-[#ce9178]'
                      : 'bg-[#12151c] border-white/[0.08] text-[#aab2c0] hover:border-white/20 hover:text-[#f4f6fb]'
                  }`}
                >
                  <div className="font-semibold truncate">{exp.role}</div>
                  <div className="text-[10px] opacity-70 truncate">{exp.period}</div>
                </button>
              ))}
            </div>

            {/* Active experience detail */}
            <div className="rounded-xl bg-[#12151c] border border-white/[0.08] p-4 space-y-3">
              <div>
                <div className="font-heading text-lg font-bold text-[#f4f6fb]">{activeExp.role}</div>
                <div className="font-mono text-[13px] text-[#ce9178]">{activeExp.company} · {activeExp.period}</div>
              </div>
              <ul className="space-y-2">
                {activeExp.highlights.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-sm text-[#aab2c0] leading-relaxed">
                    <span className="text-[#ce9178] font-mono shrink-0 mt-0.5 text-xs">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeExp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md bg-[#181c25] border border-white/[0.08] text-[11px] font-mono text-[#ce9178]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <a
            href="#projects"
            onClick={handleScrollToProjects}
            className="inline-flex items-center space-x-2 text-base font-medium text-[#ce9178] hover:text-[#e0a890] transition-colors group cursor-pointer"
          >
            <GitBranch className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>Want the technical side? See what I've built</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={handleScrollToResume}
            className="font-mono text-xs text-[#aab2c0]/60 hover:text-[#ce9178] transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>// next chapter: the short version</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
