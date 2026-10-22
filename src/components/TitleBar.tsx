import React, { useState } from 'react';
import { Search, PanelLeft } from 'lucide-react';
import { SectionId } from '../types.ts';
import { PERSONAL_INFO } from '../data/portfolioData.ts';

interface TitleBarProps {
  onOpenCommandPalette: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSelectSection: (sectionId: SectionId) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onOpenCommandPalette,
  isSidebarOpen,
  onToggleSidebar,
  onSelectSection,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'home.tsx', action: () => onSelectSection('home') },
        { label: 'about.html', action: () => onSelectSection('about') },
        { label: 'after-hours.md', action: () => onSelectSection('after-hours') },
        { label: 'projects.js', action: () => onSelectSection('projects') },
        { label: 'skills.json', action: () => onSelectSection('skills') },
        { label: 'experience.ts', action: () => onSelectSection('experience') },
        { label: 'resume.pdf', action: () => onSelectSection('resume') },
        { label: 'contact', action: () => onSelectSection('contact') },
        {
          label: 'Download Resume (PDF)',
          action: () => {
            const link = document.createElement('a');
            link.href = PERSONAL_INFO.resumePdfUrl;
            link.download = 'Rohan_Sai_Jagan_Resume.pdf';
            link.click();
          },
        },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Copy Email Address',
          action: () => navigator.clipboard.writeText(PERSONAL_INFO.email),
        },
        { label: 'Command Palette (Ctrl+P)', action: onOpenCommandPalette },
      ],
    },
    {
      label: 'Go',
      items: [
        { label: 'Go to After Hours', action: () => onSelectSection('after-hours') },
        { label: 'Go to Projects', action: () => onSelectSection('projects') },
        { label: 'Go to Skills', action: () => onSelectSection('skills') },
        { label: 'Go to Experience', action: () => onSelectSection('experience') },
        { label: 'Go to Contact', action: () => onSelectSection('contact') },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'GitHub Profile', action: () => window.open(PERSONAL_INFO.github, '_blank') },
        { label: 'LinkedIn Profile', action: () => window.open(PERSONAL_INFO.linkedin, '_blank') },
        { label: 'Medium Articles', action: () => window.open(PERSONAL_INFO.medium, '_blank') },
        { label: 'LeetCode Profile', action: () => window.open(PERSONAL_INFO.leetcode, '_blank') },
      ],
    },
  ];

  return (
    <header
      role="banner"
      className="h-9 w-full flex items-center justify-between px-3 text-xs select-none border-b shrink-0 z-40 bg-[#12151c] border-white/[0.07] text-[#aab2c0]"
    >
      {/* Left: Window Dots & VS Code Menus */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              } else {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer"
            title="Toggle Fullscreen"
          />
        </div>

        {/* Menu list (desktop only) */}
        <div className="hidden md:flex items-center space-x-0.5 relative">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                onMouseEnter={() => {
                  if (activeMenu) setActiveMenu(menu.label);
                }}
                className={`px-2 py-1 rounded text-[11px] font-sans transition-colors cursor-pointer ${
                  activeMenu === menu.label
                    ? 'bg-white/10 text-white'
                    : 'hover:bg-white/5 text-[#aab2c0] hover:text-white'
                }`}
              >
                {menu.label}
              </button>

              {activeMenu === menu.label && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                  <div className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-2xl py-1 z-40 border border-white/10 text-xs bg-[#181c25] text-[#f4f6fb] font-sans animate-in fade-in zoom-in-95 duration-100">
                    {menu.items.map((item, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-[#569cd6] hover:text-white transition-colors cursor-pointer font-sans text-xs"
                        onClick={() => {
                          item.action();
                          setActiveMenu(null);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center: Search / Command Palette Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center justify-between px-3 py-1 rounded-lg bg-[#181c25] hover:bg-[#1e232e] border border-white/[0.08] text-xs text-[#aab2c0] w-56 sm:w-80 transition-all cursor-pointer shadow-inner"
        title="Open Command Palette (Ctrl+P)"
      >
        <div className="flex items-center space-x-2 truncate">
          <Search className="w-3.5 h-3.5 text-[#569cd6] shrink-0" />
          <span className="truncate text-[#f4f6fb] text-[11px] font-mono">
            rohan-sai-jagan : workspace
          </span>
        </div>
        <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-mono text-[#aab2c0] border border-white/10">
          Ctrl P
        </kbd>
      </button>

      {/* Right controls */}
      <div className="flex items-center space-x-2">

        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isSidebarOpen ? 'bg-white/10 text-white' : 'text-[#aab2c0] hover:text-white'
          }`}
          title="Toggle Explorer Sidebar"
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
