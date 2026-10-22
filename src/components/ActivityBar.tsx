import React from 'react';
import { Files, Search, Github, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.ts';

interface ActivityBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
  onScrollToContact: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenCommandPalette,
  onScrollToContact,
}) => {
  return (
    <nav
      aria-label="Activity Bar"
      className="hidden md:flex w-12 h-full flex-col justify-between items-center py-2 shrink-0 border-r select-none z-30 bg-[#12151c] border-white/[0.07] text-[#aab2c0]"
    >
      {/* Top Icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* Explorer Toggle */}
        <button
          onClick={onToggleSidebar}
          title="Explorer (toggle file tree)"
          className={`relative w-full h-11 flex items-center justify-center transition-colors group cursor-pointer ${
            isSidebarOpen ? 'text-white' : 'opacity-70 hover:opacity-100 hover:text-white'
          }`}
        >
          {isSidebarOpen && (
            <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-[#569cd6]" />
          )}
          <Files className="w-5 h-5 transition-transform group-hover:scale-105" />
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          title="Search / Command Palette (Ctrl+P)"
          className="w-full h-11 flex items-center justify-center opacity-70 hover:opacity-100 hover:text-white transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center space-y-1 w-full">
        {/* GitHub link */}
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Profile"
          className="w-full h-10 flex items-center justify-center opacity-70 hover:opacity-100 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>

        {/* Contact jump */}
        <button
          onClick={onScrollToContact}
          title="Say Hello (Contact)"
          className="w-full h-10 flex items-center justify-center opacity-70 hover:opacity-100 hover:text-[#6a9955] transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
