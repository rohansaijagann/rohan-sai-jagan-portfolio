import React, { createContext, useContext, useState, useEffect } from 'react';
import { SectionId, ThemeId, PeekItem } from '../types.ts';

export type MotionMode = 'full' | 'reduced';

interface WorkspaceContextType {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  lineCol: { line: number; col: number };
  setLineCol: (val: { line: number; col: number }) => void;
  hasScrolled: boolean;
  setHasScrolled: (val: boolean) => void;

  // Color Theme
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  isThemePickerOpen: boolean;
  setIsThemePickerOpen: (open: boolean) => void;

  // Motion Mode (full vs reduced) with user override & OS detection
  motionMode: MotionMode;
  isReducedMotion: boolean;
  toggleMotionMode: () => void;

  // Active Phrase-driven Accent Color (tints glows, caret, rings, etc.)
  phraseAccent: string;
  setPhraseAccent: (color: string) => void;

  // Integrated Terminal Panel
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  terminalTab: 'terminal' | 'problems';
  setTerminalTab: (tab: 'terminal' | 'problems') => void;
  openTerminal: (tab?: 'terminal' | 'problems') => void;

  // Shortcuts Modal
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;

  // Peek Definition
  peekItem: PeekItem | null;
  setPeekItem: (item: PeekItem | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [lineCol, setLineCol] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Theme state with localStorage persistence
  const [theme, setThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('rohan_portfolio_theme') as ThemeId;
      if (saved && ['dark-plus', 'tokyo-night', 'dracula', 'monokai'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'dark-plus';
  });

  // Motion Mode state: localStorage override > OS setting > 'full' default
  const [motionMode, setMotionModeState] = useState<MotionMode>(() => {
    if (typeof window === 'undefined') return 'full';
    try {
      const saved = localStorage.getItem('rohan_portfolio_motion');
      if (saved === 'full' || saved === 'reduced') {
        return saved as MotionMode;
      }
    } catch {
      // ignore
    }
    const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return osReduced ? 'reduced' : 'full';
  });

  // Phrase-driven accent color (default blue #569cd6)
  const [phraseAccent, setPhraseAccent] = useState<string>('#569cd6');

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'problems'>('terminal');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [peekItem, setPeekItem] = useState<PeekItem | null>(null);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('rohan_portfolio_theme', newTheme);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync motion mode attribute and console log on mount/change
  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motionMode);

    let reason = 'default';
    try {
      const saved = localStorage.getItem('rohan_portfolio_motion');
      const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (saved === 'full' || saved === 'reduced') {
        reason = 'user override';
      } else if (osReduced) {
        reason = 'OS setting';
      }
    } catch {
      // ignore
    }
    console.log(`[Motion] ${motionMode} mode active (${reason})`);
  }, [motionMode]);

  // Toggle user override between full and reduced
  const toggleMotionMode = () => {
    const next: MotionMode = motionMode === 'full' ? 'reduced' : 'full';
    setMotionModeState(next);
    try {
      localStorage.setItem('rohan_portfolio_motion', next);
    } catch {
      // ignore
    }
  };

  // Sync CSS variable --phrase-accent
  useEffect(() => {
    document.documentElement.style.setProperty('--phrase-accent', phraseAccent);
  }, [phraseAccent]);

  const openTerminal = (tab: 'terminal' | 'problems' = 'terminal') => {
    setTerminalTab(tab);
    setIsTerminalOpen(true);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeSection,
        setActiveSection,
        lineCol,
        setLineCol,
        hasScrolled,
        setHasScrolled,
        theme,
        setTheme,
        isThemePickerOpen,
        setIsThemePickerOpen,
        motionMode,
        isReducedMotion: motionMode === 'reduced',
        toggleMotionMode,
        phraseAccent,
        setPhraseAccent,
        isTerminalOpen,
        setIsTerminalOpen,
        terminalTab,
        setTerminalTab,
        openTerminal,
        isShortcutsOpen,
        setIsShortcutsOpen,
        peekItem,
        setPeekItem,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useTheme = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
