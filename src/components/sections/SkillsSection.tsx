import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { Accent } from '../Accent.tsx';
import { Term } from '../Term.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';

// =========================================================================
// SCENE A: PERIODIC TABLE SPEC
// =========================================================================
interface PeriodicTile {
  symbol: string;
  name: string;
  key: string;
}

interface PeriodicRow {
  rowKey: string;
  color: string;
  tiles: PeriodicTile[];
}

const PERIODIC_ROWS: PeriodicRow[] = [
  {
    rowKey: 'languages',
    color: '#569cd6', // Blue
    tiles: [
      { symbol: 'Js', name: 'JavaScript', key: 'javascript' },
      { symbol: 'Ts', name: 'TypeScript', key: 'typescript' },
      { symbol: 'Py', name: 'Python', key: 'python' },
      { symbol: 'Ja', name: 'Java', key: 'java' },
      { symbol: 'Sq', name: 'SQL', key: 'sql' },
    ],
  },
  {
    rowKey: 'web',
    color: '#4ec9b0', // Teal
    tiles: [
      { symbol: 'Re', name: 'React', key: 'react' },
      { symbol: 'Nx', name: 'Next.js', key: 'next.js' },
      { symbol: 'Ht', name: 'HTML', key: 'html' },
      { symbol: 'Cs', name: 'CSS', key: 'css' },
      { symbol: 'Tw', name: 'Tailwind', key: 'tailwind' },
      { symbol: 'Vt', name: 'Vite', key: 'vite' },
      { symbol: 'Lf', name: 'Leaflet.js', key: 'leaflet.js' },
      { symbol: 'Mo', name: 'Motion', key: 'motion' },
    ],
  },
  {
    rowKey: 'backend & data',
    color: '#ce9178', // Orange
    tiles: [
      { symbol: 'Fa', name: 'FastAPI', key: 'fastapi' },
      { symbol: 'Pd', name: 'Pydantic', key: 'pydantic' },
      { symbol: 'Rs', name: 'REST APIs', key: 'rest apis' },
      { symbol: 'Pg', name: 'PostgreSQL', key: 'postgresql' },
      { symbol: 'My', name: 'MySQL', key: 'mysql' },
      { symbol: 'Ch', name: 'ChromaDB', key: 'chromadb' },
    ],
  },
  {
    rowKey: 'ai & vision',
    color: '#c586c0', // Purple
    tiles: [
      { symbol: 'Tf', name: 'TensorFlow', key: 'tensorflow' },
      { symbol: 'Ke', name: 'Keras', key: 'keras' },
      { symbol: 'Cv', name: 'OpenCV', key: 'opencv' },
      { symbol: 'Sk', name: 'Scikit-learn', key: 'scikit-learn' },
      { symbol: 'Np', name: 'NumPy', key: 'numpy' },
      { symbol: 'Pa', name: 'Pandas', key: 'pandas' },
      { symbol: 'Lg', name: 'LangGraph', key: 'langgraph' },
      { symbol: 'Ge', name: 'Gemini API', key: 'gemini api' },
      { symbol: 'Rg', name: 'RAG', key: 'rag' },
    ],
  },
  {
    rowKey: 'tools & cloud',
    color: '#6a9955', // Green
    tiles: [
      { symbol: 'Gi', name: 'Git', key: 'git' },
      { symbol: 'Gh', name: 'GitHub', key: 'github' },
      { symbol: 'Dk', name: 'Docker', key: 'docker' },
      { symbol: 'Lx', name: 'Linux', key: 'linux' },
      { symbol: 'Pm', name: 'Postman', key: 'postman' },
      { symbol: 'Vs', name: 'VS Code', key: 'vs code' },
      { symbol: 'Ve', name: 'Vercel', key: 'vercel' },
      { symbol: 'Aw', name: 'AWS', key: 'aws' },
      { symbol: 'Ba', name: 'Bash', key: 'bash' },
    ],
  },
];

const PROJECT_HIGHLIGHT_MAP: Record<string, { color: string; tools: string[]; projectId: string }> = {
  ComplianceX: {
    color: '#569cd6',
    projectId: 'compliance-x',
    tools: ['react', 'typescript', 'python', 'fastapi', 'pydantic', 'chromadb', 'docker', 'rest apis'],
  },
  TerraGuard: {
    color: '#dcdcaa',
    projectId: 'terraguard',
    tools: ['python', 'fastapi', 'scikit-learn', 'leaflet.js', 'pandas', 'numpy'],
  },
  DrowsiGuard: {
    color: '#c586c0',
    projectId: 'driver-drowsiness',
    tools: ['python', 'tensorflow', 'keras', 'opencv', 'numpy'],
  },
  'DocuMind AI': {
    color: '#4ec9b0',
    projectId: 'ai-doc-assistant',
    tools: ['python', 'fastapi', 'react', 'chromadb', 'gemini api', 'rag', 'langgraph'],
  },
};

