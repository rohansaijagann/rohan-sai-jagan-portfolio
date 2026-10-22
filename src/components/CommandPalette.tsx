import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  FileCode2,
  Sparkles,
  Download,
  ExternalLink,
  Terminal,
  Coffee,
  Box,
  Flame,
  Palette,
  Keyboard,
  CheckCircle2,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (sectionId: string) => void;
}

interface PaletteAction {
  id: string;
  category: 'Section' | 'Project' | 'Command' | 'Link';
  label: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onJumpToSection,
}) => {
  const { openTerminal, setIsThemePickerOpen, setIsShortcutsOpen } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSkating, setIsSkating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Show a toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Easter Egg 1: sudo build something great
  const triggerConfettiEasterEgg = () => {
    const scalar = 2;
    const bracket = confetti.shapeFromText({ text: '{ }', scalar });
    const arrow = confetti.shapeFromText({ text: '=>', scalar });
    const tag = confetti.shapeFromText({ text: '</>', scalar });
    const semi = confetti.shapeFromText({ text: ';', scalar });

    confetti({
      shapes: [bracket, arrow, tag, semi],
      scalar,
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#569cd6', '#4ec9b0', '#ce9178', '#dcdcaa', '#c586c0'],
    });

    onClose();
    onJumpToSection('contact');
    setTimeout(() => {
      const msgField = document.getElementById('contact-message');
      if (msgField) {
        msgField.focus();
      }
    }, 600);
  };

  // Easter Egg 2: coffee -> toast "418 · I'm a teapot"
  const triggerCoffeeEasterEgg = () => {
    onClose();
    showToast("418 · I'm a teapot");
  };

  // Easter Egg 3: rubik -> scrolls to After Hours and scrambles cube
  const triggerRubikEasterEgg = () => {
    onClose();
    onJumpToSection('after-hours');
    setTimeout(() => {
      const scrambleBtn = document.getElementById('rubik-scramble-btn');
      if (scrambleBtn) {
        scrambleBtn.click();
      }
    }, 500);
  };

  // Easter Egg 4: skate -> sends skateboard rolling across screen with an ollie
  const triggerSkateEasterEgg = () => {
    onClose();
    setIsSkating(true);
    setTimeout(() => setIsSkating(false), 3000);
  };

  const actions: PaletteAction[] = [
    // Sections
    {
      id: 'sec-home',
      category: 'Section',
      label: 'Home (home.tsx)',
      description: 'Introduction, hero title, and overview object',
      icon: FileCode2,
      action: () => onJumpToSection('home'),
      keywords: ['home', 'hero', 'start', 'intro', 'rohan'],
    },
    {
      id: 'sec-about',
      category: 'Section',
      label: 'About (about.html)',
      description: 'Background, what I do, and education details',
      icon: FileCode2,
      action: () => onJumpToSection('about'),
      keywords: ['about', 'bio', 'education', 'sjbit', 'college'],
    },
    {
      id: 'sec-after-hours',
      category: 'Section',
      label: 'After Hours (after-hours.md)',
      description: 'Training, reading, and Rubik\'s cube puzzle',
      icon: Sparkles,
      action: () => onJumpToSection('after-hours'),
      keywords: ['after', 'hours', 'rubik', 'cube', 'box', 'skate', 'training', 'reading'],
    },
    {
      id: 'sec-projects',
      category: 'Section',
      label: 'Projects (projects.js)',
      description: 'Featured systems: ComplianceX, TerraGuard, DrowsiGuard, DocuMind AI',
      icon: FileCode2,
      action: () => onJumpToSection('projects'),
      keywords: ['projects', 'work', 'code', 'apps', 'compliance', 'terraguard'],
    },
    {
      id: 'sec-skills',
      category: 'Section',
      label: 'Skills (skills.json)',
      description: 'Living interactive pipelines for web apps, AI, and systems',
      icon: FileCode2,
      action: () => onJumpToSection('skills'),
      keywords: ['skills', 'tools', 'pipeline', 'stack', 'tech', 'python', 'react'],
    },
    {
      id: 'sec-experience',
      category: 'Section',
      label: 'Experience (experience.ts)',
      description: 'Git-graph timeline of leadership and hackathon operations',
      icon: FileCode2,
      action: () => onJumpToSection('experience'),
      keywords: ['experience', 'hackathon', 'sjbit', 'leadership', 'events'],
    },
    {
      id: 'sec-resume',
      category: 'Section',
      label: 'Resume (resume.pdf)',
      description: 'One page, preview, download, and print actions',
      icon: FileCode2,
      action: () => onJumpToSection('resume'),
      keywords: ['resume', 'cv', 'pdf', 'download', 'print'],
    },
    {
      id: 'sec-contact',
      category: 'Section',
      label: 'Contact (contact)',
      description: 'Terminal interactive message prompt & email reach',
      icon: FileCode2,
      action: () => onJumpToSection('contact'),
      keywords: ['contact', 'email', 'message', 'touch', 'terminal'],
    },

    // Projects Direct Jump
    {
      id: 'proj-compliance-x',
      category: 'Project',
      label: 'ComplianceX',
      description: 'Semantic clause retrieval with FastAPI & ChromaDB',
      icon: Sparkles,
      action: () => onJumpToSection('projects'),
      keywords: ['compliance', 'rag', 'chroma', 'legal'],
    },
    {
      id: 'proj-terraguard',
      category: 'Project',
      label: 'TerraGuard',
      description: 'Wildfire risk scoring and interactive Leaflet map',
      icon: Flame,
      action: () => onJumpToSection('projects'),
      keywords: ['terraguard', 'wildfire', 'maps', 'ml'],
    },
    {
      id: 'proj-drowsiguard',
      category: 'Project',
      label: 'DrowsiGuard',
      description: 'Driver fatigue detection using OpenCV & TensorFlow',
      icon: Sparkles,
      action: () => onJumpToSection('projects'),
      keywords: ['drowsiguard', 'vision', 'opencv', 'eyes'],
    },
    {
      id: 'proj-documind-ai',
      category: 'Project',
      label: 'DocuMind AI',
      description: 'Intelligent document Q&A engine with Gemini API citations',
      icon: Sparkles,
      action: () => onJumpToSection('projects'),
      keywords: ['documind', 'rag', 'gemini', 'sources'],
    },

    // Commands
    {
      id: 'cmd-toggle-terminal',
      category: 'Command',
      label: 'View: Toggle Integrated Terminal',
      description: 'Slide up interactive shell panel (Ctrl+`)',
      icon: Terminal,
      action: () => {
        onClose();
        openTerminal('terminal');
      },
      keywords: ['terminal', 'bash', 'shell', 'console', 'cli'],
    },
    {
      id: 'cmd-problems',
      category: 'Command',
      label: 'View: Focus Problems (0 errors, 0 warnings)',
      description: 'Open workspace problems and diagnostics tab',
      icon: CheckCircle2,
      action: () => {
        onClose();
        openTerminal('problems');
      },
      keywords: ['problems', 'errors', 'warnings', 'lint', 'check'],
    },
    {
      id: 'cmd-color-theme',
      category: 'Command',
      label: 'Preferences: Color Theme',
      description: 'Choose between 4 curated dark themes (Ctrl+K Ctrl+T)',
      icon: Palette,
      action: () => {
        onClose();
        setIsThemePickerOpen(true);
      },
      keywords: ['theme', 'color', 'dark', 'tokyo', 'dracula', 'monokai'],
    },
    {
      id: 'cmd-shortcuts',
      category: 'Command',
      label: 'Preferences: Open Keyboard Shortcuts',
      description: 'View complete list of editor shortcuts (Ctrl+K Ctrl+S)',
      icon: Keyboard,
      action: () => {
        onClose();
        setIsShortcutsOpen(true);
      },
      keywords: ['shortcuts', 'keys', 'keybindings', 'hotkeys', 'help'],
    },
    {
      id: 'cmd-download-resume',
      category: 'Command',
      label: 'Download Resume (PDF)',
      description: 'Save Rohan_Sai_Jagan_Resume.pdf directly to your machine',
      icon: Download,
      action: () => {
        const link = document.createElement('a');
        link.href = PERSONAL_INFO.resumePdfUrl;
        link.download = 'Rohan_Sai_Jagan_Resume.pdf';
        link.click();
      },
      keywords: ['download', 'resume', 'pdf', 'cv'],
    },
    {
      id: 'cmd-easter-egg-build',
      category: 'Command',
      label: 'sudo build something great',
      description: 'Easter egg command: trigger code confetti & focus contact message',
      icon: Terminal,
      action: triggerConfettiEasterEgg,
      keywords: ['sudo', 'build', 'something', 'great', 'confetti', 'secret', 'easter egg'],
    },
    {
      id: 'cmd-easter-egg-coffee',
      category: 'Command',
      label: 'coffee',
      description: 'Easter egg: 418 · I\'m a teapot',
      icon: Coffee,
      action: triggerCoffeeEasterEgg,
      keywords: ['coffee', 'tea', 'teapot', '418'],
    },
    {
      id: 'cmd-easter-egg-rubik',
      category: 'Command',
      label: 'rubik',
      description: 'Easter egg: scroll to After Hours and scramble the 3D cube',
      icon: Box,
      action: triggerRubikEasterEgg,
      keywords: ['rubik', 'cube', 'puzzle', 'scramble'],
    },
    {
      id: 'cmd-easter-egg-skate',
      category: 'Command',
      label: 'skate',
      description: 'Easter egg: roll a skateboard across the bottom of the screen with an ollie',
      icon: Sparkles,
      action: triggerSkateEasterEgg,
      keywords: ['skate', 'skateboard', 'ollie', 'trick'],
    },

    // Links
    {
      id: 'link-github',
      category: 'Link',
      label: 'GitHub Profile',
      description: 'github.com/rohansaijagann',
      icon: ExternalLink,
      action: () => window.open(PERSONAL_INFO.github, '_blank'),
      keywords: ['github', 'code', 'repo'],
    },
    {
      id: 'link-linkedin',
      category: 'Link',
      label: 'LinkedIn Profile',
      description: 'linkedin.com/in/rohan-sai-jagan',
      icon: ExternalLink,
      action: () => window.open(PERSONAL_INFO.linkedin, '_blank'),
      keywords: ['linkedin', 'social', 'network'],
    },
    {
      id: 'link-medium',
      category: 'Link',
      label: 'Medium Blog',
      description: 'medium.com/@rohansaijagan',
      icon: ExternalLink,
      action: () => window.open(PERSONAL_INFO.medium, '_blank'),
      keywords: ['medium', 'blog', 'articles'],
    },
    {
      id: 'link-leetcode',
      category: 'Link',
      label: 'LeetCode Profile',
      description: 'leetcode.com/rohansaijagann',
      icon: ExternalLink,
      action: () => window.open(PERSONAL_INFO.leetcode, '_blank'),
      keywords: ['leetcode', 'dsa', 'problems'],
    },
  ];

  const filtered = actions.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    if (q === 'sudo build something great') return item.id === 'cmd-easter-egg-build';
    if (q === 'coffee') return item.id === 'cmd-easter-egg-coffee';
    if (q === 'rubik') return item.id === 'cmd-easter-egg-rubik';
    if (q === 'skate') return item.id === 'cmd-easter-egg-skate';

    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const q = query.trim().toLowerCase();
    if (q === 'sudo build something great' && e.key === 'Enter') {
      e.preventDefault();
      triggerConfettiEasterEgg();
      return;
    }
    if (q === 'coffee' && e.key === 'Enter') {
      e.preventDefault();
      triggerCoffeeEasterEgg();
      return;
    }
    if (q === 'rubik' && e.key === 'Enter') {
      e.preventDefault();
      triggerRubikEasterEgg();
      return;
    }
    if (q === 'skate' && e.key === 'Enter') {
      e.preventDefault();
      triggerSkateEasterEgg();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <>
      {/* Toast Notification (e.g. coffee easter egg: 418 · I'm a teapot) */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 z-50 px-4 py-2.5 rounded-xl bg-[#181c25] border border-[#569cd6]/40 text-[#f4f6fb] font-mono text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <Coffee className="w-4 h-4 text-[#569cd6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen-Wide Skateboard Ollie Easter Egg Animation */}
      {isSkating && (
        <div
          aria-hidden="true"
          className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none overflow-hidden h-20"
        >
          <div className="animate-skate-screen flex items-center">
            <svg
              className="w-16 h-10 text-[#d16d9e] drop-shadow-[0_0_12px_#d16d9e]"
              viewBox="0 0 40 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M 4 12 C 10 14, 30 14, 36 12" strokeLinecap="round" />
              <circle cx="10" cy="18" r="3" />
              <circle cx="30" cy="18" r="3" />
              <line x1="10" y1="13" x2="10" y2="15" />
              <line x1="30" y1="13" x2="30" y2="15" />
            </svg>
          </div>
        </div>
      )}

      {/* Palette Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={onClose}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-[#181c25] border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-white/5 space-x-3 bg-[#12151c]">
              <Search className="w-4 h-4 text-[#569cd6] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command, file name, or easter egg..."
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);
                  setSelectedIndex(0);
                  const lower = val.trim().toLowerCase();
                  if (lower === 'sudo build something great') {
                    triggerConfettiEasterEgg();
                  } else if (lower === 'coffee') {
                    triggerCoffeeEasterEgg();
                  } else if (lower === 'rubik') {
                    triggerRubikEasterEgg();
                  } else if (lower === 'skate') {
                    triggerSkateEasterEgg();
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-sm text-[#f4f6fb] placeholder:text-[#aab2c0]/60 focus:outline-none font-sans"
              />
              <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[#aab2c0]">
                Esc
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs font-sans"
            >
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-[#aab2c0] text-xs">
                  No matching commands or files.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#569cd6] text-white'
                          : 'text-[#f4f6fb] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-white' : 'text-[#569cd6]'
                          }`}
                        />
                        <div className="truncate">
                          <div className="font-medium truncate">{item.label}</div>
                          <div
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-blue-100' : 'text-[#aab2c0]'
                            }`}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ml-2 shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-[#aab2c0] border border-white/5'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="px-4 py-2 bg-[#12151c] border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#aab2c0]">
              <div className="flex items-center space-x-3">
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10">↑</kbd>{' '}
                  <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10">↵</kbd> select
                </span>
              </div>
              <span className="text-[#569cd6]">Ctrl+P</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
