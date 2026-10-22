import React from 'react';
import { AlertCircle, FileCode, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  const handleReturn = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.href = '/#home';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-[#f4f6fb] flex flex-col font-mono select-none">
      {/* VS Code Title Bar */}
      <div className="h-10 bg-[#12151c] border-b border-white/[0.08] px-4 flex items-center justify-between text-xs text-[#aab2c0]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-[#f4f6fb]">Workspace — 404.ts</span>
        </div>
      </div>

      {/* Tab */}
      <div className="h-9 bg-[#181c25] border-b border-white/[0.06] flex items-center px-3 space-x-2">
        <div className="flex items-center space-x-2 px-3 py-1 bg-[#1e2330] border-t-2 border-[#ff5f56] text-xs text-[#f4f6fb]">
          <AlertCircle className="w-3.5 h-3.5 text-[#ffbd2e]" />
          <span>404: Cannot open file</span>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-2xl bg-[#12151c] border border-white/[0.08] p-8 shadow-2xl space-y-6">
          <div className="flex items-center space-x-3 text-[#ce9178]">
            <AlertCircle className="w-6 h-6 text-[#ff5f56]" />
            <h1 className="font-heading font-bold text-2xl text-[#f4f6fb]">Cannot open file</h1>
          </div>

          <div className="space-y-2 text-xs text-[#aab2c0] bg-[#0a0c10] p-4 rounded-xl border border-white/5">
            <div className="text-[#6a9955]">// 404: The requested path was not found in this codebase.</div>
            <div>
              <span className="text-[#569cd6]">const</span> <span className="text-[#4ec9b0]">status</span> = <span className="text-[#ce9178]">'FILE_NOT_FOUND'</span>;
            </div>
            <div>
              <span className="text-[#569cd6]">const</span> <span className="text-[#4ec9b0]">suggestion</span> = <span className="text-[#ce9178]">'Return to home.tsx'</span>;
            </div>
          </div>

          <div>
            <button
              onClick={handleReturn}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#569cd6] hover:bg-[#488ac0] text-white text-xs font-semibold shadow-lg shadow-[#569cd6]/20 transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>Open home.tsx</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
