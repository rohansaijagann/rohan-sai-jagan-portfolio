import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useTheme } from '../context/ThemeContext.tsx';

const SECTION_ACCENT_MAP: Record<string, string> = {
  home: '#569cd6',
  about: '#4ec9b0',
  'after-hours': '#d16d9e',
  projects: '#c586c0',
  skills: '#dcdcaa',
  experience: '#ce9178',
  resume: '#569cd6',
  contact: '#6a9955',
};

export const CustomCursor: React.FC = () => {
  const { activeSection } = useTheme();
  const [cursorType, setCursorType] = useState<'default' | 'text' | 'button'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const accentColor = SECTION_ACCENT_MAP[activeSection] || '#569cd6';

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let hideTimer: number | null = null;

    const resetTimer = () => {
      setIsVisible(true);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      resetTimer();
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      // Update CSS variables for code-wall spotlight mask
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[role="tab"]') ||
        target.closest('[role="option"]')
      ) {
        setCursorType('button');
      } else if (
        target.closest('h1') ||
        target.closest('h2') ||
        target.closest('h3') ||
        target.closest('p') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      if (hideTimer) window.clearTimeout(hideTimer);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [rawX, rawY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
    >
      {cursorType === 'default' && (
        <div
          className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-200"
          style={{ backgroundColor: accentColor, color: accentColor }}
        />
      )}

      {cursorType === 'button' && (
        <div
          className="w-7 h-7 rounded-full border-2 bg-transparent transition-all duration-150 animate-pulse"
          style={{ borderColor: accentColor }}
        />
      )}

      {cursorType === 'text' && (
        <div
          className="w-[2px] h-5 rounded-full transition-colors duration-150"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </motion.div>
  );
};
