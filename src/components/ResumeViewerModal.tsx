import React, { useState, useEffect, useRef } from 'react';
import { Download, ExternalLink, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.ts';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSrc?: string;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  pageSrc = '/resume/page-1-1600.webp',
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef<number>(0);

  // Lock body scroll and set up Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Reset zoom and position on open
    setScale(1);
    setPosition({ x: 0, y: 0 });

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Zoom handlers
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.35, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.35, 0.7));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setScale((s) => Math.max(0.7, Math.min(3, s + delta)));
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers (double-tap, pinch-to-zoom, pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        // Double tap toggle fit / zoom
        if (scale > 1) {
          setScale(1);
          setPosition({ x: 0, y: 0 });
        } else {
          setScale(2);
        }
      }
      lastTapTime.current = now;
      dragStart.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDist.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = dist - lastTouchDist.current;
      setScale((s) => Math.max(0.7, Math.min(3, s + diff * 0.005)));
      lastTouchDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDist.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Resume document viewer"
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in"
      onClick={onClose}
    >
      {/* Top Toolbar */}
      <div
        className="w-full px-4 sm:px-6 py-3.5 bg-[#12151c]/95 border-b border-white/10 flex items-center justify-between text-xs font-mono z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 text-[#f4f6fb]">
          <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
            Rohan_Sai_Jagan_Resume.pdf
          </span>
          <span className="text-[11px] text-[#569cd6] bg-[#569cd6]/10 px-2 py-0.5 rounded border border-[#569cd6]/20 hidden sm:inline">
            1600px High-Res
          </span>
        </div>

        {/* Toolbar Buttons: Zoom, Download, Open in new tab, Close */}
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1 border-r border-white/10 pr-2 mr-2 text-[#aab2c0]">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <a
            href={PERSONAL_INFO.resumePdfUrl}
            download="Rohan_Sai_Jagan_Resume.pdf"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#569cd6] hover:bg-[#488ac0] text-white text-xs font-mono font-medium transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <a
            href={PERSONAL_INFO.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181c25] hover:bg-white/10 border border-white/10 text-[#f4f6fb] text-xs font-mono transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in new tab</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#181c25] hover:bg-white/15 border border-white/10 text-[#aab2c0] hover:text-white transition-colors cursor-pointer ml-1"
            title="Close viewer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewer Stage: Zoomable and pannable image */}
      <div
        className="flex-1 w-full flex items-center justify-center overflow-hidden p-2 sm:p-6 relative cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'none' }}
      >
        <div
          className="relative max-w-full max-h-full transition-transform duration-75 ease-out shadow-2xl rounded-lg bg-white overflow-hidden"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={pageSrc}
            alt="Resume of Rohan Sai Jagan, page 1"
            className="max-h-[82vh] w-auto object-contain select-none pointer-events-none block"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className="w-full py-2 bg-[#12151c]/80 border-t border-white/5 text-center text-[11px] font-mono text-[#aab2c0]/60 z-20 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span>Scroll wheel or pinch to zoom · Drag to pan · Double-tap to reset</span>
      </div>
    </div>
  );
};
