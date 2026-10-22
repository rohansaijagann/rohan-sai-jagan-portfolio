import React from 'react';

interface SectionWatermarkProps {
  index?: string;
  number?: string;
}

export const SectionWatermark: React.FC<SectionWatermarkProps> = ({ index, number }) => {
  const displayIndex = index || number || '01';
  return (
    <div
      aria-hidden="true"
      className="absolute -top-12 -left-6 sm:-left-10 select-none pointer-events-none font-mono font-black text-[clamp(7rem,18vw,16rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.04)] z-0 opacity-40 transition-transform duration-700 ease-out"
    >
      {displayIndex}
    </div>
  );
};
