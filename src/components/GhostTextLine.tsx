import React, { useState, useEffect } from 'react';

interface PhraseConfig {
  full: string;
  typedLen: number; // characters typed before ghosting
}

const PHRASES: PhraseConfig[] = [
  { full: 'web apps', typedLen: 4 },
  { full: 'AI that can see', typedLen: 5 },
  { full: 'tools people actually use', typedLen: 5 },
  { full: 'things that work', typedLen: 4 },
];

export const GhostTextLine: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [stage, setStage] = useState<'typing' | 'ghost_wait' | 'accepted' | 'deleting'>('typing');
  const [isFlashing, setIsFlashing] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentPhrase = PHRASES[phraseIndex];

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeout: NodeJS.Timeout;

    if (stage === 'typing') {
      if (typedChars < currentPhrase.typedLen) {
        timeout = setTimeout(() => {
          setTypedChars((prev) => prev + 1);
        }, 75);
      } else {
        // Switch to ghost_wait (show ghost text + Tab keycap)
        setStage('ghost_wait');
      }
    } else if (stage === 'ghost_wait') {
      // Hold for 600ms, then flash & accept
      timeout = setTimeout(() => {
        setIsFlashing(true);
        setStage('accepted');
        setTimeout(() => setIsFlashing(false), 150);
      }, 600);
    } else if (stage === 'accepted') {
      // Hold accepted string for 1.4s, then delete
      timeout = setTimeout(() => {
        setStage('deleting');
      }, 1400);
    } else if (stage === 'deleting') {
      const fullLen = currentPhrase.full.length;
      if (typedChars > 0) {
        timeout = setTimeout(() => {
          setTypedChars((prev) => prev - 1);
        }, 30);
      } else {
        // Move to next phrase
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        setStage('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [stage, typedChars, phraseIndex, currentPhrase, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="text-[clamp(1.75rem,4vw,3.25rem)] font-heading font-semibold text-[#f4f6fb] leading-tight">
        <span>Lately I've been making web apps.</span>
      </div>
    );
  }

  const typedPart =
    stage === 'accepted' || stage === 'deleting'
      ? currentPhrase.full.slice(0, stage === 'accepted' ? currentPhrase.full.length : typedChars)
      : currentPhrase.full.slice(0, typedChars);

  const ghostPart =
    stage === 'ghost_wait'
      ? currentPhrase.full.slice(currentPhrase.typedLen)
      : '';

  return (
    <div className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-heading font-semibold text-[#f4f6fb] leading-tight tracking-tight select-none">
      {/* Screen Reader Version */}
      <span className="sr-only">
        Lately I've been making web apps, AI tools, and things that work.
      </span>

      {/* Visual Live Version */}
      <span aria-hidden="true" className="inline-flex items-center flex-wrap gap-x-2">
        <span>Lately I've been making</span>

        <span className="inline-flex items-center relative">
          {/* Typed text */}
          <span
            className={`transition-colors duration-150 ${
              isFlashing ? 'text-white drop-shadow-[0_0_12px_#569cd6]' : 'text-[#f4f6fb]'
            }`}
          >
            {typedPart}
          </span>

          {/* Caret before ghost or during typing */}
          {stage !== 'accepted' && (
            <span
              aria-hidden="true"
              className="inline-block w-2 sm:w-2.5 h-6 sm:h-9 bg-[#569cd6] ml-1 animate-caret-blink"
            />
          )}

          {/* Ghost Text (35% grey) */}
          {ghostPart && (
            <span className="text-[#f4f6fb]/35 ml-1 transition-opacity duration-200">
              {ghostPart}
            </span>
          )}

          {/* Tab Keycap indicator */}
          {stage === 'ghost_wait' && (
            <span className="inline-flex items-center px-1.5 py-0.5 ml-2.5 rounded bg-white/10 border border-white/20 text-[11px] font-mono font-normal text-[#aab2c0] animate-fade-in shadow-xs">
              Tab ⇥
            </span>
          )}
        </span>
      </span>
    </div>
  );
};
