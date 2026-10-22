import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { SectionId } from '../types.ts';
import { HomeSection } from './sections/HomeSection.tsx';
import { AboutSection } from './sections/AboutSection.tsx';
import { AfterHoursSection } from './sections/AfterHoursSection.tsx';
import { ProjectsSection } from './sections/ProjectsSection.tsx';
import { SkillsSection } from './sections/SkillsSection.tsx';
import { ExperienceSection } from './sections/ExperienceSection.tsx';
import { ResumeSection } from './sections/ResumeSection.tsx';
import { ContactSection } from './sections/ContactSection.tsx';
import { ScrollProgressBar } from './ScrollProgressBar.tsx';

interface EditorAreaProps {
  onScrollToSection: (sectionId: SectionId) => void;
}

const SECTION_FILE_MAP: Record<SectionId, { name: string; lang: string }> = {
  home: { name: 'home.tsx', lang: 'TYPESCRIPT JSX' },
  about: { name: 'about.html', lang: 'HTML' },
  'after-hours': { name: 'after-hours.md', lang: 'MARKDOWN' },
  projects: { name: 'projects.js', lang: 'JAVASCRIPT' },
  skills: { name: 'skills.json', lang: 'JSON' },
  experience: { name: 'experience.ts', lang: 'TYPESCRIPT' },
  resume: { name: 'resume.pdf', lang: 'PDF' },
  contact: { name: 'contact', lang: 'TERMINAL' },
};

const SECTIONS_LIST: SectionId[] = [
  'home',
  'about',
  'after-hours',
  'projects',
  'skills',
  'experience',
  'resume',
  'contact',
];

export const EditorArea: React.FC<EditorAreaProps> = ({ onScrollToSection }) => {
  const { activeSection, setActiveSection, setLineCol, hasScrolled, setHasScrolled } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });

  // Soft cursor-following spotlight on the editor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Setup IntersectionObserver to sync activeSection with scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      let bestEntry: IntersectionObserverEntry | null = null;

      for (const entry of entries) {
        if (entry.isIntersecting && SECTIONS_LIST.includes(entry.target.id as SectionId)) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }
      }

      if (bestEntry && bestEntry.target.id) {
        const id = bestEntry.target.id as SectionId;
        setActiveSection(id);
        window.history.replaceState(null, '', `#${id}`);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: [0.15, 0.4, 0.7],
      rootMargin: '-5% 0px -25% 0px',
    });

    SECTIONS_LIST.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  // Keyboard navigation: ArrowUp/ArrowDown, PageUp/PageDown jump between sections when not in an input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (isInput) return;

      const currentIndex = SECTIONS_LIST.indexOf(activeSection);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentIndex < SECTIONS_LIST.length - 1) {
          e.preventDefault();
          onScrollToSection(SECTIONS_LIST[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          onScrollToSection(SECTIONS_LIST[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeSection, onScrollToSection]);

  // Track scroll position to dynamically update Ln, Col in status bar
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      if (scrollTop > 80 && !hasScrolled) {
        setHasScrolled(true);
      }
      const currentLine = Math.max(1, Math.floor(scrollTop / 36) + 1);
      const currentCol = (currentLine % 16) + 1;
      setLineCol({ line: currentLine, col: currentCol });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [setLineCol, hasScrolled, setHasScrolled]);

  // Deep-linking: scroll to hash on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTIONS_LIST.includes(hash as SectionId)) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  }, []);

  const activeFileInfo = SECTION_FILE_MAP[activeSection] || SECTION_FILE_MAP.home;

  return (
    <main
      id="main-content"
      role="main"
      onMouseMove={handleMouseMove}
      className="flex-1 flex flex-col h-full overflow-hidden select-none relative bg-[#0a0c10] text-[#f4f6fb]"
    >
      {/* Scroll Progress Bar: 2px glowing hairline at the top */}
      <ScrollProgressBar />

      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(86, 156, 214, 0.05), transparent 80%)`,
        }}
      />

      {/* Breadcrumb Bar */}
      <div className="h-7 px-4 flex items-center justify-between text-[11px] font-mono border-b shrink-0 z-20 bg-[#0a0c10] border-white/[0.07] text-[#aab2c0]">
        <div className="flex items-center space-x-1.5 truncate">
          <span className="opacity-60">rohan-sai-jagan</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="opacity-60">src</span>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-[#f4f6fb] font-medium">{activeFileInfo.name}</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[10px] opacity-60">
          <span>{activeFileInfo.lang}</span>
          <span>•</span>
          <span>UTF-8</span>
          <span>•</span>
          <span>LF</span>
        </div>
      </div>

      {/* Editor Body: Left line gutter + Continuous Scroll Container */}
      <div className="flex-1 flex h-[calc(100%-1.75rem)] overflow-hidden relative bg-editor-grid">
        {/* Line Number Gutter on the left (VS Code texture) */}
        <div
          aria-hidden="true"
          className="hidden md:flex w-12 shrink-0 border-r border-white/[0.06] py-6 select-none flex-col items-center text-[10px] font-mono text-[#aab2c0]/25 pointer-events-none pr-3 space-y-6"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i}>{i * 4 + 1}</span>
          ))}
        </div>

        {/* Continuous Scroll Viewport */}
        <div
          ref={scrollContainerRef}
          id="editor-scroll-container"
          tabIndex={0}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar focus:outline-none scroll-smooth md:scroll-snap-y-proximity"
        >
          {/* Section 1: Home */}
          <HomeSection onNavigate={onScrollToSection} hasScrolled={hasScrolled} />

          {/* Section 2: About */}
          <AboutSection />

          {/* Section 3: After Hours */}
          <AfterHoursSection />

          {/* Section 4: Projects */}
          <ProjectsSection />

          {/* Section 5: Skills */}
          <SkillsSection />

          {/* Section 6: Experience */}
          <ExperienceSection onNavigateProjects={() => onScrollToSection('projects')} />

          {/* Section 7: Resume */}
          <ResumeSection />

          {/* Section 8: Contact */}
          <ContactSection />
        </div>
      </div>
    </main>
  );
};
