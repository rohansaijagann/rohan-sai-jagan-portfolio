import React, { useState } from 'react';
import { Hash, Check } from 'lucide-react';

interface SectionAnchorProps {
  sectionId: string;
}

export const SectionAnchor: React.FC<SectionAnchorProps> = ({ sectionId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <span className="relative inline-flex items-center ml-2 select-none align-middle">
      <button
        type="button"
        onClick={handleCopy}
        className="opacity-40 hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded hover:bg-white/5 text-[#aab2c0] hover:text-[#569cd6] cursor-pointer"
        title={`Copy link to #${sectionId}`}
        aria-label={`Copy deep link to #${sectionId}`}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Hash className="w-4 h-4" />}
      </button>
      {copied && (
        <span
          role="status"
          aria-live="polite"
          className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-[#181c25] border border-white/15 text-[11px] font-mono text-emerald-400 whitespace-nowrap shadow-xl z-50 animate-fade-in pointer-events-none"
        >
          ✓ Copied #{sectionId} link
        </span>
      )}
    </span>
  );
};
