import React, { useState, useRef, useEffect, useCallback } from 'react';

// Cube face sticker colors (muted palette from spec)
const COLORS = {
  U: '#e8ecf4', // Up (White)
  D: '#e6c35c', // Down (Yellow)
  F: '#3fa37a', // Front (Green)
  B: '#4a7fd1', // Back (Blue)
  L: '#e0803f', // Left (Orange)
  R: '#d4524e', // Right (Red)
  body: '#0f1218',
};

export type Axis = 'x' | 'y' | 'z';

export interface Move {
  name: string;
  axis: Axis;
  layer: number; // -1 or 1
  dir: number; // 1 or -1
}

export const MOVES_CONFIG: Record<string, Move> = {
  U: { name: 'U', axis: 'y', layer: -1, dir: -1 },
  D: { name: 'D', axis: 'y', layer: 1, dir: 1 },
  L: { name: 'L', axis: 'x', layer: -1, dir: -1 },
  R: { name: 'R', axis: 'x', layer: 1, dir: 1 },
  F: { name: 'F', axis: 'z', layer: 1, dir: 1 },
  B: { name: 'B', axis: 'z', layer: -1, dir: -1 },
};

function matMul(A: number[], B: number[]): number[] {
  const C = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      C[r * 3 + c] =
        A[r * 3 + 0] * B[0 * 3 + c] +
        A[r * 3 + 1] * B[1 * 3 + c] +
        A[r * 3 + 2] * B[2 * 3 + c];
    }
  }
  return C;
}

function vecMul(A: number[], v: [number, number, number]): [number, number, number] {
  return [
    A[0] * v[0] + A[1] * v[1] + A[2] * v[2],
    A[3] * v[0] + A[4] * v[1] + A[5] * v[2],
    A[6] * v[0] + A[7] * v[1] + A[8] * v[2],
  ];
}

function getRotMatrix(axis: Axis, dir: number): number[] {
  if (axis === 'x') return [1, 0, 0, 0, 0, -dir, 0, dir, 0];
  if (axis === 'y') return [0, 0, dir, 0, 1, 0, -dir, 0, 0];
  return [0, -dir, 0, dir, 0, 0, 0, 0, 1];
}

const AXIS_INDEX: Record<Axis, number> = { x: 0, y: 1, z: 2 };

export interface Cubie {
  id: string;
  initPos: [number, number, number];
  pos: [number, number, number];
  rot: number[];
}

function createSolvedCubies(): Cubie[] {
  const list: Cubie[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        list.push({
          id: `${x},${y},${z}`,
          initPos: [x, y, z],
          pos: [x, y, z],
          rot: [1, 0, 0, 0, 1, 0, 0, 0, 1],
        });
      }
    }
  }
  return list;
}

export function isCubeSolved(cubies: Cubie[]): boolean {
  const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  return cubies.every(
    (c) =>
      c.pos[0] === c.initPos[0] &&
      c.pos[1] === c.initPos[1] &&
      c.pos[2] === c.initPos[2] &&
      c.rot.every((val, idx) => val === I[idx])
  );
}

