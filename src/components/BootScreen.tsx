import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BootScreenProps {
  onComplete: () => void;
}

const OVERTURE_TEXT = '// a story, written in code';

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('rohan_portfolio_overture');
  });

  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      onComplete();
      return;
    }

    // Type out the line character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedChars(charIndex);

      if (charIndex >= OVERTURE_TEXT.length) {
        clearInterval(typeInterval);
        // Hold for 400ms then fade out
        setTimeout(() => {
          sessionStorage.setItem('rohan_portfolio_overture', 'true');
          setIsVisible(false);
          onComplete();
        }, 450);
      }
    }, 55);

    const handleSkip = () => {
      clearInterval(typeInterval);
      sessionStorage.setItem('rohan_portfolio_overture', 'true');
      setIsVisible(false);
      onComplete();
    };

    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    return () => {
      clearInterval(typeInterval);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="overture-screen"
          id="boot-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] bg-[#0a0c10] flex items-center justify-center p-6 select-none cursor-pointer"
        >
          <div className="flex items-center font-mono text-base sm:text-xl text-[#6a9955] tracking-wide">
            <span>{OVERTURE_TEXT.slice(0, typedChars)}</span>
            <span
              aria-hidden="true"
              className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-[#569cd6] ml-2 animate-caret-blink"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
