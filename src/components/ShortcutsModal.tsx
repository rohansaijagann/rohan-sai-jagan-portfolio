import React, { useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Ctrl + P / ⌘P', action: 'Open Command Palette', category: 'Navigation' },
  { key: 'Ctrl + `', action: 'Toggle Integrated Terminal', category: 'Workbench' },
  { key: 'Ctrl + K  Ctrl + T', action: 'Select Color Theme (4 Dark Themes)', category: 'Preferences' },
  { key: 'Ctrl + K  Ctrl + S', action: 'Open Keyboard Shortcuts', category: 'Preferences' },
  { key: 'Ctrl + F / ⌘F', action: 'Find Tool in Skills (Night Sky & Pipeline)', category: 'Search' },
  { key: 'Alt + Click', action: 'Peek Definition on any Tech Tag', category: 'Editor' },
  { key: '↑ / ↓ or PgUp / PgDn', action: 'Jump to Previous / Next Chapter', category: 'Navigation' },
  { key: 'Escape', action: 'Close Modals, Terminal, and Peek Definition', category: 'General' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl bg-[#12151c] border border-white/10 shadow-2xl overflow-hidden text-xs"
      >
        {/* Header */}
        <div className="px-4 py-3 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-[#aab2c0]">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-[#569cd6]" />
            <span className="text-white font-semibold">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="p-1 rounded hover:bg-white/10 text-[#aab2c0] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shortcuts Table */}
        <div className="p-4 max-h-[420px] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[#6a9955] text-xs font-semibold">
                <th className="pb-2">Command</th>
                <th className="pb-2">Category</th>
                <th className="pb-2 text-right">Keybinding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SHORTCUTS.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="py-2.5 text-white font-sans text-xs">{item.action}</td>
                  <td className="py-2.5 text-[#aab2c0] text-[11px]">{item.category}</td>
                  <td className="py-2.5 text-right">
                    <kbd className="px-2 py-1 rounded bg-[#181c25] border border-white/10 text-[#dcdcaa] text-xs shadow-xs">
                      {item.key}
                    </kbd>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#0a0c10] border-t border-white/5 text-right text-[11px] text-[#aab2c0]/60">
          Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};