export const RubiksCube: React.FC = () => {
  const [cubies, setCubies] = useState<Cubie[]>(createSolvedCubies);
  const [history, setHistory] = useState<Move[]>([]);
  const [isScrambling, setIsScrambling] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [showSolvedToast, setShowSolvedToast] = useState(false);
  const [solvedGlow, setSolvedGlow] = useState(false);

  // Rotation angles for scene view
  const [rotX, setRotX] = useState(-26);
  const [rotY, setRotY] = useState(38);
  const [isDragging, setIsDragging] = useState(false);

  // Active turning state for animated layer
  const [turningMove, setTurningMove] = useState<{
    axis: Axis;
    layer: number;
    angle: number;
  } | null>(null);

  const cubiesRef = useRef(cubies);
  cubiesRef.current = cubies;
  const historyRef = useRef(history);
  historyRef.current = history;

  const isBusyRef = useRef(false);
  const moveQueue = useRef<Array<{ move: Move; duration: number }>>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const autoRotateTimer = useRef<number | null>(null);
  const isInteractingRef = useRef(false);
  const isInViewRef = useRef(true);

  // Check reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Track visibility to pause animation loops when off-screen
  useEffect(() => {
    const el = sceneRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Expose model to window for Playwright automated testing
  useEffect(() => {
    (window as any).__RUBIK_MODEL__ = {
      getCubies: () => cubiesRef.current,
      isSolved: () => isCubeSolved(cubiesRef.current),
      getHistory: () => historyRef.current,
      isBusy: () => isBusyRef.current,
    };
    return () => {
      delete (window as any).__RUBIK_MODEL__;
    };
  }, []);

  // Idle auto-rotation loop
  useEffect(() => {
    let animId: number;
    let prev = performance.now();

    const loop = (now: number) => {
      const delta = (now - prev) / 1000;
      prev = now;

      if (!isInteractingRef.current && isInViewRef.current && !prefersReducedMotion) {
        setRotY((y) => (y + delta * 9) % 360);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [prefersReducedMotion]);

  // Execute a single move animation
  const executeMove = useCallback(
    (move: Move, duration: number): Promise<void> => {
      return new Promise((resolve) => {
        if (prefersReducedMotion) {
          // Instant commit
          const R = getRotMatrix(move.axis, move.dir);
          const aIdx = AXIS_INDEX[move.axis];
          setCubies((prev) =>
            prev.map((c) =>
              c.pos[aIdx] === move.layer
                ? {
                    ...c,
                    pos: vecMul(R, c.pos),
                    rot: matMul(R, c.rot),
                  }
                : c
            )
          );
          resolve();
          return;
        }

        const targetAngle = move.dir * 90;
        const startTime = performance.now();

        // Safety fallback timeout
        const fallback = setTimeout(() => {
          commit();
          resolve();
        }, duration + 300);

        const commit = () => {
          clearTimeout(fallback);
          const R = getRotMatrix(move.axis, move.dir);
          const aIdx = AXIS_INDEX[move.axis];
          setCubies((prev) =>
            prev.map((c) =>
              c.pos[aIdx] === move.layer
                ? {
                    ...c,
                    pos: vecMul(R, c.pos),
                    rot: matMul(R, c.rot),
                  }
                : c
            )
          );
          setTurningMove(null);
        };

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Ease-in-out curve
          const ease =
            progress < 0.5
              ? 2 * progress * progress
              : -1 + (4 - 2 * progress) * progress;

          const currentAngle = targetAngle * ease;
          setTurningMove({
            axis: move.axis,
            layer: move.layer,
            angle: currentAngle,
          });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            commit();
            resolve();
          }
        };

        requestAnimationFrame(step);
      });
    },
    [prefersReducedMotion]
  );

  // Process move queue
  const processQueue = useCallback(async () => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      while (moveQueue.current.length > 0) {
        const item = moveQueue.current.shift();
        if (item) {
          await executeMove(item.move, item.duration);
        }
      }
    } catch {
      // Recover if an error occurs
      moveQueue.current = [];
      setTurningMove(null);
    } finally {
      isBusyRef.current = false;
      // Check if solved
      if (isCubeSolved(cubiesRef.current)) {
        setSolvedGlow(true);
        setShowSolvedToast(true);
        setAnnouncement('Solved.');
        setTimeout(() => {
          setSolvedGlow(false);
          setShowSolvedToast(false);
        }, 3000);
      }
    }
  }, [executeMove]);

  // Queue a manual move
  const triggerMove = useCallback(
    (name: string, isInverse = false) => {
      const base = MOVES_CONFIG[name];
      if (!base) return;

      const move: Move = {
        name: isInverse ? `${name}'` : name,
        axis: base.axis,
        layer: base.layer,
        dir: isInverse ? -base.dir : base.dir,
      };

      setHistory((prev) => [...prev, move]);
      moveQueue.current.push({ move, duration: 260 });
      processQueue();
    },
    [processQueue]
  );

  // Scramble (20 random moves, never same face twice in a row)
  const handleScramble = useCallback(async () => {
    if (isScrambling || isSolving) return;
    setIsScrambling(true);
    setAnnouncement('Scrambled');

    const moveKeys = Object.keys(MOVES_CONFIG);
    const newMoves: Move[] = [];
    let prevFace = '';

    for (let i = 0; i < 20; i++) {
      const choices = moveKeys.filter((k) => k !== prevFace);
      const face = choices[Math.floor(Math.random() * choices.length)];
      const isInv = Math.random() < 0.5;
      const base = MOVES_CONFIG[face];
      newMoves.push({
        name: isInv ? `${face}'` : face,
        axis: base.axis,
        layer: base.layer,
        dir: isInv ? -base.dir : base.dir,
      });
      prevFace = face;
    }

    setHistory((prev) => [...prev, ...newMoves]);
    for (const m of newMoves) {
      moveQueue.current.push({ move: m, duration: 90 });
    }
    await processQueue();
    setIsScrambling(false);
  }, [isScrambling, isSolving, processQueue]);

  // Solve (plays inverses in reverse order)
  const handleSolve = useCallback(async () => {
    if (isSolving || isScrambling || historyRef.current.length === 0) return;
    setIsSolving(true);

    const hist = [...historyRef.current];
    const solveMoves: Move[] = [];

    for (let i = hist.length - 1; i >= 0; i--) {
      const m = hist[i];
      solveMoves.push({
        name: m.name.endsWith("'") ? m.name.slice(0, 1) : `${m.name}'`,
        axis: m.axis,
        layer: m.layer,
        dir: -m.dir,
      });
    }

    for (const m of solveMoves) {
      moveQueue.current.push({ move: m, duration: 110 });
    }
    await processQueue();
    setHistory([]);
    setIsSolving(false);
  }, [isSolving, isScrambling, processQueue]);

  // Reset (snaps to identity, clears history)
  const handleReset = useCallback(() => {
    moveQueue.current = [];
    setTurningMove(null);
    isBusyRef.current = false;
    setCubies(createSolvedCubies());
    setHistory([]);
    setIsSolving(false);
    setIsScrambling(false);
    setAnnouncement('Reset to solved state.');
  }, []);

  // Keyboard navigation when cube has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
      e.preventDefault();
      triggerMove(key, e.shiftKey);
    }
  };

  // Drag controls on scene
  const lastPointer = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    isInteractingRef.current = true;
    if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    if (sceneRef.current) {
      sceneRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.45);
    setRotX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.45)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      if (sceneRef.current) {
        sceneRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    if (autoRotateTimer.current) clearTimeout(autoRotateTimer.current);
    autoRotateTimer.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 2000);
  };

  const cubieSize = 64; // at least 300px total viewport
  const offset = 68;

  const isSolved = isCubeSolved(cubies);

  // Expose model to window for automated testing
  useEffect(() => {
    (window as any).__RUBIK_MODEL__ = {
      isSolved,
      cubies,
      historyLength: history.length,
      isBusy: isBusyRef.current,
    };
  }, [isSolved, cubies, history.length]);

  return (
    <div
      className="flex flex-col items-center justify-center select-none w-full"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Interactive 3D Rubik's Cube puzzle"
    >
      {/* Live region for accessibility announcements */}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* 3D Perspective Scene Container: Buttons are STRICTLY outside so pointer-capture never captures them */}
      <div
        ref={sceneRef}
        id="rubik-cube-scene"
        data-testid="rubiks-cube-scene"
        data-solved={isSolved ? 'true' : 'false'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          perspective: '900px',
          touchAction: 'pan-y',
        }}
        className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-visible"
        title="Drag to view all sides of the Rubik's cube. Press U, D, L, R, F, B to rotate."
      >
        {/* Soft floor shadow and pink ambient floor glow */}
        <div
          aria-hidden="true"
          className={`absolute bottom-4 w-48 h-12 bg-black/60 blur-xl rounded-full pointer-events-none transition-all duration-500 ${
            solvedGlow ? 'shadow-[0_0_50px_#d16d9e] bg-[#d16d9e]/30' : ''
          }`}
        />

        {/* Cube Assembly Container */}
        <div
          id="rubik-cube-assembly"
          className="relative transition-transform duration-75 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            width: 0,
            height: 0,
          }}
        >
          {cubies.map((c) => {
            const isTurning =
              turningMove &&
              c.pos[AXIS_INDEX[turningMove.axis]] === turningMove.layer;

            let turnTransform = '';
            if (isTurning && turningMove) {
              if (turningMove.axis === 'x') {
                turnTransform = `rotateX(${turningMove.angle}deg) `;
              } else if (turningMove.axis === 'y') {
                turnTransform = `rotateY(${turningMove.angle}deg) `;
              } else if (turningMove.axis === 'z') {
                turnTransform = `rotateZ(${turningMove.angle}deg) `;
              }
            }

            const m = c.rot;
            // Matrix3D column-major string
            const mat3d = `matrix3d(${m[0]}, ${m[3]}, ${m[6]}, 0, ${m[1]}, ${m[4]}, ${m[7]}, 0, ${m[2]}, ${m[5]}, ${m[8]}, 0, 0, 0, 0, 1)`;

            const cubieTransform = `${turnTransform}translate3d(${c.pos[0] * offset}px, ${
              c.pos[1] * offset
            }px, ${c.pos[2] * offset}px) ${mat3d}`;

            // Stickers attached to initial physical faces
            const hasU = c.initPos[1] === -1;
            const hasD = c.initPos[1] === 1;
            const hasL = c.initPos[0] === -1;
            const hasR = c.initPos[0] === 1;
            const hasF = c.initPos[2] === 1;
            const hasB = c.initPos[2] === -1;

            const half = cubieSize / 2;

            return (
              <div
                key={c.id}
                className="absolute"
                style={{
                  width: cubieSize,
                  height: cubieSize,
                  left: -cubieSize / 2,
                  top: -cubieSize / 2,
                  transformStyle: 'preserve-3d',
                  transform: cubieTransform,
                }}
              >
                {/* Front Face (+Z) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasF ? COLORS.F : COLORS.body,
                    transform: `translateZ(${half}px)`,
                  }}
                />

                {/* Back Face (-Z) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasB ? COLORS.B : COLORS.body,
                    transform: `rotateY(180deg) translateZ(${half}px)`,
                  }}
                />

                {/* Right Face (+X) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasR ? COLORS.R : COLORS.body,
                    transform: `rotateY(90deg) translateZ(${half}px)`,
                  }}
                />

                {/* Left Face (-X) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasL ? COLORS.L : COLORS.body,
                    transform: `rotateY(-90deg) translateZ(${half}px)`,
                  }}
                />

                {/* Top Face (-Y) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasU ? COLORS.U : COLORS.body,
                    transform: `rotateX(90deg) translateZ(${half}px)`,
                  }}
                />

                {/* Bottom Face (+Y) */}
                <div
                  className="absolute inset-0 rounded-[4px] border border-black/60 shadow-xs"
                  style={{
                    backgroundColor: hasD ? COLORS.D : COLORS.body,
                    transform: `rotateX(-90deg) translateZ(${half}px)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Control Buttons (Scramble, Solve, Reset) */}
      <div className="flex items-center space-x-2 pt-4">
        <button
          id="rubik-scramble-btn"
          data-testid="rubiks-scramble-button"
          onClick={handleScramble}
          disabled={isScrambling || isSolving}
          className="px-4 py-1.5 rounded-xl bg-[#181c25] hover:bg-white/10 border border-white/10 text-xs font-mono text-[#f4f6fb] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {isScrambling ? 'Scrambling…' : 'Scramble'}
        </button>

        <button
          id="rubik-solve-btn"
          data-testid="rubiks-solve-button"
          onClick={handleSolve}
          disabled={history.length === 0 || isSolving || isScrambling}
          className="px-4 py-1.5 rounded-xl bg-[#d16d9e]/20 hover:bg-[#d16d9e]/30 border border-[#d16d9e]/40 text-xs font-mono text-[#d16d9e] font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSolving ? 'Solving…' : 'Solve'}
        </button>

        <button
          id="rubik-reset-btn"
          data-testid="rubiks-reset-button"
          onClick={handleReset}
          disabled={isScrambling || isSolving}
          className="px-3 py-1.5 rounded-xl bg-[#181c25] hover:bg-white/10 border border-white/10 text-xs font-mono text-[#aab2c0] hover:text-white transition-all cursor-pointer disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
        >
          Reset
        </button>
      </div>

      {/* Small Move Pad per spec (U D L R F B) */}
      <div className="flex items-center space-x-1 pt-2.5">
        {(['U', 'D', 'L', 'R', 'F', 'B'] as const).map((face) => (
          <button
            key={face}
            onClick={() => triggerMove(face)}
            disabled={isScrambling || isSolving}
            className="w-7 h-7 rounded-lg bg-[#181c25]/80 hover:bg-[#d16d9e]/20 border border-white/5 text-[11px] font-mono text-[#aab2c0] hover:text-[#d16d9e] transition-colors cursor-pointer disabled:opacity-30"
            title={`Rotate ${face} (Shift for reverse)`}
          >
            {face}
          </button>
        ))}
      </div>

      {/* Caption */}
      <p className="font-mono text-xs text-[#aab2c0]/70 text-center pt-3">
        // learned to solve this recently. Scramble first, then Solve.
      </p>

      {/* Solved Toast */}
      {showSolvedToast && (
        <div className="mt-2 px-3 py-1 rounded-lg bg-[#d16d9e]/20 border border-[#d16d9e]/40 text-[#d16d9e] font-mono text-xs font-bold animate-pulse">
          ✓ Solved.
        </div>
      )}
    </div>
  );
};