// =========================================================================
// SCENE B: LIVING PIPELINES SPEC
// =========================================================================
interface PipelineNode {
  title: string;
  description: string;
  tools: string[];
}

interface PipelineScene {
  id: string;
  tabLabel: string;
  projectName: string;
  projectId: string;
  accent: string;
  nodes: PipelineNode[];
}

const PIPELINES: PipelineScene[] = [
  {
    id: 'web-app',
    tabLabel: 'Web app / ComplianceX',
    projectName: 'ComplianceX',
    projectId: 'compliance-x',
    accent: '#569cd6',
    nodes: [
      {
        title: 'You click',
        description: 'Someone opens the app in their browser.',
        tools: ['User Event'],
      },
      {
        title: 'The screen',
        description: 'What people see and touch.',
        tools: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite'],
      },
      {
        title: 'The server',
        description: 'Where the logic lives.',
        tools: ['Python', 'FastAPI', 'REST APIs'],
      },
      {
        title: 'The data',
        description: 'Where everything is stored.',
        tools: ['PostgreSQL', 'MySQL'],
      },
      {
        title: 'Shipped',
        description: 'Packaged, versioned, and live.',
        tools: ['Docker', 'Git and GitHub', 'Vercel', 'Linux', 'AWS basics'],
      },
    ],
  },
  {
    id: 'document-ai',
    tabLabel: 'Document AI / DocuMind AI',
    projectName: 'DocuMind AI',
    projectId: 'ai-doc-assistant',
    accent: '#4ec9b0',
    nodes: [
      {
        title: 'You ask',
        description: 'A question in plain English.',
        tools: ['User Prompt'],
      },
      {
        title: 'The screen',
        description: 'Streaming conversation interface.',
        tools: ['React', 'TypeScript'],
      },
      {
        title: 'The server',
        description: 'Token chunking and context pipeline.',
        tools: ['FastAPI', 'Python'],
      },
      {
        title: 'The memory',
        description: 'Finds the right pages by meaning.',
        tools: ['ChromaDB', 'RAG'],
      },
      {
        title: 'The brain',
        description: 'Writes the answer, with its sources.',
        tools: ['Gemini API', 'LangGraph'],
      },
    ],
  },
  {
    id: 'computer-vision',
    tabLabel: 'Computer vision / DrowsiGuard',
    projectName: 'DrowsiGuard',
    projectId: 'driver-drowsiness',
    accent: '#c586c0',
    nodes: [
      {
        title: 'Camera',
        description: 'Live video comes in.',
        tools: ['Camera Feed'],
      },
      {
        title: 'Face finder',
        description: 'Spots the face and eyes frame by frame.',
        tools: ['OpenCV'],
      },
      {
        title: 'The model',
        description: 'Decides: eyes open or closed?',
        tools: ['TensorFlow', 'Keras', 'NumPy'],
      },
      {
        title: 'Alert',
        description: 'Sounds the alarm in time.',
        tools: ['Python', 'Audio Alert'],
      },
    ],
  },
  {
    id: 'prediction',
    tabLabel: 'Prediction / TerraGuard',
    projectName: 'TerraGuard',
    projectId: 'terraguard',
    accent: '#dcdcaa',
    nodes: [
      {
        title: 'Data',
        description: 'Weather and map data come in.',
        tools: ['Pandas', 'NumPy'],
      },
      {
        title: 'The model',
        description: 'Scores wildfire risk by area.',
        tools: ['Scikit-learn', 'Python'],
      },
      {
        title: 'The server',
        description: 'Calculates risk vectors in real time.',
        tools: ['FastAPI'],
      },
      {
        title: 'The map',
        description: 'Makes the risk visible.',
        tools: ['Leaflet.js'],
      },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  // Scene A state
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);

  // Scene B state
  const [activePipelineId, setActivePipelineId] = useState('web-app');
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isHoveredRef = useRef(false);

  const currentPipeline = PIPELINES.find((p) => p.id === activePipelineId) || PIPELINES[0];

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Living Pipeline packet animation loop (~6s total loop, ~700ms pause per node)
  useEffect(() => {
    if (prefersReducedMotion || !isPlaying) return;

    const nodeCount = currentPipeline.nodes.length;
    const interval = setInterval(() => {
      if (!isHoveredRef.current) {
        setActiveNodeIndex((prev) => (prev + 1) % nodeCount);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentPipeline.nodes.length, isPlaying, prefersReducedMotion]);

  const handleToggleHighlight = (projName: string) => {
    setHighlightedProject((prev) => (prev === projName ? null : projName));
  };

  const handleScrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-snap-item pt-16 pb-8 sm:pt-16 sm:pb-8 relative overflow-visible"
    >
      {/* Section Watermark 05 */}
      <SectionWatermark index="05" />

      {/* Accent Yellow Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#dcdcaa]/10 blur-[160px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-16 relative z-10">
        {/* =========================================================================
            SCENE A: THE PERIODIC TABLE
        ========================================================================= */}
        <div className="space-y-7">
          {/* Eyebrow & Heading */}
          <div className="space-y-3 pb-3 border-b border-white/[0.08]">
            <div className="font-mono text-[13px] text-[#dcdcaa]">
              // chapter 05 · skills.json
            </div>
            <h2
              id="skills-heading"
              className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
            >
              Everything I <Accent color="#dcdcaa">use</Accent>.
              <SectionAnchor sectionId="skills" />
            </h2>
            <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
              My tools, laid out like a periodic table.
            </p>
          </div>

          {/* Project Highlight Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-3 text-xs font-mono">
            <span className="text-[#aab2c0]">Highlight a project:</span>
            {Object.keys(PROJECT_HIGHLIGHT_MAP).map((name) => {
              const isSelected = highlightedProject === name;
              const meta = PROJECT_HIGHLIGHT_MAP[name];

              return (
                <button
                  key={name}
                  onClick={() => handleToggleHighlight(name)}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 text-white font-semibold shadow-xs'
                      : 'border-white/10 text-[#aab2c0] hover:text-white hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? meta.color : undefined,
                    color: isSelected ? meta.color : undefined,
                  }}
                >
                  {name}
                </button>
              );
            })}

            {highlightedProject && (
              <button
                onClick={() => handleScrollToSection(`project-${PROJECT_HIGHLIGHT_MAP[highlightedProject].projectId}`)}
                className="ml-auto inline-flex items-center space-x-1.5 text-xs font-mono text-[#dcdcaa] hover:underline cursor-pointer"
              >
                <span>See it in action: {highlightedProject}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Periodic Table Rows: 5 Rows, Exactly 84x84 (72px mobile), 2-letter mono 28px bold */}
          <div className="space-y-4">
            {PERIODIC_ROWS.map((row) => (
              <div
                key={row.rowKey}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
              >
                {/* JSON-key label at left (mono 13px, syntax-coloured, ~170px column) */}
                <div
                  className="font-mono text-[13px] font-semibold w-full md:w-[170px] shrink-0 tracking-wide select-none"
                  style={{ color: row.color }}
                >
                  "{row.rowKey}":
                </div>

                {/* Flex-wrapped Tiles: 84x84 (72px mobile), radius 12, hairline border */}
                <div className="flex flex-wrap gap-2.5 sm:gap-3 flex-1">
                  {row.tiles.map((tile) => {
                    const isHighlighted =
                      !highlightedProject ||
                      PROJECT_HIGHLIGHT_MAP[highlightedProject]?.tools.includes(tile.key);

                    return (
                      <div
                        key={tile.key}
                        className={`transition-opacity duration-200 ${
                          isHighlighted ? 'opacity-100' : 'opacity-30'
                        }`}
                      >
                        <Term term={tile.name}>
                          <button
                            type="button"
                            className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[12px] border border-white/[0.08] flex flex-col items-center justify-center p-1.5 text-center transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:border-white/30 focus:-translate-y-1 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-[#dcdcaa]"
                            style={{
                              backgroundColor: `${row.color}08`,
                              borderColor:
                                highlightedProject && isHighlighted
                                  ? row.color
                                  : undefined,
                            }}
                          >
                            {/* 2-letter bold mono symbol (24-28px) */}
                            <span
                              className="font-mono text-[22px] sm:text-[26px] font-extrabold leading-none tracking-tight"
                              style={{ color: row.color }}
                            >
                              {tile.symbol}
                            </span>
                            {/* Full tool name below in Geist 12-13px secondary */}
                            <span className="font-sans text-[11px] sm:text-[12px] text-[#aab2c0] leading-tight line-clamp-2 mt-1 truncate max-w-full">
                              {tile.name}
                            </span>
                          </button>
                        </Term>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Under the table: Two Quiet Mono Lines with Syntax-Coloured Keys, No Tiles */}
          <div className="pt-4 space-y-2 border-t border-white/[0.06] font-mono text-[13px] leading-relaxed select-text">
            <div>
              <span className="text-[#ce9178] font-semibold">"concepts":</span>{' '}
              <span className="text-[#aab2c0]">
                Machine learning · Deep learning · Computer vision · Generative AI · LLMs · Microservices · API-first development · Responsive design · System design basics
              </span>
            </div>
            <div>
              <span className="text-[#c586c0] font-semibold">"foundations":</span>{' '}
              <span className="text-[#aab2c0]">
                Data structures and algorithms · OOP · DBMS · Operating systems · Computer networks · SDLC
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SCENE B: HOW I BUILD (The Living Pipeline)
        ========================================================================= */}
        <div className="space-y-7 pt-4">
          {/* Heading */}
          <div className="space-y-3 pb-3 border-b border-white/[0.08]">
            <h3 className="font-heading text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-tight">
              How I <Accent color="#dcdcaa">build</Accent>.
            </h3>
            <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
              Follow one click from your screen to the answer.
            </p>
          </div>

          {/* Tab Strip with Sliding Underline & Play/Pause Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-2">
            <div
              role="tablist"
              aria-label="Living architecture pipelines"
              className="flex items-center space-x-2 overflow-x-auto no-scrollbar"
            >
              {PIPELINES.map((p) => {
                const isActive = p.id === activePipelineId;

                return (
                  <button
                    key={p.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActivePipelineId(p.id);
                      setActiveNodeIndex(0);
                    }}
                    className={`relative px-3.5 py-2 text-xs font-mono transition-colors cursor-pointer shrink-0 ${
                      isActive ? 'text-[#f4f6fb] font-semibold' : 'text-[#aab2c0] hover:text-white'
                    }`}
                  >
                    <span>{p.tabLabel}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pipeline-tab"
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ backgroundColor: p.accent }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Controls & Jump to project link */}
            <div className="flex items-center space-x-3 text-xs font-mono">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#181c25] hover:bg-white/10 text-[#aab2c0] hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause traveling packet' : 'Resume packet loop'}
              >
                {isPlaying ? <Pause className="w-3 h-3 text-[#dcdcaa]" /> : <Play className="w-3 h-3 text-emerald-400" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => handleScrollToSection(`project-${currentPipeline.projectId}`)}
                className="inline-flex items-center space-x-1 text-[#dcdcaa] hover:underline cursor-pointer"
              >
                <span>See it in action: {currentPipeline.projectName}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Open Columns Architecture Graph: hairline rules, no heavy cards */}
          <div
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] pt-2"
          >
            {currentPipeline.nodes.map((node, idx) => {
              const isActive = activeNodeIndex === idx;

              return (
                <div
                  key={node.title}
                  onClick={() => setActiveNodeIndex(idx)}
                  className={`flex flex-col justify-between pt-4 md:pt-0 md:px-4 space-y-4 transition-all duration-300 cursor-pointer ${
                    isActive ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Glowing Node Circle & Pulse */}
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-300 ${
                          isActive
                            ? 'scale-112 ring-4 ring-[#dcdcaa]/30 bg-[#dcdcaa] text-black shadow-[0_0_16px_#dcdcaa]'
                            : 'bg-white/10 text-[#aab2c0] border border-white/20'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-heading text-[18px] sm:text-[20px] font-bold text-[#f4f6fb]">
                        {node.title}
                      </span>
                    </div>

                    {/* One-line description */}
                    <p className="text-[14px] text-[#aab2c0] leading-relaxed">
                      {node.description}
                    </p>
                  </div>

                  {/* Tool chips beneath */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {node.tools.map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          isActive
                            ? 'bg-white/15 text-[#f4f6fb] border border-white/20'
                            : 'bg-white/5 text-[#aab2c0]/80 border border-white/5'
                        }`}
                      >
                        <Term term={t}>{t}</Term>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Narrator Link at End */}
        <div className="pt-6 border-t border-white/[0.08]">
          <button
            onClick={() => handleScrollToSection('experience')}
            className="font-mono text-xs text-[#aab2c0]/60 hover:text-[#dcdcaa] transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>// next chapter: the people and events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
