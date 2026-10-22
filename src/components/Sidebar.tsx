import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  GitBranch,
} from 'lucide-react';
import { FileIcon } from './FileIcon.tsx';
import { SectionId } from '../types.ts';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (sectionId: SectionId) => void;
  isOpen: boolean;
}

const WORKSPACE_FILES: { id: SectionId; name: string; accent: string; tooltip: string }[] = [
  { id: 'home', name: 'home.tsx', accent: '#569cd6', tooltip: 'home.tsx: hero & orientation' },
  { id: 'about', name: 'about.html', accent: '#4ec9b0', tooltip: 'about.html: who I am' },
  { id: 'after-hours', name: 'after-hours.md', accent: '#d16d9e', tooltip: 'after-hours.md: training, reading & play' },
  { id: 'projects', name: 'projects.js', accent: '#c586c0', tooltip: 'projects.js: what I built' },
  { id: 'skills', name: 'skills.json', accent: '#dcdcaa', tooltip: 'skills.json: what I reach for' },
  { id: 'experience', name: 'experience.ts', accent: '#ce9178', tooltip: 'experience.ts: where I worked' },
  { id: 'resume', name: 'resume.pdf', accent: '#569cd6', tooltip: 'resume.pdf: paper version' },
  { id: 'contact', name: 'contact', accent: '#6a9955', tooltip: 'contact: talk to me' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpen,
}) => {
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Workspace Explorer"
      className="hidden md:flex w-56 lg:w-60 h-full flex-col border-r shrink-0 select-none overflow-hidden text-xs bg-[#12151c] border-white/[0.07] text-[#aab2c0] z-20"
    >
      {/* Explorer Title */}
      <div className="px-4 py-2.5 uppercase font-mono font-bold text-[11px] tracking-wider text-[#aab2c0] flex items-center justify-between border-b border-white/5">
        <span>Explorer</span>
        <span className="text-[10px] text-[#aab2c0]/60 font-normal">PORTFOLIO</span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        {/* Workspace Root Folder */}
        <div
          onClick={() => setIsFolderOpen((prev) => !prev)}
          className="flex items-center px-3 py-1.5 cursor-pointer text-[#aab2c0] hover:text-white hover:bg-white/5 font-mono text-xs rounded transition-colors"
        >
          {isFolderOpen ? (
            <ChevronDown className="w-3.5 h-3.5 mr-1 text-[#aab2c0]" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 mr-1 text-[#aab2c0]" />
          )}
          {isFolderOpen ? (
            <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-[#569cd6]" />
          ) : (
            <Folder className="w-3.5 h-3.5 mr-1.5 text-[#569cd6]" />
          )}
          <span className="font-semibold text-[#f4f6fb]">rohan-sai-jagan</span>
        </div>

        {/* Child Files */}
        {isFolderOpen && (
          <div className="pl-3 pr-2 py-0.5 space-y-0.5">
            {WORKSPACE_FILES.map((file) => {
              const isActive = activeSection === file.id;

              return (
                <button
                  key={file.id}
                  onClick={() => onSelectSection(file.id)}
                  className={`w-full flex items-center px-3 py-1.5 rounded-md cursor-pointer text-xs font-mono transition-colors text-left group ${
                    isActive
                      ? 'bg-white/10 text-white font-medium shadow-xs'
                      : 'text-[#aab2c0] hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    borderLeft: isActive ? `2px solid ${file.accent}` : '2px solid transparent',
                  }}
                  title={file.tooltip}
                >
                  <FileIcon fileId={file.name} className="w-3.5 h-3.5 mr-2 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Status / Branch */}
      <div className="p-3 border-t border-white/5 bg-[#0e1117] flex items-center justify-between text-[11px] font-mono text-[#aab2c0]">
        <div className="flex items-center space-x-1.5">
          <GitBranch className="w-3 h-3 text-[#569cd6]" />
          <span>git: main</span>
        </div>
        <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
          clean
        </span>
      </div>
    </aside>
  );
};
