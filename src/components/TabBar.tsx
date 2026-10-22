import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileIcon } from './FileIcon.tsx';
import { SectionId } from '../types.ts';

interface TabItem {
  id: SectionId;
  fileName: string;
  accent: string;
}

const TABS: TabItem[] = [
  { id: 'home', fileName: 'home.tsx', accent: '#569cd6' },
  { id: 'about', fileName: 'about.html', accent: '#4ec9b0' },
  { id: 'after-hours', fileName: 'after-hours.md', accent: '#d16d9e' },
  { id: 'projects', fileName: 'projects.js', accent: '#c586c0' },
  { id: 'skills', fileName: 'skills.json', accent: '#dcdcaa' },
  { id: 'experience', fileName: 'experience.ts', accent: '#ce9178' },
  { id: 'resume', fileName: 'resume.pdf', accent: '#569cd6' },
  { id: 'contact', fileName: 'contact', accent: '#6a9955' },
];

interface TabBarProps {
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeSection, onSelectSection }) => {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll active tab into view when activeSection changes
  useEffect(() => {
    const el = tabRefs.current[activeSection];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeSection]);

  return (
    <div
      role="tablist"
      aria-label="Editor tabs"
      className="h-9 w-full flex items-center border-b shrink-0 overflow-x-auto no-scrollbar select-none z-20 bg-[#12151c] border-white/[0.07]"
    >
      <div className="flex items-center h-full">
        {TABS.map((tab) => {
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectSection(tab.id)}
              className={`group relative flex items-center h-full px-3.5 text-xs font-mono border-r border-white/[0.07] transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0a0c10] text-[#f4f6fb] font-medium'
                  : 'bg-[#12151c] text-[#aab2c0] hover:text-[#f4f6fb] hover:bg-white/[0.03]'
              }`}
            >
              {/* Animated Sliding Top/Bottom Accent Line */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: tab.accent }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <FileIcon fileId={tab.fileName} className="w-3.5 h-3.5 mr-2 shrink-0" />
              <span className="truncate max-w-[140px]">
                {tab.fileName}
              </span>

              {/* Subtle indicator dot when active */}
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full ml-2 shrink-0"
                  style={{ backgroundColor: tab.accent }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
