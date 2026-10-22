import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Code2,
  Search,
  Terminal as TerminalIcon,
  CheckCircle2,
  Clock,
  Palette,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SectionId } from '../types.ts';

const SECTION_LANGUAGE_MAP: Record<SectionId, { lang: string; file: string }> = {
  home: { lang: 'TypeScript JSX', file: 'home.tsx' },
  about: { lang: 'HTML', file: 'about.html' },
  'after-hours': { lang: 'Markdown', file: 'after-hours.md' },
  projects: { lang: 'JavaScript', file: 'projects.js' },
  skills: { lang: 'JSON', file: 'skills.json' },
  experience: { lang: 'TypeScript', file: 'experience.ts' },
  resume: { lang: 'PDF Document', file: 'resume.pdf' },
  contact: { lang: 'Terminal / CSS', file: 'contact' },
};

interface StatusBarProps {
  onOpenCommandPalette?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({ onOpenCommandPalette }) => {
  const {
    activeSection,
    lineCol,
    openTerminal,
    isTerminalOpen,
    setIsTerminalOpen,
    setIsThemePickerOpen,
    motionMode,
    toggleMotionMode,
  } = useTheme();

  const currentInfo = SECTION_LANGUAGE_MAP[activeSection] || SECTION_LANGUAGE_MAP.home;

  // Live Bengaluru Clock
  const [bengaluruTime, setBengaluruTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);
      setBengaluruTime(`Bengaluru ${timeStr} IST`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      role="contentinfo"
      aria-label="Status Bar"
      className="h-6.5 w-full flex items-center justify-between px-3 text-xs font-mono select-none z-30 shrink-0 bg-[#007acc] text-white"
    >
      {/* Left items */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Git branch */}
        <div className="flex items-center space-x-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>

        {/* Working 0 errors 0 warnings button => opens Problems tab */}
        <button
          onClick={() => openTerminal('problems')}
          className="flex items-center space-x-1 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title="0 errors, 0 warnings (Click to view Problems)"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
          <span>0 errors 0 warnings</span>
        </button>

        {/* Integrated Terminal Toggle Button */}
        <button
          onClick={() => {
            if (isTerminalOpen) {
              setIsTerminalOpen(false);
            } else {
              openTerminal('terminal');
            }
          }}
          className="hidden sm:flex items-center space-x-1 hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title="Toggle Integrated Terminal (Ctrl+`)"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>Terminal</span>
        </button>

        {/* Active File */}
        <div className="hidden md:flex items-center space-x-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <Code2 className="w-3.5 h-3.5 opacity-80" />
          <span>{currentInfo.file}</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Bengaluru Time */}
        <div
          className="hidden lg:flex items-center space-x-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default text-white/90"
          title="Current local time in Bengaluru, India"
        >
          <Clock className="w-3 h-3 text-white/80" />
          <span>{bengaluruTime}</span>
        </div>

        {/* Dynamic Ln / Col with scroll */}
        <div className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <span>Ln {lineCol.line}, Col {lineCol.col}</span>
        </div>

        {/* Motion Preference Toggle: "Motion: full / reduced" */}
        <button
          onClick={toggleMotionMode}
          className="hover:bg-white/15 px-1.5 py-0.5 rounded cursor-pointer transition-colors text-[11px]"
          title={`Motion preferences: ${motionMode} (Click to toggle user override)`}
        >
          <span>Motion: {motionMode}</span>
        </button>

        {/* Language */}
        <div className="hidden sm:inline-block hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <span>{currentInfo.lang}</span>
        </div>

        {/* Color Theme Quick Icon */}
        <button
          onClick={() => setIsThemePickerOpen(true)}
          className="p-1 rounded hover:bg-white/15 text-white transition-colors cursor-pointer"
          title="Select Color Theme (Ctrl+K Ctrl+T)"
        >
          <Palette className="w-3.5 h-3.5" />
        </button>

        {/* Working Ctrl+P Hint Button */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer text-xs"
            title="Open Command Palette (Ctrl+P)"
          >
            <Search className="w-3 h-3" />
            <span className="hidden sm:inline">Ctrl+P</span>
          </button>
        )}
      </div>
    </footer>
  );
};
