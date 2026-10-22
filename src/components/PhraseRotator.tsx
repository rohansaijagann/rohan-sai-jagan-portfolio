import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

export interface VerbPhrase {
  id: number;
  verb: string;
  rest: string;
  accent: string;
  roleTag: string;
}

export const VERB_PHRASES: VerbPhrase[] = [
  {
    id: 0,
    verb: 'build',
    rest: 'web apps people love.',
    accent: '#569cd6', // blue
    roleTag: 'builder',
  },
  {
    id: 1,
    verb: 'teach',
    rest: 'computers to see.',
    accent: '#4ec9b0', // teal
    roleTag: 'learner',
  },
  {
    id: 2,
    verb: 'make',
    rest: 'AI that shows its sources.',
    accent: '#c586c0', // purple
    roleTag: 'builder',
  },
  {
    id: 3,
    verb: 'wire up',
    rest: 'servers and databases.',
    accent: '#ce9178', // orange
    roleTag: 'tinkerer',
  },
  {
    id: 4,
    verb: 'map',
    rest: 'wildfire risk in real time.',
    accent: '#6a9955', // green
    roleTag: 'reader',
  },
  {
    id: 5,
    verb: 'train',
    rest: 'hard: box, lift, run, swim.',
    accent: '#d16d9e', // pink
    roleTag: 'coach',
  },
  {
    id: 6,
    verb: 'coach',
    rest: 'beginners, just for fun.',
    accent: '#dcdcaa', // yellow
    roleTag: 'coach',
  },
  {
    id: 7,
    verb: 'solve',
    rest: 'cubes and learn new tricks.',
    accent: '#4ec9b0', // teal
    roleTag: 'tinkerer',
  },
  {
    id: 8,
    verb: 'ship',
    rest: 'things that actually work.',
    accent: '#569cd6', // blue
    roleTag: 'builder',
  },
];


const SCRAMBLE_CHARS = '{};<>=/[]()*_01#&%!?~+-';

interface PhraseRotatorProps {
  onPhraseChange?: (phrase: VerbPhrase) => void;
}

