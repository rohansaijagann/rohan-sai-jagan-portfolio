import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

export const ScrollProgressBar: React.FC = () => {
  const { phraseAccent } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = document.getElementById('editor-scroll-container');
    if (!container) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0;
      setProgress(pct);
    };

    container.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => container.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-white/[0.04]"
    >
      <div
        className="h-full transition-[width] duration-75 ease-linear"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${phraseAccent}cc, ${phraseAccent})`,
          boxShadow: `0 0 8px ${phraseAccent}88`,
          transition: 'background 600ms ease, box-shadow 600ms ease, width 75ms linear',
        }}
      />
    </div>
  );
};
