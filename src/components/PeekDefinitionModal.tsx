import React, { useEffect, useRef } from 'react';
import { X, Code2, ExternalLink, Sparkles } from 'lucide-react';
import { PeekItem } from '../types.ts';

interface PeekDefinitionModalProps {
  item: PeekItem | null;
  onClose: () => void;
  onJumpToProject: (projectId: string) => void;
}

export const PeekDefinitionModal: React.FC<PeekDefinitionModalProps> = ({
  item,
  onClose,
  onJumpToProject,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Peek Definition: ${item.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl bg-[#12151c] border-2 border-[#007acc] shadow-2xl overflow-hidden font-mono animate-in fade-in zoom-in-95 duration-150"
      >
        {/* VS Code Peek Header */}
        <div className="px-4 py-2 bg-[#181c25] border-b border-[#007acc]/40 flex items-center justify-between text-xs text-[#aab2c0]">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#007acc]" />
            <span className="text-white font-semibold">{item.name}</span>
            <span className="text-[#aab2c0]/60">// peek definition</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Peek"
            className="p-1 rounded hover:bg-white/10 text-[#aab2c0] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Peek Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Function Signature in VS Code Editor Box */}
          <div className="p-3.5 rounded-lg bg-[#0a0c10] border border-white/10 text-[#569cd6] overflow-x-auto leading-relaxed">
            <div className="text-[11px] text-[#6a9955] mb-1">// type signature</div>
            <pre className="font-mono text-xs text-[#dcdcaa] whitespace-pre-wrap">
              {item.signature}
            </pre>
          </div>

          {/* Plain English Explanation */}
          <div className="space-y-1">
            <div className="text-[#6a9955] text-xs font-semibold">// overview</div>
            <p className="text-sm font-sans text-[#f4f6fb] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Connected Projects */}
          {item.projects && item.projects.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="text-[#6a9955] text-xs font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-[#dcdcaa]" />
                <span>// used in projects:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onClose();
                      onJumpToProject(proj.id);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181c25] hover:bg-[#007acc]/20 border border-white/10 hover:border-[#007acc] text-white text-xs transition-colors cursor-pointer"
                  >
                    <span>{proj.name}</span>
                    <ExternalLink className="w-3 h-3 text-[#569cd6]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 text-right text-[11px] text-[#aab2c0]/60">
            Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Esc</kbd> to close peek
          </div>
        </div>
      </div>
    </div>
  );
};
