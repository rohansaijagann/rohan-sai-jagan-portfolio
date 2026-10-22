import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { TitleBar } from './components/TitleBar.tsx';
import { ActivityBar } from './components/ActivityBar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TabBar } from './components/TabBar.tsx';
import { EditorArea } from './components/EditorArea.tsx';
import { StatusBar } from './components/StatusBar.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { BootScreen } from './components/BootScreen.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { TerminalPanel } from './components/TerminalPanel.tsx';
import { ThemePickerModal } from './components/ThemePickerModal.tsx';
import { ShortcutsModal } from './components/ShortcutsModal.tsx';
import { PeekDefinitionModal } from './components/PeekDefinitionModal.tsx';
import { ContextMenu } from './components/ContextMenu.tsx';
import { NotFoundPage } from './components/NotFoundPage.tsx';
import { SectionId } from './types.ts';
import {
  Home,
  User,
  Sparkles,
  FolderGit2,
  Cpu,
  Briefcase,
  FileText,
  Mail,
  Search,
} from 'lucide-react';

const SECTIONS_ORDER: SectionId[] = [
  'home',
  'about',
  'after-hours',
  'projects',
  'skills',
  'experience',
  'resume',
  'contact',
];

const FILE_NAME_MAP: Record<SectionId, string> = {
  home: 'home.tsx',
  about: 'about.html',
  'after-hours': 'after-hours.md',
  projects: 'projects.js',
  skills: 'skills.json',
  experience: 'experience.ts',
  resume: 'resume.pdf',
  contact: 'contact',
};

