import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  ExternalLink,
  Search,
  Sparkles,
  ShieldAlert,
  FileText,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData.ts';
import { Term } from '../Term.tsx';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { Accent } from '../Accent.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';

// 1. Signature Visual: ComplianceX (Document search sweep & glowing clause)
export const ComplianceXVisual: React.FC = () => {
  return (
    <div
      data-testid="visual-compliance-x"
      className="rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-[320px] sm:h-[350px]"
    >
      <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          <span className="text-[#aab2c0] text-[11px] ml-2">compliance_vector_search.py</span>
        </div>
        <span className="text-[10px] text-[#569cd6] font-mono">ChromaDB</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-[#0e1117] relative font-mono text-xs">
        {/* Mock Search Bar Typing */}
        <div className="w-full px-3 py-2 rounded-xl bg-[#181c25] border border-white/10 flex items-center space-x-2 text-[#aab2c0]">
          <Search className="w-3.5 h-3.5 text-[#569cd6] shrink-0" />
          <span className="text-[#f4f6fb] truncate">query: "data retention limits"</span>
        </div>

        {/* Faint document lines */}
        <div className="space-y-2 py-2 opacity-35 select-none">
          <div className="h-2 w-3/4 bg-white/20 rounded" />
          <div className="h-2 w-full bg-white/20 rounded" />
          <div className="h-2 w-5/6 bg-white/20 rounded" />
        </div>

        {/* Glowing Highlighted Clause */}
        <div className="p-3.5 rounded-xl bg-[#569cd6]/15 border border-[#569cd6]/50 shadow-[0_0_20px_rgba(86,156,214,0.25)] space-y-1.5 transition-all">
          <div className="flex items-center justify-between text-[11px] text-[#569cd6] font-bold">
            <span>MATCH: Article Clause</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Best match
            </span>
          </div>
          <p className="text-[11px] text-[#f4f6fb] leading-relaxed">
            Personal data shall be erased without undue delay where the data is no longer necessary in relation to the purposes for which it was collected.
          </p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#aab2c0]/60">
          <span className="text-emerald-400 font-semibold">Index ready</span>
          <span className="text-[#aab2c0]">Best match highlighted</span>
        </div>
      </div>
    </div>
  );
};

// 2. Signature Visual: TerraGuard (Risk Heatmap & pulsing hotspot)
export const TerraGuardVisual: React.FC = () => {
  return (
    <div
      data-testid="visual-terraguard"
      className="rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-[320px] sm:h-[350px]"
    >
      <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          <span className="text-[#aab2c0] text-[11px] ml-2">terraguard_map.leaflet</span>
        </div>
        <span className="text-[10px] text-[#dcdcaa] font-mono">Leaflet Heatmap</span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between bg-[#0e1117] relative">
        {/* Heatmap Grid Simulation */}
        <div className="grid grid-cols-6 gap-1.5 flex-1 p-2 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const isHigh = i === 8 || i === 9 || i === 14 || i === 15;
            const isMed = i === 7 || i === 10 || i === 13 || i === 16;
            return (
              <div
                key={i}
                className={`rounded-md transition-all duration-700 flex items-center justify-center relative ${
                  isHigh
                    ? 'bg-red-500/70 border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : isMed
                    ? 'bg-amber-500/40 border border-amber-400/40'
                    : 'bg-emerald-500/15 border border-emerald-500/10'
                }`}
              >
                {isHigh && i === 14 && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend & Map status (Low, Medium, High) */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#aab2c0]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px]">Low</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px]">Medium</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-[10px]">High</span>
            </span>
          </div>
          <span className="text-red-400 font-bold flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Hotspot active</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. Signature Visual: DrowsiGuard (eye_tracking.cv2)
export const DrowsiGuardVisual: React.FC = () => {
  return (
    <div
      data-testid="visual-drowsiguard"
      className="rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-[320px] sm:h-[350px]"
    >
      <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          <span className="text-[#aab2c0] text-[11px] ml-2 font-mono">eye_tracking.cv2</span>
        </div>
        <span className="text-[10px] text-red-400 font-mono">Vision feed</span>
      </div>

      <div className="p-4 flex-1 flex flex-col items-center justify-between bg-[#0e1117] relative">
        {/* Stylized Face with Eye Landmarks & Pulsing Alert Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center my-auto">
          {/* Pulsing Alert Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping pointer-events-none" />

          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
            {/* Face Oval */}
            <ellipse cx="100" cy="100" rx="70" ry="85" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Left Eye Closed (Red Landmarks) */}
            <path d="M 65 85 Q 77 90 90 85" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="65" cy="85" r="3" fill="#ef4444" />
            <circle cx="77" cy="89" r="3" fill="#ef4444" />
            <circle cx="90" cy="85" r="3" fill="#ef4444" />

            {/* Right Eye Closed (Red Landmarks) */}
            <path d="M 110 85 Q 123 90 135 85" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="110" cy="85" r="3" fill="#ef4444" />
            <circle cx="123" cy="89" r="3" fill="#ef4444" />
            <circle cx="135" cy="85" r="3" fill="#ef4444" />

            {/* Nose bridge */}
            <path d="M 100 90 L 97 115 L 104 115" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* Mouth */}
            <path d="M 85 140 Q 100 145 115 140" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          </svg>
        </div>

        {/* Alarm Banner: Eyes closed: alarm */}
        <div className="w-full px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-between text-xs font-mono text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
            <span className="font-bold">Eyes closed: alarm</span>
          </div>
          <span className="text-red-300 font-bold tracking-wider">ALERT</span>
        </div>
      </div>
    </div>
  );
};

// 4. Signature Visual: DocuMind AI (documind_qa.gemini)
export const DocuMindAIVisual: React.FC = () => {
  return (
    <div
      data-testid="visual-documind-ai"
      className="rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col h-[320px] sm:h-[350px]"
    >
      <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          <span className="text-[#aab2c0] text-[11px] ml-2 font-mono">documind_qa.gemini</span>
        </div>
        <span className="text-[10px] text-[#4ec9b0] font-mono">Gemini RAG</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-[#0e1117] space-y-3">
        {/* User Question Bubble */}
        <div className="self-end max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-[#569cd6]/20 border border-[#569cd6]/30 text-xs font-mono text-[#f4f6fb]">
          <span className="text-[#569cd6] font-bold block text-[10px] mb-0.5">User</span>
          What are the maintenance requirements for the sensor?
        </div>

        {/* AI Answer Bubble with Page 12 Source */}
        <div className="self-start max-w-[90%] p-3.5 rounded-2xl rounded-tl-sm bg-[#181c25] border border-white/10 text-xs font-mono text-[#f4f6fb] space-y-2 shadow-lg">
          <div className="flex items-center space-x-1.5 text-[10px] text-[#4ec9b0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold">DocuMind AI</span>
          </div>

          <p className="text-[12px] leading-relaxed text-[#f4f6fb]">
            Sensors must be inspected periodically. Clean external lenses with isopropyl alcohol only.
          </p>

          {/* Signature Source Chip */}
          <div className="pt-0.5 flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-[#4ec9b0]/15 border border-[#4ec9b0]/40 text-[#4ec9b0] text-[10px] font-bold shadow-[0_0_10px_rgba(78,201,176,0.3)]">
              <FileText className="w-3 h-3" />
              <span>Source: page 12</span>
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#aab2c0]/60">
          <span>Source citation active</span>
          <span className="text-[#4ec9b0] font-semibold">Sources shown</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'AI / ML' | 'Full-Stack'>('All');

  const filteredProjects = PROJECTS.filter((proj) => {
    if (filter === 'All') return true;
    return proj.category === filter;
  });

  const getVisual = (id: string) => {
    switch (id) {
      case 'compliance-x':
        return <ComplianceXVisual />;
      case 'terraguard':
        return <TerraGuardVisual />;
      case 'driver-drowsiness':
      case 'drowsiguard':
        return <DrowsiGuardVisual />;
      case 'ai-doc-assistant':
      case 'documind-ai':
        return <DocuMindAIVisual />;
      default:
        return <ComplianceXVisual />;
    }
  };

  const handleScrollToSkills = () => {
    const el = document.getElementById('skills');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      {/* Section Watermark 04 */}
      <SectionWatermark index="04" />

      {/* Accent Purple Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#c586c0]/10 blur-[150px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-7 relative z-10">
        {/* Eyebrow & Header (No count anywhere!) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-5 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="font-mono text-[13px] text-[#c586c0]">
              // chapter 04 · projects.js
            </div>
            <h2
              id="projects-heading"
              className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
            >
              Projects I <Accent color="#c586c0">built</Accent>.
              <SectionAnchor sectionId="projects" />
            </h2>
            <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
              Each one started with a problem that annoyed me.
            </p>
          </div>

          {/* Filter Tab Strip */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#12151c] border border-white/[0.08] text-xs font-mono self-start md:self-end">
            {(['All', 'AI & ML', 'Full-Stack'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab as any);
                  if (tab === 'Full-Stack') {
                    const el = document.getElementById('project-terraguard');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else if (tab === 'AI & ML') {
                    const el = document.getElementById('project-compliance-x');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === tab || (filter === ('AI / ML' as any) && tab === 'AI & ML')
                    ? 'bg-[#c586c0] text-white font-semibold shadow-sm'
                    : 'text-[#aab2c0] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Panels: Content-height, 32px vertical padding, one hairline between panels */}
        <div className="space-y-0 divide-y divide-white/[0.06]">
          {filteredProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={project.id}
                id={`project-${project.id}`}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8"
              >
                {/* Text Content Column: Always on the LEFT in all four panels */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Big Outlined Index (about 64px) */}
                  <div>
                    <span className="font-mono text-[52px] sm:text-[60px] font-black text-transparent [-webkit-text-stroke:1.5px_#c586c0] leading-none">
                      {project.index}
                    </span>
                  </div>

                  {/* VS Code CodeLens: Render "Run" ONLY if liveUrl exists */}
                  <div className="flex items-center space-x-2 text-[12px] font-mono text-[#aab2c0]/70 select-none">
                    {project.liveUrl && (
                      <>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#c586c0] transition-colors flex items-center space-x-1"
                          title="Run live demo"
                        >
                          <span className="text-[#4ec9b0]">▶</span>
                          <span>Run</span>
                        </a>
                        <span className="text-white/20">|</span>
                      </>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#c586c0] transition-colors"
                      title="View source repository"
                    >
                      View code
                    </a>
                  </div>

                  {/* Project Name with Inline Year (year in mono at 60% opacity) */}
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#f4f6fb] flex items-baseline flex-wrap">
                    <span>{project.title}</span>
                    <span className="font-mono text-base sm:text-lg font-normal opacity-60 ml-2.5">
                      · {project.year}
                    </span>
                  </h3>

                  {/* One Plain Sentence */}
                  <p className="text-[17px] text-[#f4f6fb] font-medium leading-relaxed [text-wrap:pretty]">
                    {project.description}
                  </p>

                  {/* Two-Line Before / After */}
                  <div className="space-y-1.5 font-sans text-sm">
                    <div className="px-3 py-1.5 rounded-xl bg-red-950/25 border border-red-500/20 text-red-200">
                      <strong className="text-red-400 font-mono text-xs block mb-0.5">- Before:</strong>
                      {project.before}
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-950/25 border border-emerald-500/20 text-emerald-200">
                      <strong className="text-emerald-400 font-mono text-xs block mb-0.5">+ After:</strong>
                      {project.after}
                    </div>
                  </div>

                  {/* Result Line */}
                  <div className="text-sm font-mono text-[#aab2c0]">
                    <span className="text-[#c586c0] font-bold">Result: </span>
                    <span>{project.result}</span>
                  </div>

                  {/* Tech Tags (Max 6, one style, using <Term> tooltip) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 rounded-lg bg-[#181c25] border border-white/[0.08] text-xs font-mono text-[#f4f6fb]"
                      >
                        <Term term={tag}>{tag}</Term>
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons: Render Live demo ONLY if a real URL exists */}
                  <div className="flex items-center space-x-3 pt-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-medium transition-all cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View code</span>
                    </a>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#c586c0] hover:bg-[#b072ab] text-white text-xs font-mono font-medium shadow-md transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Signature Animated Visual Column: Always on the RIGHT in all four panels */}
                <div className="lg:col-span-6">
                  {getVisual(project.id)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Narrator Link at End */}
        <div className="pt-6 border-t border-white/[0.08]">
          <button
            onClick={handleScrollToSkills}
            className="font-mono text-xs text-[#aab2c0]/60 hover:text-[#c586c0] transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>// next chapter: the tools behind them</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
