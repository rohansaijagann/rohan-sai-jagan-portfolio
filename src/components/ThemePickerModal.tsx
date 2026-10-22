import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { ThemeId } from '../types.ts';

interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  previewColors: string[];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark-plus',
    name: 'Dark+ (default)',
    description: 'Classic VS Code dark theme with signature blue and green accents',
    previewColors: ['#0a0c10', '#12151c', '#569cd6', '#6a9955', '#ce9178'],
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Celebrated dark theme with deep navy canvas and neon cyan & purple highlights',
    previewColors: ['#1a1b26', '#16161e', '#7aa2f7', '#9ece6a', '#bb9af7'],
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'High-contrast dark theme with gothic purple, mint green, and pink highlights',
    previewColors: ['#282a36', '#21222c', '#bd93f9', '#50fa7b', '#ff79c6'],
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Iconic warm dark charcoal theme with yellow, green, and pink syntax highlights',
    previewColors: ['#272822', '#1e1f1c', '#e6db74', '#a6e22e', '#f92672'],
  },
];

interface ThemePickerModalProps {
  isOpen: boolean;
  activeTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  onClose: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  isOpen,
  activeTheme,
  onSelectTheme,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const initialThemeRef = useRef(activeTheme);

  useEffect(() => {
    if (isOpen) {
      initialThemeRef.current = activeTheme;
      const idx = THEME_OPTIONS.findIndex((t) => t.id === activeTheme);
      setSelectedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, activeTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % THEME_OPTIONS.length;
          onSelectTheme(THEME_OPTIONS[next].id);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + THEME_OPTIONS.length) % THEME_OPTIONS.length;
          onSelectTheme(THEME_OPTIONS[next].id);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelectTheme(THEME_OPTIONS[selectedIndex].id);
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSelectTheme(initialThemeRef.current);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onSelectTheme, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Color Theme Picker"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs"
      onClick={() => {
        onSelectTheme(THEME_OPTIONS[selectedIndex].id);
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl bg-[#12151c] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs"
      >
        {/* Top Quick Pick Search Bar */}
        <div className="px-4 py-3 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-[#aab2c0]">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-[#569cd6]" />
            <span className="text-white font-semibold">Select Color Theme</span>
          </div>
          <button
            onClick={() => {
              onSelectTheme(THEME_OPTIONS[selectedIndex].id);
              onClose();
            }}
            aria-label="Close theme picker"
            className="p-1 rounded hover:bg-white/10 text-[#aab2c0] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-2 divide-y divide-white/5 max-h-[360px] overflow-y-auto">
          {THEME_OPTIONS.map((theme, index) => {
            const isSelected = selectedIndex === index;
            const isCurrent = activeTheme === theme.id;

            return (
              <div
                key={theme.id}
                onMouseEnter={() => {
                  setSelectedIndex(index);
                  onSelectTheme(theme.id);
                }}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold text-sm">{theme.name}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 rounded bg-[#007acc]/20 text-[#569cd6] text-[10px] uppercase font-bold">
                        active
                      </span>
                    )}
                  </div>
                  <p className="text-[#aab2c0] text-xs font-sans">{theme.description}</p>
                </div>

                {/* Color swatches */}
                <div className="flex items-center space-x-1.5 shrink-0 ml-4">
                  {theme.previewColors.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {isCurrent && <Check className="w-4 h-4 text-[#4ec9b0] ml-2" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0a0c10] border-t border-white/5 flex items-center justify-between text-[11px] text-[#aab2c0]/60">
          <span>Use ↑ and ↓ to preview, Enter to select</span>
          <span className="text-white/40">Dark themes only</span>
        </div>
      </div>
    </div>
  );
};
