import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Terminal as TerminalIcon,
  AlertCircle,
  CheckCircle2,
  X,
  Trash2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData.ts';

interface TerminalPanelProps {
  isOpen: boolean;
  activeTab: 'terminal' | 'problems';
  onTabChange: (tab: 'terminal' | 'problems') => void;
  onClose: () => void;
  onJumpToSection: (sectionId: string) => void;
}

interface LogEntry {
  id: string;
  type: 'command' | 'output' | 'error' | 'success';
  content: React.ReactNode;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  onJumpToSection,
}) => {
  const [panelHeight, setPanelHeight] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'output',
      content: (
        <div className="space-y-1 text-[#aab2c0]">
          <div className="text-[#569cd6] font-semibold">
            Rohan Sai Jagan — Interactive Developer Shell [v2.4.0]
          </div>
          <div>Type <span className="text-[#dcdcaa] font-bold">help</span> to list all commands. Press <span className="text-[#dcdcaa]">Esc</span> to exit.</div>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const initialHeightRef = useRef(280);

  // Auto focus input when opened or tab changed to terminal
  useEffect(() => {
    if (isOpen && activeTab === 'terminal') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, activeTab]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle drag resize
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    initialHeightRef.current = panelHeight;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(160, Math.min(600, initialHeightRef.current + delta));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const commandEntry: LogEntry = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: (
        <div className="flex items-center space-x-2 text-white">
          <span className="text-[#6a9955]">rohan@portfolio:~$</span>
          <span>{cmd}</span>
        </div>
      ),
    };

    const lower = cmd.toLowerCase();
    let responseEntry: LogEntry;

    if (lower === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (lower === 'help') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-1.5 text-xs text-[#aab2c0]">
            <div className="text-white font-semibold mb-1">Commands:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono">
              <div><span className="text-[#dcdcaa] font-semibold">whoami</span> - About Rohan & philosophy</div>
              <div><span className="text-[#dcdcaa] font-semibold">projects</span> - View projects with jump links</div>
              <div><span className="text-[#dcdcaa] font-semibold">skills</span> - List technology constellations</div>
              <div><span className="text-[#dcdcaa] font-semibold">hobbies</span> - Print Off-the-keyboard list</div>
              <div><span className="text-[#dcdcaa] font-semibold">contact</span> - Reach out via email or location</div>
              <div><span className="text-[#dcdcaa] font-semibold">resume</span> - Download verified resume PDF</div>
              <div><span className="text-[#dcdcaa] font-semibold">clear</span> - Clear terminal buffer</div>
              <div><span className="text-[#dcdcaa] font-semibold">sudo build something great</span> - Easter egg</div>
            </div>
          </div>
        ),
      };
    } else if (lower === 'whoami') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-1 text-xs text-[#f4f6fb]">
            <div className="text-[#569cd6] font-bold">Rohan Sai Jagan</div>
            <div className="text-[#aab2c0]">Software Developer · Bengaluru, India</div>
            <div className="text-[#6a9955] mt-1">// "Code is my canvas. Everything I make is art that happens to run."</div>
          </div>
        ),
      };
    } else if (lower === 'projects') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-2 text-xs">
            <div className="text-[#569cd6] font-semibold">Featured Work (Click to jump):</div>
            <div className="space-y-1.5">
              {PROJECTS.map((proj) => (
                <div key={proj.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onJumpToSection('projects');
                      onClose();
                    }}
                    className="text-[#dcdcaa] hover:text-white underline font-mono text-left flex items-center space-x-1 cursor-pointer"
                  >
                    <span>[{proj.index}] {proj.title} ({proj.year})</span>
                    <ExternalLink className="w-3 h-3 text-[#569cd6]" />
                  </button>
                  <span className="text-[#aab2c0]/70">— {proj.description}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      };
    } else if (lower === 'skills') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-1.5 text-xs text-[#aab2c0]">
            <div className="text-[#569cd6] font-semibold">Technology Constellations:</div>
            <div>• <strong className="text-white">languages:</strong> Python, TypeScript, JavaScript, Java, SQL, HTML, CSS</div>
            <div>• <strong className="text-white">web:</strong> React, Next.js, Tailwind CSS, Vite, Leaflet.js</div>
            <div>• <strong className="text-white">backend:</strong> FastAPI, Pydantic, REST APIs, Docker</div>
            <div>• <strong className="text-white">data:</strong> PostgreSQL, MySQL, ChromaDB, Pandas, NumPy, GeoJSON</div>
            <div>• <strong className="text-white">ai-and-vision:</strong> TensorFlow, Keras, OpenCV, Scikit-learn, Gemini API, LangGraph, RAG</div>
            <div>• <strong className="text-white">tools-and-cloud:</strong> Git, GitHub, VS Code, Postman, Linux, Bash, Vercel, AWS</div>
          </div>
        ),
      };
    } else if (lower === 'hobbies') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-1 text-xs text-[#aab2c0] font-mono">
            <div className="text-[#d16d9e] font-semibold">// CHANGELOG.md · After Hours</div>
            <div className="text-[#6a9955] font-bold">## Training</div>
            <div>+ Boxing, lifting, running, cycling, hiking, swimming. Movement is how I reset.</div>
            <div>+ I coach a few beginners for fun. Watching someone land their first real rep never gets old.</div>
            <div className="text-[#6a9955] font-bold mt-1">## Off-screen</div>
            <div>+ Good movie out? I'm there on day one, front of the queue.</div>
            <div>+ Books and podcasts when I want to refill the tank.</div>
            <div>+ Style and grooming. Good design applies to people too.</div>
            <div>+ Family time, always.</div>
            <div className="text-[#6a9955] font-bold mt-1">## Latest release</div>
            <div>+ Solved the Rubik's cube.</div>
            <div>+ Learned to skateboard.</div>
          </div>
        ),
      };
    } else if (lower === 'contact') {
      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'output',
        content: (
          <div className="space-y-1 text-xs text-[#aab2c0]">
            <div className="text-[#6a9955] font-semibold">Contact Coordinates:</div>
            <div>Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white underline">{PERSONAL_INFO.email}</a></div>
            <div>Location: <span className="text-white">{PERSONAL_INFO.location}</span></div>
            <div>GitHub: <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="text-[#569cd6] underline">github.com/rohansaijagann</a></div>
            <div>LinkedIn: <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#569cd6] underline">linkedin.com/in/rohan-sai-jagan</a></div>
          </div>
        ),
      };
    } else if (lower === 'resume') {
      const link = document.createElement('a');
      link.href = PERSONAL_INFO.resumePdfUrl;
      link.download = 'Rohan_Sai_Jagan_Resume.pdf';
      link.click();

      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'success',
        content: (
          <div className="text-emerald-400 text-xs">
            ✓ Downloading verified resume: Rohan_Sai_Jagan_Resume.pdf
          </div>
        ),
      };
    } else if (lower === 'sudo build something great') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#569cd6', '#4ec9b0', '#ce9178', '#dcdcaa', '#c586c0'],
      });

      responseEntry = {
        id: `out-${Date.now()}`,
        type: 'success',
        content: (
          <div className="text-[#4ec9b0] font-bold text-xs space-y-1">
            <div>✓ Permission granted. Building something great with code.</div>
            <div className="text-xs text-[#aab2c0] font-normal">
              Keep building, keep training, keep learning.
            </div>
          </div>
        ),
      };
    } else {
      responseEntry = {
        id: `err-${Date.now()}`,
        type: 'error',
        content: (
          <div className="text-red-400 text-xs font-mono">
            command not found: {cmd}. Try help.
          </div>
        ),
      };
    }

    setLogs((prev) => [...prev, commandEntry, responseEntry]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Integrated Terminal and Problems Panel"
      className="absolute bottom-6 left-0 right-0 z-30 bg-[#12151c] border-t-2 border-white/10 flex flex-col shadow-2xl font-mono text-xs select-text animate-in slide-in-from-bottom duration-200"
      style={{ height: `${panelHeight}px` }}
    >
      {/* Drag Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        aria-hidden="true"
        className="w-full h-1.5 cursor-ns-resize hover:bg-[#007acc] transition-colors shrink-0 flex items-center justify-center"
        title="Drag to resize terminal panel"
      >
        <div className="w-12 h-0.5 rounded-full bg-white/20" />
      </div>

      {/* Top Tab Bar */}
      <div className="h-9 px-3 bg-[#181c25] border-b border-white/5 flex items-center justify-between shrink-0 select-none">
        {/* Left Tabs */}
        <div className="flex items-center space-x-1">
          {/* Terminal Tab */}
          <button
            onClick={() => onTabChange('terminal')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-[#12151c] text-white font-semibold border-b-2 border-[#007acc]'
                : 'text-[#aab2c0] hover:text-white hover:bg-white/5'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-[#569cd6]" />
            <span>TERMINAL</span>
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => onTabChange('problems')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeTab === 'problems'
                ? 'bg-[#12151c] text-white font-semibold border-b-2 border-[#007acc]'
                : 'text-[#aab2c0] hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROBLEMS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              0
            </span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-2 text-[#aab2c0]">
          {activeTab === 'terminal' && (
            <button
              onClick={() => setLogs([])}
              title="Clear Terminal Output"
              className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            title="Close Panel (Esc)"
            className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'terminal' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0c10] p-3 text-xs overflow-hidden">
          {/* Output log */}
          <div
            ref={logContainerRef}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar font-mono"
          >
            {logs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                {log.content}
              </div>
            ))}
          </div>

          {/* Prompt line input */}
          <div className="flex items-center space-x-2 pt-2 border-t border-white/5 mt-2">
            <span className="text-[#6a9955] shrink-0 font-bold">rohan@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              aria-label="Terminal command input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type help or a command..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-[#aab2c0]/40 font-mono text-xs"
            />
          </div>
        </div>
      ) : (
        /* Problems View */
        <div className="flex-1 bg-[#0a0c10] p-6 flex flex-col items-center justify-center text-center space-y-3 overflow-y-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-semibold text-sm">
              No problems have been detected in the workspace.
            </h3>
            <p className="text-xs text-[#aab2c0] font-sans max-w-md">
              0 errors, 0 warnings. All 7 chapter source files validated cleanly with TypeScript and React 19.
            </p>
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#181c25] border border-white/10 text-[11px] text-[#6a9955]">
            <span>✓ Clean build</span>
            <span>·</span>
            <span>TypeScript 5.7</span>
          </div>
        </div>
      )}
    </div>
  );
};
