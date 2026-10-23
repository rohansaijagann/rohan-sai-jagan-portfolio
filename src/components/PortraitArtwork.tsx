import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

interface PortraitArtworkProps {
  onNameCompiled?: boolean;
  roleTag?: string;
  sizeClass?: string;
  showCaption?: boolean;
}

export const PortraitArtwork: React.FC<PortraitArtworkProps> = ({
  roleTag = 'builder',
  sizeClass = 'w-[clamp(220px,23vw,340px)] h-[clamp(220px,23vw,340px)]',
  showCaption = true,
}) => {
  const { phraseAccent, isReducedMotion } = useTheme();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [developComplete, setDevelopComplete] = useState(false);
  const [displayTag, setDisplayTag] = useState(roleTag);
  const [isFading, setIsFading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const pathId = `portrait-circle-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Smooth cross-fade when roleTag changes
  useEffect(() => {
    if (roleTag !== displayTag) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setDisplayTag(roleTag);
        setIsFading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [roleTag, displayTag]);

  // Dynamically compute repeated text to evenly wrap around the circular path (~1131px)
  const repeatedText = useMemo(() => {
    const clean = (displayTag || 'builder').toUpperCase().trim();
    const unit = ` • ${clean} `;
    // Target ~56-62 characters total for optimal spacing around the circumference
    const repeatCount = Math.max(4, Math.round(58 / unit.length));
    return unit.repeat(repeatCount);
  }, [displayTag]);

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
          className="absolute inset-[-24px] rounded-full blur-2xl pointer-events-none -z-10"
        />

        {/* Orbiting Container: Exact circle size class */}
        <div className={`relative ${sizeClass} flex items-center justify-center shrink-0`}>
          {/* Subtle Concentric Hairline Ring */}
          <div className="absolute inset-[-8px] rounded-full border border-white/10 pointer-events-none z-10" />

          {/* Delicate Dashed Track Ring in phraseAccent */}
          <svg
            className="absolute inset-[-24px] sm:inset-[-28px] w-[calc(100%+48px)] sm:w-[calc(100%+56px)] h-[calc(100%+48px)] sm:h-[calc(100%+56px)] pointer-events-none z-10"
            viewBox="0 0 400 400"
            fill="none"
          >
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke={phraseAccent}
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.25"
              style={{ transition: 'stroke 600ms ease' }}
            />
          </svg>

          {/* Rotating Text Around the Portrait */}
          <div
            aria-hidden="true"
            className={`absolute inset-[-24px] sm:inset-[-28px] w-[calc(100%+48px)] sm:w-[calc(100%+56px)] h-[calc(100%+48px)] sm:h-[calc(100%+56px)] pointer-events-none z-20 ${
              isReducedMotion ? '' : 'animate-spin'
            }`}
            style={{
              animationDuration: '24s',
              animationTimingFunction: 'linear',
            }}
          >
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <path
                  id={pathId}
                  d="M 200, 200 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
                />
              </defs>
              <text
                className="font-mono text-[10.5px] font-semibold tracking-[0.18em] uppercase select-none"
                style={{
                  fill: phraseAccent,
                  filter: `drop-shadow(0 0 4px ${phraseAccent}55)`,
                  transition: 'fill 600ms ease, filter 600ms ease, opacity 200ms ease',
                  opacity: isFading ? 0 : 1,
                }}
              >
                <textPath
                  href={`#${pathId}`}
                  startOffset="0%"
                  textLength="1131"
                  lengthAdjust="spacing"
                >
                  {repeatedText}
                </textPath>
              </text>
            </svg>
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
          </div>
        </div>

        {/* Small Centred Mono Caption Below: "rohan.jpg · still running" */}
        {showCaption && (
          <p className="mt-3.5 font-mono text-xs text-[#aab2c0]/70 text-right w-full tracking-wide">
            rohan.jpg · still running
          </p>
        )}
      </motion.div>
    </div>
  );
};
