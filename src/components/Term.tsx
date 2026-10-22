import React, { useState, useRef, useEffect } from 'react';
import { lookupTerm } from '../data/glossary.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { getPeekDefinition } from '../data/peekData.ts';

interface TermProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

export const Term: React.FC<TermProps> = ({ term, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const { setPeekItem } = useTheme();

  const matched = lookupTerm(term);
  const displayText = children || term;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const triggerPeek = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const def = getPeekDefinition(term);
    if (def) {
      setIsOpen(false);
      setPeekItem(def);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      triggerPeek(e);
      return;
    }
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey && (e.key === 'Enter' || e.key === 'F12')) {
      triggerPeek(e);
    }
  };

  if (!matched) {
    return (
      <span
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`cursor-pointer ${className}`}
        title="Alt+Click to peek definition"
      >
        {displayText}
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`relative inline-block cursor-help group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={`${matched.term}: ${matched.definition}. Alt+Click to peek definition.`}
    >
      <span className="underline decoration-dotted decoration-[#569cd6]/80 underline-offset-4 hover:decoration-[#569cd6] text-inherit">
        {displayText}
      </span>

      {isOpen && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-[#181c25] text-[#f4f6fb] text-xs shadow-2xl border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150 leading-relaxed font-sans text-left"
        >
          <span className="flex items-center justify-between mb-1">
            <span className="font-bold text-[#569cd6] font-mono text-xs">
              {matched.term}
            </span>
            <button
              type="button"
              onClick={triggerPeek}
              className="text-[10px] font-mono text-[#dcdcaa] hover:text-white px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              title="Open full Peek Definition"
            >
              Peek (Alt+Click)
            </button>
          </span>
          <span className="text-[#aab2c0] text-xs block">
            {matched.definition}
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#181c25]" />
        </span>
      )}
    </span>
  );
};
