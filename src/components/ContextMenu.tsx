import React, { useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  Palette,
  Keyboard,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.ts';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenCommandPalette: () => void;
  onToggleTerminal: () => void;
  onOpenThemePicker: () => void;
  onOpenShortcuts: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
  onOpenCommandPalette,
  onToggleTerminal,
  onOpenThemePicker,
  onOpenShortcuts,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleScroll = () => {
      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ensure menu stays within viewport
  const menuWidth = 240;
  const menuHeight = 220;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 w-60 rounded-xl bg-[#12151c] border border-white/10 shadow-2xl py-1.5 font-mono text-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => {
          onClose();
          onOpenCommandPalette();
        }}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[#aab2c0] hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <Search className="w-3.5 h-3.5 text-[#569cd6]" />
          <span>Command Palette...</span>
        </span>
        <span className="text-[10px] text-[#aab2c0]/60">Ctrl+P</span>
      </button>

      <button
        onClick={() => {
          onClose();
          onToggleTerminal();
        }}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[#aab2c0] hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-[#6a9955]" />
          <span>Toggle Terminal</span>
        </span>
        <span className="text-[10px] text-[#aab2c0]/60">Ctrl+`</span>
      </button>

      <div className="my-1 border-t border-white/5" />

      <button
        onClick={() => {
          onClose();
          onOpenThemePicker();
        }}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[#aab2c0] hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <Palette className="w-3.5 h-3.5 text-[#dcdcaa]" />
          <span>Change Color Theme</span>
        </span>
        <span className="text-[10px] text-[#aab2c0]/60">Ctrl+K Ctrl+T</span>
      </button>

      <button
        onClick={() => {
          onClose();
          onOpenShortcuts();
        }}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[#aab2c0] hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <Keyboard className="w-3.5 h-3.5 text-[#c586c0]" />
          <span>Keyboard Shortcuts</span>
        </span>
        <span className="text-[10px] text-[#aab2c0]/60">Ctrl+K Ctrl+S</span>
      </button>

      <div className="my-1 border-t border-white/5" />

      <a
        href={PERSONAL_INFO.github}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[#aab2c0] hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center space-x-2">
          <Code2 className="w-3.5 h-3.5 text-[#4ec9b0]" />
          <span>View Source on GitHub</span>
        </span>
        <ExternalLink className="w-3 h-3 text-[#aab2c0]/60" />
      </a>
    </div>
  );
};