const MOBILE_NAV_ITEMS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'after-hours', label: 'After', icon: Sparkles },
  { id: 'projects', label: 'Work', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'experience', label: 'Journey', icon: Briefcase },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'contact', label: 'Contact', icon: Mail },
];

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function PortfolioApp() {
  const {
    activeSection,
    setActiveSection,
    theme,
    setTheme,
    isThemePickerOpen,
    setIsThemePickerOpen,
    isTerminalOpen,
    setIsTerminalOpen,
    terminalTab,
    setTerminalTab,
    openTerminal,
    isShortcutsOpen,
    setIsShortcutsOpen,
    peekItem,
    setPeekItem,
  } = useTheme();

  // Sidebar state: open on desktop (>=1024), collapsed on tablet (<1024) to give editor full width
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  const prevWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;
      if (prevWidth >= 1024 && currentWidth < 1024) {
        setIsSidebarOpen(false);
      } else if (prevWidth < 1024 && currentWidth >= 1024) {
        setIsSidebarOpen(true);
      }
      prevWidthRef.current = currentWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Command Palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  // 404 Route Detection
  const [is404, setIs404] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return path !== '/' && path !== '' && path !== '/index.html';
  });

  // Key chord tracking for Ctrl+K sequences
  const isCtrlKPending = useRef(false);
  const ctrlKTimer = useRef<number | null>(null);

  // Konami code progress
  const konamiIndex = useRef(0);

  // Mobile bottom nav button refs for auto-centering
  const mobileNavRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = mobileNavRefs.current[activeSection];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  // Smooth scroll to a section
  const handleScrollToSection = useCallback(
    (sectionId: SectionId) => {
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    },
    [setActiveSection]
  );

  // Jump by delta (-1 for previous section, +1 for next section)
  const jumpSection = useCallback(
    (delta: number) => {
      const currentIndex = SECTIONS_ORDER.indexOf(activeSection);
      const newIndex = Math.max(0, Math.min(SECTIONS_ORDER.length - 1, currentIndex + delta));
      if (newIndex !== currentIndex) {
        handleScrollToSection(SECTIONS_ORDER[newIndex]);
      }
    },
    [activeSection, handleScrollToSection]
  );

  // Tab Title Follows File & Shows ● Rohan Sai Jagan (unsaved) When Hidden
  useEffect(() => {
    const activeFileName = FILE_NAME_MAP[activeSection] || 'home.tsx';

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = '● Rohan Sai Jagan (unsaved)';
      } else {
        document.title = `${activeFileName} — Rohan Sai Jagan`;
      }
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSection]);

  // Console message on startup
  useEffect(() => {
    console.log(
      '%c Rohan Sai Jagan %c Software Developer %c Bengaluru, India \n%c"Code is my canvas. Everything I make is art that happens to run."',
      'background: #007acc; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;',
      'background: #181c25; color: #4ec9b0; padding: 2px 6px; border-radius: 3px;',
      'background: #12151c; color: #ce9178; padding: 2px 6px; border-radius: 3px;',
      'color: #6a9955; font-weight: 600; margin-top: 4px;'
    );
  }, []);

  // Global Keyboard Navigation, Chords, and Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      // Konami Code sequence check
      if (e.key.toLowerCase() === KONAMI_CODE[konamiIndex.current].toLowerCase()) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0;
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.6 },
          });
          openTerminal('terminal');
        }
      } else {
        konamiIndex.current = 0;
      }

      // Check Ctrl+K chord first
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        isCtrlKPending.current = true;
        if (ctrlKTimer.current) clearTimeout(ctrlKTimer.current);
        ctrlKTimer.current = window.setTimeout(() => {
          isCtrlKPending.current = false;
        }, 1200);
        return;
      }

      if (isCtrlKPending.current) {
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          isCtrlKPending.current = false;
          setIsThemePickerOpen(true);
          return;
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          isCtrlKPending.current = false;
          setIsShortcutsOpen(true);
          return;
        }
      }

      // Cmd/Ctrl + ` => Toggle Terminal
      if ((e.metaKey || e.ctrlKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setIsTerminalOpen(!isTerminalOpen);
        return;
      }

      // Cmd/Ctrl + P => Command Palette
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape => Close any open modals / panels
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isThemePickerOpen) {
          setIsThemePickerOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (peekItem) {
          setPeekItem(null);
          return;
        }
        if (isTerminalOpen) {
          setIsTerminalOpen(false);
          return;
        }
        if (contextMenu.isOpen) {
          setContextMenu({ isOpen: false, x: 0, y: 0 });
          return;
        }
      }

      // Arrow Up/Down & PageUp/PageDown jump sections (only when not in input and no modals open)
      const hasModalOpen =
        isCommandPaletteOpen ||
        isThemePickerOpen ||
        isShortcutsOpen ||
        Boolean(peekItem) ||
        isTerminalOpen;

      if (!isInput && !hasModalOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          jumpSection(1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          jumpSection(-1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isThemePickerOpen,
    isShortcutsOpen,
    peekItem,
    isTerminalOpen,
    contextMenu.isOpen,
    setIsTerminalOpen,
    setIsThemePickerOpen,
    setIsShortcutsOpen,
    setPeekItem,
    openTerminal,
    jumpSection,
  ]);

  // Context menu on right click
  const handleContextMenu = (e: React.MouseEvent) => {
    // Only intercept if not on an editable input or textarea
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  if (is404) {
    return (
      <NotFoundPage
        onReturnHome={() => {
          window.history.pushState(null, '', '/#home');
          setIs404(false);
        }}
      />
    );
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex flex-col h-screen w-screen overflow-hidden font-sans select-none bg-[var(--color-bg)] text-[var(--color-text-primary)]"
    >
      {/* Custom Editor Cursor */}
      <CustomCursor />

      {/* Boot Screen Overture on first visit */}
      <BootScreen onComplete={() => {}} />

      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#569cd6] focus:text-white focus:rounded-lg font-mono text-xs"
      >
        Skip to main content
      </a>

      {/* 1. Top Title Bar (Desktop & Tablet) */}
      <div className="hidden md:block">
        <TitleBar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onSelectSection={handleScrollToSection}
        />
      </div>

      {/* Mobile Slim Top Bar (< 768px) */}
      <header className="md:hidden h-11 w-full bg-[#12151c] border-b border-white/[0.07] px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#569cd6] animate-pulse" />
          <span className="font-heading font-bold text-sm tracking-tight text-[#f4f6fb]">
            Rohan Sai Jagan
          </span>
        </div>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-1.5 rounded-lg bg-[#181c25] border border-white/10 text-[#aab2c0] hover:text-white transition-colors cursor-pointer"
          title="Open Command Palette"
        >
          <Search className="w-4 h-4 text-[#569cd6]" />
        </button>
      </header>

      {/* 2. Main Workbench Row */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Activity Bar (Desktop Far Left) */}
        <ActivityBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onScrollToContact={() => handleScrollToSection('contact')}
        />

        {/* Primary Sidebar (Explorer Tree, Desktop Only) */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={handleScrollToSection}
          isOpen={isSidebarOpen}
        />

        {/* Editor Main Canvas (Tabs + Continuous Scroll + Integrated Terminal Drawer) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Tab Bar (Desktop & Tablet) */}
          <div className="hidden md:block">
            <TabBar
              activeSection={activeSection}
              onSelectSection={handleScrollToSection}
            />
          </div>

          {/* Continuous Scroll Sections Container */}
          <EditorArea onScrollToSection={handleScrollToSection} />

          {/* Integrated Terminal Panel Drawer (Ctrl+`) */}
          <TerminalPanel
            isOpen={isTerminalOpen}
            activeTab={terminalTab}
            onTabChange={setTerminalTab}
            onClose={() => setIsTerminalOpen(false)}
            onJumpToSection={handleScrollToSection}
          />
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (< 768px) with 44px min touch targets & horizontal scroll with auto-centering */}
      <nav
        aria-label="Mobile section navigation"
        className="md:hidden h-14 w-full bg-[#12151c] border-t border-white/[0.08] flex items-center overflow-x-auto no-scrollbar scroll-smooth px-2 gap-1 z-40 shrink-0 pb-[env(safe-area-inset-bottom)]"
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              ref={(el) => {
                mobileNavRefs.current[item.id] = el;
              }}
              onClick={() => handleScrollToSection(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'text-[#569cd6] font-bold bg-white/5'
                  : 'text-[#aab2c0] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[11px] font-mono leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 4. Bottom Status Bar */}
      <StatusBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      {/* 5. Command Palette Modal (Ctrl/Cmd + P) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onJumpToSection={handleScrollToSection}
      />

      {/* 6. Color Theme Picker Modal (Ctrl+K Ctrl+T) */}
      <ThemePickerModal
        isOpen={isThemePickerOpen}
        activeTheme={theme}
        onSelectTheme={setTheme}
        onClose={() => setIsThemePickerOpen(false)}
      />

      {/* 7. Keyboard Shortcuts Modal (Ctrl+K Ctrl+S) */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 8. Peek Definition Window (Alt+Click on any tech tag) */}
      <PeekDefinitionModal
        item={peekItem}
        onClose={() => setPeekItem(null)}
        onJumpToProject={() => handleScrollToSection('projects')}
      />

      {/* 9. VS Code Right-Click Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0 })}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleTerminal={() => openTerminal('terminal')}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
