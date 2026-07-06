"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Lightweight, refined confetti burst.
 *
 * Animates only `transform` (translate/rotate) and `opacity`, so every piece is
 * GPU-composited — no layout, no paint thrash, no canvas. Designed to read as
 * "premium celebration" rather than a party popper: a restrained number of
 * brand-tinted shards that burst from the centre and settle with gravity.
 *
 * Honours `prefers-reduced-motion`: when reduced motion is requested it renders
 * nothing, so the success state stays calm.
 */

const COLORS = [
  "#0d4a5c", // petrol
  "#2a8aa0", // petrol light
  "#4fb1c4", // teal glow
  "#7fd4e3", // bright teal
  "#e9b949", // warm gold accent
  "#ffffff",
];

type Piece = {
  id: number;
  angle: number; // radians, burst direction
  distance: number; // px from origin
  drop: number; // extra downward settle
  size: number;
  rounded: boolean;
  color: string;
  delay: number;
  spin: number;
  duration: number;
  driftX: number;
};

function buildPieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    // Bias the burst upward/outward so it fans like a real popper.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
    const distance = 90 + Math.random() * 190;
    return {
      id: i,
      angle,
      distance,
      drop: 120 + Math.random() * 220,
      size: 6 + Math.random() * 8,
      rounded: Math.random() > 0.5,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.12,
      spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
      duration: 1.6 + Math.random() * 1.2,
      driftX: (Math.random() - 0.5) * 80,
    };
  });
}

export function Confetti({ count = 46 }: { count?: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(() => buildPieces(count), [count]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <div className="absolute left-1/2 top-[38%]">
        {pieces.map((p) => {
          const tx = Math.cos(p.angle) * p.distance + p.driftX;
          const ty = Math.sin(p.angle) * p.distance + p.drop;
          return (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: tx,
                y: ty,
                rotate: p.spin,
                opacity: [1, 1, 0],
                scale: 1,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: [0.18, 0.7, 0.35, 1],
                opacity: { duration: p.duration, times: [0, 0.7, 1] },
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.rounded ? p.size : p.size * 0.5,
                borderRadius: p.rounded ? "9999px" : "2px",
                background: p.color,
                willChange: "transform, opacity",
                boxShadow: "0 1px 2px rgba(6,46,60,0.18)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