export const PhraseRotator: React.FC<PhraseRotatorProps> = ({ onPhraseChange }) => {
  const { isReducedMotion, setPhraseAccent } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevVerb, setPrevVerb] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Rest of sentence typing state
  const [typedChars, setTypedChars] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [scrambleText, setScrambleText] = useState('');
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const loopTimerRef = useRef<number | null>(null);

  const currentPhrase = VERB_PHRASES[currentIndex];

  // Pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPhraseChangeRef = useRef(onPhraseChange);
  useEffect(() => {
    onPhraseChangeRef.current = onPhraseChange;
  }, [onPhraseChange]);

  // Sync theme accent on phrase change
  useEffect(() => {
    setPhraseAccent(currentPhrase.accent);
    onPhraseChangeRef.current?.(currentPhrase);
  }, [currentIndex, currentPhrase.accent, setPhraseAccent]);

  // Reduced motion: plain 250ms cross-fade between phrases every 4.5s
  useEffect(() => {
    if (!isReducedMotion || !isVisible || isHoverPaused) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VERB_PHRASES.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isReducedMotion, isVisible, isHoverPaused]);

  // Full Motion: Rolling Verb (240ms) + Typing Rest (~28ms/char) + Hold 2s + Scramble Decode (300ms)
  useEffect(() => {
    if (isReducedMotion || !isVisible || isHoverPaused) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        loopTimerRef.current = window.setTimeout(resolve, ms);
      });

    const runSequence = async () => {
      // 1. Verb Roll Phase: 240ms slot machine roll
      setIsRolling(true);
      await sleep(240);
      if (cancelled) return;
      setIsRolling(false);
      setPrevVerb(null);

      // 2. Typing Rest Phase: ~28ms per character in white
      const restText = currentPhrase.rest;
      const fullLen = restText.length;
      setIsDecoding(false);

      for (let i = 1; i <= fullLen; i++) {
        if (cancelled) return;
        setTypedChars(i);
        await sleep(28);
      }

      if (cancelled) return;

      // 3. Hold Phase: 2s (2000ms)
      await sleep(2000);
      if (cancelled) return;

      // 4. Scramble Decode Phase: 300ms
      setIsDecoding(true);
      const decodeStart = performance.now();
      const decodeDuration = 300;

      while (performance.now() - decodeStart < decodeDuration) {
        if (cancelled) return;
        const progress = (performance.now() - decodeStart) / decodeDuration;
        const visibleLen = Math.max(1, Math.round(fullLen * (1 - progress * 0.4)));

        let scrambled = '';
        for (let i = 0; i < visibleLen; i++) {
          scrambled += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setScrambleText(scrambled);
        await sleep(35);
      }

      if (cancelled) return;

      // Advance to next phrase
      setIsDecoding(false);
      setTypedChars(0);
      setPrevVerb(currentPhrase.verb);
      setCurrentIndex((prev) => (prev + 1) % VERB_PHRASES.length);
    };

    runSequence();

    return () => {
      cancelled = true;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [currentIndex, isReducedMotion, isVisible, isHoverPaused]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
      className="flex flex-col select-none cursor-default"
    >
      {/* Screen reader static accessible sentence */}
      <span className="sr-only">
        I build web apps, AI tools and computer vision, work on servers and data, train hard, coach beginners, and keep learning new things.
      </span>

      {/* Main Verb Roller Line: 2 lines reserved height, Geist 600, clamp(32px, 3.4vw, 46px) */}
      <div
        aria-live="off"
        aria-hidden="true"
        className="min-h-[72px] sm:min-h-[84px] flex items-start text-[clamp(32px,3.4vw,46px)] font-heading font-semibold text-[#f4f6fb] leading-[1.12] tracking-tight"
      >
        {isReducedMotion ? (
          // Reduced motion: clean 250ms cross-fade between phrases
          <div
            key={currentIndex}
            className="transition-opacity duration-250 opacity-100 animate-fade-in"
          >
            <span>I </span>
            <span style={{ color: currentPhrase.accent }}>{currentPhrase.verb}</span>
            <span> {currentPhrase.rest}</span>
          </div>
        ) : (
          <div className="inline-flex items-baseline flex-wrap">
            <span>I&nbsp;</span>

            {/* Rolling Verb: slot-machine reel inside a fixed-height mask */}
            <span className="inline-block relative overflow-hidden h-[1.18em] align-baseline align-bottom px-0.5">
              {isRolling && prevVerb && (
                <span
                  style={{
                    color: currentPhrase.accent,
                    transform: 'translateY(-100%)',
                    opacity: 0,
                    transition: 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 240ms ease',
                  }}
                  className="absolute left-0 top-0 whitespace-nowrap inline-block"
                >
                  {prevVerb}
                </span>
              )}

              <span
                style={{
                  color: currentPhrase.accent,
                  transition: 'color 600ms ease, transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className={`inline-block whitespace-nowrap ${
                  isRolling ? 'animate-verb-roll-in' : ''
                }`}
              >
                {currentPhrase.verb}
              </span>
            </span>

            <span>&nbsp;</span>

            {/* Rest of Sentence (Typed in white / Scramble Decode out) */}
            {isDecoding ? (
              <span className="font-mono text-[clamp(24px,2.8vw,36px)] text-[#aab2c0]/75 tracking-normal">
                {scrambleText}
              </span>
            ) : (
              <span className="text-[#f4f6fb]">
                {currentPhrase.rest.slice(0, typedChars)}
              </span>
            )}

            {/* Blinking phrase-accent caret following typed text */}
            {!isDecoding && typedChars < currentPhrase.rest.length && (
              <span
                aria-hidden="true"
                style={{
                  backgroundColor: currentPhrase.accent,
                  transition: 'background-color 600ms ease',
                }}
                className="inline-block w-2 sm:w-2.5 h-[0.75em] ml-1.5 animate-caret-blink shrink-0 align-baseline"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
