import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AccentProps {
  children: React.ReactNode;
  color?: string; // Hex color for the section accent
  className?: string;
}

export const Accent: React.FC<AccentProps> = ({
  children,
  color = '#569cd6',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={`relative inline-block px-1.5 py-0.5 rounded-sm ${className}`}
      style={{
        color: color,
      }}
    >
      {/* Translucent Accent Selection Highlight (~18% opacity) with Left-to-Right scaleX sweep */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
        style={{
          transformOrigin: 'left',
          backgroundColor: `${color}2e`, // ~18% opacity hex
          borderBottom: `2px solid ${color}`,
        }}
        className="absolute inset-0 pointer-events-none rounded-xs -z-10"
      />
      {children}
    </span>
  );
};
