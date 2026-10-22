import React, { useState } from 'react';
import { Download, ExternalLink, Printer, FileText, ArrowRight } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolioData.ts';
import { SectionWatermark } from '../SectionWatermark.tsx';
import { Accent } from '../Accent.tsx';
import { SectionAnchor } from '../SectionAnchor.tsx';
import { ResumeViewerModal } from '../ResumeViewerModal.tsx';

export const ResumeSection: React.FC = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open(PERSONAL_INFO.resumePdfUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // browser restriction fallback
        }
      }, 500);
    }
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="resume"
      aria-labelledby="resume-heading"
      className="section-snap-item pt-16 pb-8 relative overflow-visible"
    >
      {/* Section Watermark 07 */}
      <SectionWatermark index="07" />

      {/* Accent Blue Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-[#569cd6]/10 blur-[150px] pointer-events-none -z-10 animate-soft-pulse"
      />

      <div className="max-w-[1200px] w-full mx-auto px-6 sm:px-10 lg:px-16 space-y-7 relative z-10">
        {/* Header Block */}
        <div className="space-y-3 pb-2 border-b border-white/[0.07]">
          <div className="font-mono text-[13px] text-[#569cd6]">
            // chapter 07 · resume.pdf
          </div>
          <h2
            id="resume-heading"
            className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] font-extrabold text-[#f4f6fb] tracking-tight leading-[1.08] [text-wrap:balance]"
          >
            The <Accent color="#569cd6">short</Accent> version.
            <SectionAnchor sectionId="resume" />
          </h2>
          <p className="text-[16px] text-[#aab2c0] [text-wrap:pretty]">
            One page, everything in one place.
          </p>
        </div>

        {/* Center: Window Frame (~640px wide on desktop hugging the sheet) */}
        <div className="w-full flex justify-center py-2">
          <div className="w-full max-w-[640px] rounded-2xl bg-[#12151c] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="px-4 py-2.5 bg-[#181c25] border-b border-white/5 flex items-center justify-between text-xs font-mono text-[#aab2c0]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                <div className="flex items-center space-x-1.5 ml-2">
                  <FileText className="w-3.5 h-3.5 text-[#569cd6]" />
                  <span className="text-[#f4f6fb] font-medium">resume.pdf</span>
                </div>
              </div>
            </div>

            {/* Stage: Hugging the page image, dark background, blue spotlight */}
            <div className="relative w-full bg-[#0a0c10] flex items-center justify-center p-4 sm:p-10 lg:p-12 overflow-hidden group/stage">
              {/* Soft Spotlight Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial from-[#569cd6]/15 via-transparent to-transparent opacity-80 pointer-events-none"
              />

              {imageFailed ? (
                /* Fallback if preview fails to load */
                <div className="py-20 text-center space-y-4">
                  <p className="text-sm font-mono text-[#aab2c0]">Resume document</p>
                  <a
                    href={PERSONAL_INFO.resumePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#569cd6] text-white font-mono text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open the PDF</span>
                  </a>
                </div>
              ) : (
                /* White paper sheet: 3-deg tilt & float on laptop, flat fit-to-width on mobile */
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(true)}
                  className="relative block w-full max-w-[480px] aspect-[1/1.414] rounded-lg overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(86,156,214,0.18)] transition-all duration-500 ease-out cursor-pointer md:rotate-3 md:animate-subtle-float hover:rotate-0 hover:scale-[1.02] hover:-translate-y-1 focus:rotate-0 focus:scale-[1.02] outline-none focus-visible:ring-2 focus-visible:ring-[#569cd6] group-hover/stage:rotate-0"
                  title="Click to zoom and view full Resume"
                  aria-label="Open zoomable resume viewer"
                >
                  <picture>
                    <source type="image/webp" media="(min-width: 768px)" srcSet="/resume/page-1-1600.webp" />
                    <source type="image/webp" srcSet="/resume/page-1-900.webp" />
                    <img
                      src="/resume/page-1.webp"
                      alt="Resume of Rohan Sai Jagan, page 1"
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      onError={() => setImageFailed(true)}
                      loading="lazy"
                    />
                  </picture>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar: Exactly 3 Buttons
            Desktop: centered flex-row below frame
            Phone (<768px): stacked full-width below sheet, min 48px high
        */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[640px] mx-auto pt-1">
          {/* 1. Primary: Download PDF */}
          <a
            href={PERSONAL_INFO.resumePdfUrl}
            download="Rohan_Sai_Jagan_Resume.pdf"
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#569cd6] hover:bg-[#488ac0] text-white text-xs font-mono font-semibold shadow-lg shadow-[#569cd6]/20 transition-all cursor-pointer flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            title="Download original PDF"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>

          {/* 2. Secondary: Open full size */}
          <a
            href={PERSONAL_INFO.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-[#181c25] hover:bg-white/10 border border-white/10 text-[#f4f6fb] text-xs font-mono transition-colors cursor-pointer flex items-center justify-center space-x-2"
            title="Open full size in a new tab"
          >
            <ExternalLink className="w-4 h-4 text-[#aab2c0]" />
            <span>Open full size</span>
          </a>

          {/* 3. Tertiary: Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-[#181c25] hover:bg-white/10 border border-white/10 text-[#f4f6fb] text-xs font-mono transition-colors cursor-pointer flex items-center justify-center space-x-2"
            title="Print Resume"
          >
            <Printer className="w-4 h-4 text-[#aab2c0]" />
            <span>Print</span>
          </button>
        </div>

        {/* Narrator Link at End */}
        <div className="pt-6 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleScrollToContact}
            className="font-mono text-xs text-[#aab2c0]/70 hover:text-[#569cd6] transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>// last chapter: yours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full-screen Zoomable Viewer Lightbox */}
      <ResumeViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        pageSrc="/resume/page-1-1600.webp"
      />
    </section>
  );
};
