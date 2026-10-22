import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

interface PortraitArtworkProps {
  onNameCompiled?: boolean;
  roleTag?: string;
  sizeClass?: string;
}

export const PortraitArtwork: React.FC<PortraitArtworkProps> = ({
  roleTag = 'builder',
  sizeClass = 'w-[clamp(220px,23vw,340px)] h-[clamp(220px,23vw,340px)]',
}) => {
  const { phraseAccent, isReducedMotion } = useTheme();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [developComplete, setDevelopComplete] = useState(false);
  const [boxDrift, setBoxDrift] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Tilt Values (max 5 degrees per spec)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 220 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-180, 180], [5, -5]);
  const rotateY = useTransform(mouseX, [-180, 180], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Emit a few paint glyphs on hover via custom event
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      window.dispatchEvent(
        new CustomEvent('rohan-glyph-burst', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        })
      );
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // 700ms develop-in: clip-path circle 0 to 100% with blur-to-sharp
  useEffect(() => {
    if (isReducedMotion) {
      setDevelopComplete(true);
      return;
    }
    const timer = setTimeout(() => {
      setDevelopComplete(true);
    }, 700);
    return () => clearTimeout(timer);
  }, [isReducedMotion]);

  // Subtle CV detection box gentle re-fitting / random drift every 3.5s
  useEffect(() => {
    if (isReducedMotion) return;
    const interval = window.setInterval(() => {
      setBoxDrift({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        scale: 0.98 + Math.random() * 0.04,
      });
    }, 3500);
    return () => window.clearInterval(interval);
  }, [isReducedMotion]);

  return (
    <div className="flex flex-col justify-between items-end h-full select-none">
      {/* 3D Tilting & Floating Container */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isReducedMotion ? 0 : rotateX,
          rotateY: isReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative flex flex-col items-end cursor-pointer group"
      >
        {/* Soft Accent Glow Behind Disc (about 12% opacity, cross-fades 600ms) */}
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle, ${phraseAccent} 0%, transparent 70%)`,
            opacity: isHovered ? 0.22 : 0.12,
            transition: 'background 600ms ease, opacity 500ms ease',
          }}
          className="absolute inset-[-20px] rounded-full blur-2xl pointer-events-none -z-10"
        />

        {/* Orbiting Container: Exact circle size class */}
        <div className={`relative ${sizeClass} flex items-center justify-center shrink-0`}>
          {/* Thin 1px Hairline Ring just outside the accent ring */}
          <div className="absolute inset-[-14px] rounded-full border border-white/10 pointer-events-none z-10" />

          {/* Exactly ONE Accent Ring in --phrase-accent that draws itself once */}
          <svg
            className="absolute inset-[-12px] w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none z-10"
            viewBox="0 0 400 400"
            fill="none"
          >
            <circle
              cx="200"
              cy="200"
              r="192"
              stroke={phraseAccent}
              strokeWidth="1.5"
              strokeDasharray="1210"
              strokeDashoffset={isLoaded ? '0' : '1210'}
              style={{ transition: 'stroke 600ms ease, stroke-dashoffset 1000ms ease-out' }}
              className="opacity-80"
            />
          </svg>

          {/* Exactly ONE Small Glowing Dot Orbiting Slowly */}
          <div
            aria-hidden="true"
            className="absolute inset-[-12px] w-[calc(100%+24px)] h-[calc(100%+24px)] pointer-events-none z-20 animate-spin"
            style={{ animationDuration: '24s', animationTimingFunction: 'linear' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full absolute top-[-5px] left-1/2 -translate-x-1/2 transition-colors duration-600"
              style={{
                backgroundColor: phraseAccent,
                boxShadow: `0 0 10px ${phraseAccent}`,
              }}
            />
          </div>

          {/* Portrait Circle with Original B&W Photo, white background, no filter, no tint */}
          <div
            className={`w-full h-full rounded-full overflow-hidden shadow-2xl relative bg-white transition-all duration-700 ease-out ${
              developComplete ? 'filter-none opacity-100' : isLoaded ? 'opacity-100 blur-[2px]' : 'opacity-0 blur-md'
            }`}
            style={{
              clipPath: isLoaded ? 'circle(100% at 50% 50%)' : 'circle(0% at 50% 50%)',
              transition: 'clip-path 700ms ease-out, filter 700ms ease-out, opacity 700ms ease-out',
            }}
          >
            {/* Original black-and-white photo exactly as is */}
            <picture className="w-full h-full block">
              <source srcSet="/photo/rohan-800.webp 800w, /photo/rohan-400.webp 400w" type="image/webp" />
              <img
                src="/photo/rohan.jpg"
                alt="Portrait of Rohan Sai Jagan speaking into a microphone."
                width={340}
                height={340}
                loading="eager"
                onLoad={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: '50% 32%',
                }}
              />
            </picture>

            {/* Computer-Vision Detection Box over Face — dark semi-transparent overlay, accent corners */}
            <div
              aria-hidden="true"
              style={{
                top: '25%',
                left: '27%',
                width: '46%',
                height: '46%',
                transform: `translate3d(${boxDrift.x}px, ${boxDrift.y}px, 0) scale(${boxDrift.scale})`,
                transition: 'transform 1200ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 600ms ease',
                borderColor: `${phraseAccent}cc`,
                background: 'rgba(10, 12, 16, 0.15)',
              }}
              className="absolute z-20 pointer-events-none border-2 rounded-lg"
            >
              {/* 4 Corner Ticks — 3px stroke, larger, higher contrast */}
              <span
                style={{ borderColor: phraseAccent, transition: 'border-color 600ms ease' }}
                className="absolute -top-[3px] -left-[3px] w-3.5 h-3.5 border-t-[3px] border-l-[3px] rounded-tl"
              />
              <span
                style={{ borderColor: phraseAccent, transition: 'border-color 600ms ease' }}
                className="absolute -top-[3px] -right-[3px] w-3.5 h-3.5 border-t-[3px] border-r-[3px] rounded-tr"
              />
              <span
                style={{ borderColor: phraseAccent, transition: 'border-color 600ms ease' }}
                className="absolute -bottom-[3px] -left-[3px] w-3.5 h-3.5 border-b-[3px] border-l-[3px] rounded-bl"
              />
              <span
                style={{ borderColor: phraseAccent, transition: 'border-color 600ms ease' }}
                className="absolute -bottom-[3px] -right-[3px] w-3.5 h-3.5 border-b-[3px] border-r-[3px] rounded-br"
              />

              {/* Crisp Dark Pill Label: background #0a0c10, accent text, mono 12px */}
              <div
                style={{ color: phraseAccent, transition: 'color 600ms ease' }}
                className="absolute -top-4 left-0 px-2 py-0.5 rounded-full bg-[#0a0c10] text-[12px] font-mono leading-none tracking-wide select-none shadow-md border border-white/10"
              >
                {roleTag}
              </div>
            </div>
          </div>
        </div>

        {/* Small Centred Mono Caption Below: "rohan.jpg · still running" */}
        <p className="mt-3.5 font-mono text-xs text-[#aab2c0]/70 text-right w-full tracking-wide">
          rohan.jpg · still running
        </p>
      </motion.div>
    </div>
  );
};
