import React, { useEffect, useRef } from 'react';

const GLYPHS = [
  '{ }', '=>', '</>', ';', 'const', 'async', 'await', '[ ]', '( )', '0', '1',
  'fn()', 'return', 'import', 'export', ':', '&&', '||', '===',
];

const SYNTAX_COLORS = [
  '#569cd6', // keyword blue
  '#4ec9b0', // type teal
  '#dcdcaa', // function yellow
  '#c586c0', // purple
  '#ce9178', // string orange
  '#6a9955', // comment green
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  size: number;
  hasGravity?: boolean;
}

interface FloatingToken {
  x: number;
  y: number;
  char: string;
  depth: number;
  baseOpacity: number;
  blur: number;
}

export const PaintWithCodeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Visibility observer to pause off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisibleRef.current = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Floating depth tokens along edges (never inside center text column)
    const floatingTokens: FloatingToken[] = [
      { x: 0.08, y: 0.15, char: '{ }', depth: 0.4, baseOpacity: 0.18, blur: 0 },
      { x: 0.05, y: 0.45, char: 'async', depth: 0.7, baseOpacity: 0.14, blur: 1 },
      { x: 0.12, y: 0.75, char: '</>', depth: 0.3, baseOpacity: 0.16, blur: 0 },
      { x: 0.88, y: 0.18, char: '=>', depth: 0.5, baseOpacity: 0.18, blur: 0 },
      { x: 0.92, y: 0.52, char: 'await', depth: 0.8, baseOpacity: 0.12, blur: 1.5 },
      { x: 0.85, y: 0.82, char: '[ ]', depth: 0.3, baseOpacity: 0.17, blur: 0 },
      { x: 0.18, y: 0.92, char: 'const', depth: 0.6, baseOpacity: 0.14, blur: 1 },
      { x: 0.82, y: 0.32, char: ';', depth: 0.2, baseOpacity: 0.19, blur: 0 },
    ];

    const particles: Particle[] = [];
    const MAX_PARTICLES = 600;

    let lastX = -1;
    let lastY = -1;
    let lastTime = performance.now();
    let lastInteractionTime = performance.now();
    let mousePos = { x: width * 0.5, y: height * 0.5 };

    const addParticle = (
      x: number,
      y: number,
      angle: number,
      speed = 0.5,
      hasGravity = false
    ) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      // Pick syntax color by angle
      const normAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const colorIndex = Math.floor((normAngle / (Math.PI * 2)) * SYNTAX_COLORS.length) % SYNTAX_COLORS.length;
      const color = SYNTAX_COLORS[colorIndex];
      const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

      const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4;
      const vy = Math.sin(angle) * speed + (Math.random() - 0.5) * 0.4;
      const life = 2500; // 2.5s lifetime

      particles.push({
        x,
        y,
        vx,
        vy,
        char,
        color,
        opacity: 0,
        maxOpacity: 0.42, // Capped at 45% for high text contrast
        life,
        maxLife: life,
        size: Math.floor(Math.random() * 4) + 12,
        hasGravity,
      });
    };

    // Burst of 40 glyphs on click
    const handleBurst = (cx: number, cy: number) => {
      lastInteractionTime = performance.now();
      const count = 40;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 2.8 + 1.2;
        addParticle(cx, cy, angle, speed, true);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      lastInteractionTime = performance.now();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      mousePos = { x: clientX, y: clientY };

      if (lastX < 0) {
        lastX = clientX;
        lastY = clientY;
        return;
      }

      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const dist = Math.hypot(dx, dy);

      // Emit roughly every 14px
      if (dist >= 14) {
        const angle = Math.atan2(dy, dx);
        const steps = Math.min(Math.floor(dist / 14), 4);
        for (let i = 1; i <= steps; i++) {
          const interpX = lastX + (dx / steps) * i;
          const interpY = lastY + (dy / steps) * i;
          addParticle(interpX, interpY, angle + (Math.random() - 0.5) * 0.4, 0.4);
        }
        lastX = clientX;
        lastY = clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Don't burst if clicking directly on a button or link
      const target = e.target as HTMLElement;
      if (target?.closest('button') || target?.closest('a') || target?.closest('input')) {
        return;
      }
      handleBurst(e.clientX, e.clientY);
    };

    const handleCustomBurst = (e: Event) => {
      const custom = e as CustomEvent<{ x: number; y: number }>;
      if (custom.detail) {
        handleBurst(custom.detail.x, custom.detail.y);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('rohan-glyph-burst', handleCustomBurst);

    // Animation Loop
    const render = (time: number) => {
      const dt = Math.min(time - lastTime, 100);
      lastTime = time;

      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, width, height);

        // If reduced motion: draw subtle static tokens only
        if (prefersReducedMotion) {
          ctx.font = '13px "JetBrains Mono", monospace';
          floatingTokens.forEach((tok) => {
            ctx.fillStyle = `rgba(86, 156, 214, 0.15)`;
            ctx.fillText(tok.char, tok.x * width, tok.y * height);
          });
          return;
        }

        // 1. Draw floating edge tokens with pointer parallax
        ctx.font = '13px "JetBrains Mono", monospace';
        const pxNorm = (mousePos.x / width - 0.5) * 2;
        const pyNorm = (mousePos.y / height - 0.5) * 2;

        floatingTokens.forEach((tok) => {
          const offsetX = pxNorm * tok.depth * 24;
          const offsetY = pyNorm * tok.depth * 24;
          ctx.fillStyle = `rgba(244, 246, 251, ${tok.baseOpacity})`;
          ctx.fillText(tok.char, tok.x * width + offsetX, tok.y * height + offsetY);
        });

        // 2. Idle auto-brush (traces a gentle Lissajous path when idle > 3s)
        const idleDuration = time - lastInteractionTime;
        if (idleDuration > 3000) {
          const t = time * 0.0008;
          const autoX = width * 0.5 + Math.sin(t) * (width * 0.38);
          const autoY = height * 0.5 + Math.sin(t * 2.1 + Math.PI / 4) * (height * 0.32);
          const autoAngle = Math.atan2(Math.cos(t * 2.1) * height * 0.32, Math.cos(t) * width * 0.38);

          if (Math.random() < 0.35) {
            addParticle(autoX, autoY, autoAngle, 0.35);
          }
        }

        // 3. Update & render painted glyph particles
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= dt;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Movement + slight drift
          p.x += p.vx;
          p.y += p.vy;

          if (p.hasGravity) {
            p.vy += 0.04; // Gentle gravity
          } else {
            p.vx *= 0.99;
            p.vy *= 0.99;
          }

          // Fade-in during first 150ms, fade-out during last 800ms
          const elapsed = p.maxLife - p.life;
          if (elapsed < 150) {
            p.opacity = (elapsed / 150) * p.maxOpacity;
          } else if (p.life < 800) {
            p.opacity = (p.life / 800) * p.maxOpacity;
          } else {
            p.opacity = p.maxOpacity;
          }

          // Draw glyph
          ctx.font = `${p.size}px "JetBrains Mono", monospace`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillText(p.char, p.x, p.y);
        }

        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('rohan-glyph-burst', handleCustomBurst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -z-10 select-none overflow-hidden"
    />
  );
};
