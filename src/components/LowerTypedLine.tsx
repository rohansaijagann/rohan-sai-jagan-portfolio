import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface TextSegment {
  text: string;
  color?: string;
}

interface LogLineConfig {
  id: number;
  plainText: string;
  segments: TextSegment[];
}

export const LOG_LINES: LogLineConfig[] = [
  {
    id: 0,
    plainText: 'Code is my canvas. Everything I make is art that happens to run.',
    segments: [
      { text: 'Code', color: '#569cd6' },
      { text: ' is my ' },
      { text: 'canvas', color: '#ce9178' },
      { text: '. Everything I make is ' },
      { text: 'art', color: '#dcdcaa' },
      { text: ' that happens to ' },
      { text: 'run', color: '#4ec9b0' },
      { text: '.' },
    ],
  },
  {
    id: 1,
    plainText: 'Sweating the details most people never notice.',
    segments: [
      { text: 'Sweating the ' },
      { text: 'details', color: '#ce9178' },
      { text: ' most people never notice.' },
    ],
  },
  {
    id: 2,
    plainText: 'Every project started with a problem that annoyed me.',
    segments: [
      { text: 'Every project started with a ' },
      { text: 'problem', color: '#c586c0' },
      { text: ' that annoyed me.' },
    ],
  },
  {
    id: 3,
    plainText: 'When the laptop closes, the training starts.',
    segments: [
      { text: 'When the laptop closes, the ' },
      { text: 'training', color: '#f472b6' },
      { text: ' starts.' },
    ],
  },
  {
    id: 4,
    plainText: 'Scroll slowly. This is the story so far.',
    segments: [
      { text: 'Scroll slowly. This is the ' },
      { text: 'story', color: '#569cd6' },
      { text: ' so far.' },
    ],
  },
];

interface VisibleLogItem {
  keyId: number;
  lineIdx: number;
}

export const LowerTypedLine: React.FC = () => {
  const { isReducedMotion } = useTheme();

  // Keep track of visible lines (up to 3 lines at a time)
  const [visibleItems, setVisibleItems] = useState<VisibleLogItem[]>([
    { keyId: 0, lineIdx: 0 },
  ]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(LOG_LINES[0].plainText.length);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextKeyIdRef = useRef(1);
  const timerRef = useRef<number | null>(null);

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

  // Reduced motion: show one line at a time and cross-fade every 5s
  useEffect(() => {
    if (!isReducedMotion || !isVisible) return;

    const interval = window.setInterval(() => {
      setCurrentLineIdx((prev) => (prev + 1) % LOG_LINES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isReducedMotion, isVisible]);

  // Full motion: Every ~3s a new line types in at bottom (~30ms/char), previous slide up and dim (>=70% opacity)
  useEffect(() => {
    if (isReducedMotion || !isVisible) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timerRef.current = window.setTimeout(resolve, ms);
      });

    const runStreamingLoop = async () => {
      // Small initial hold
      await sleep(2000);

      let lineCounter = 1;

      while (!cancelled) {
        const nextLineIdx = lineCounter % LOG_LINES.length;
        const lineConfig = LOG_LINES[nextLineIdx];
        const newKey = nextKeyIdRef.current++;

        // Add the new line at bottom (typedChars starts at 0)
        setIsTyping(true);
        setTypedChars(0);
        setCurrentLineIdx(nextLineIdx);

        setVisibleItems((prev) => {
          const nextList = [...prev, { keyId: newKey, lineIdx: nextLineIdx }];
          // Keep at most 3 visible log lines
          if (nextList.length > 3) {
            return nextList.slice(nextList.length - 3);
          }
          return nextList;
        });

        // Type in the new line (~30ms per char)
        const fullLen = lineConfig.plainText.length;
        for (let c = 1; c <= fullLen; c++) {
          if (cancelled) return;
          setTypedChars(c);
          await sleep(30);
        }

        if (cancelled) return;
        setIsTyping(false);

        // Hold for ~2.6s so total time between new lines is ~3-4s
        await sleep(2600);
        lineCounter++;
      }
    };

    runStreamingLoop();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isReducedMotion, isVisible]);

  // Helper to render colored segments up to typed character count
  const renderLineSegments = (line: LogLineConfig, charLimit: number) => {
    let remaining = charLimit;
    const elements: React.ReactNode[] = [];

    line.segments.forEach((seg, idx) => {
      if (remaining <= 0) return;
      const segText = seg.text;
      const sliceLen = Math.min(segText.length, remaining);
      const visibleSub = segText.slice(0, sliceLen);
      remaining -= sliceLen;

      if (seg.color) {
        elements.push(
          <span key={idx} style={{ color: seg.color }} className="font-medium">
            {visibleSub}
          </span>
        );
      } else {
        elements.push(
          <span key={idx} className="text-[#aab2c0]">
            {visibleSub}
          </span>
        );
      }
    });

    return elements;
  };

  return (
    <div ref={containerRef} className="relative select-none w-full">
      {/* Screen reader static line */}
      <span className="sr-only">
        Code is my canvas. Everything I make is art that happens to run.
      </span>

      {/* Live Terminal Log: prompt line + 3 visible log lines, reserved height so nothing jumps */}
      <div
        aria-live="off"
        aria-hidden="true"
        className="min-h-[108px] flex flex-col justify-start"
      >
        {/* Faint mono prompt line */}
        <div className="font-mono text-xs text-[#aab2c0]/60 select-none pb-1.5 flex items-center space-x-1.5">
          <span>$</span>
          <span>rohan</span>
          <span className="text-[#569cd6]/80">--now</span>
        </div>

        {isReducedMotion ? (
          // Reduced motion: show one line at a time and cross-fade every 5s
          <div
            key={currentLineIdx}
            data-log-line="true"
            className="flex items-center space-x-2 text-[18px] leading-relaxed animate-fade-in font-sans"
          >
            <span className="font-mono text-[#4ec9b0] font-bold text-xs">✓</span>
            <p>
              {renderLineSegments(
                LOG_LINES[currentLineIdx],
                LOG_LINES[currentLineIdx].plainText.length
              )}
            </p>
          </div>
        ) : (
          // Full motion: Up to 3 visible lines sliding up, previous dim to 75%
          <div className="flex flex-col space-y-1.5 overflow-hidden">
            {visibleItems.map((item, itemIdx) => {
              const isLatest = itemIdx === visibleItems.length - 1;
              const lineConf = LOG_LINES[item.lineIdx];
              const charsToShow = isLatest ? typedChars : lineConf.plainText.length;
              const opacityClass = isLatest ? 'opacity-100' : 'opacity-75';

              return (
                <div
                  key={item.keyId}
                  data-log-line="true"
                  style={{ transition: 'opacity 300ms ease, transform 300ms ease' }}
                  className={`flex items-baseline space-x-2 text-[18px] leading-relaxed ${opacityClass}`}
                >
                  <span className="font-mono text-[#4ec9b0] text-xs font-semibold shrink-0 select-none">
                    ✓
                  </span>
                  <div className="inline-flex items-baseline flex-wrap font-sans">
                    {renderLineSegments(lineConf, charsToShow)}

                    {/* Thin mono block caret at the end of the newest line only */}
                    {isLatest && (
                      <span
                        aria-hidden="true"
                        className="inline-block w-2 sm:w-2.5 h-[1.1em] bg-[#aab2c0] ml-1.5 animate-caret-blink shrink-0 align-middle"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
