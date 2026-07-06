"use client";

import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ServiceIllustration, type ServiceKind } from "@/components/illustrations";

/**
 * A fixed, faint background layer that floats the animated "omini" behind the
 * page content and makes them feel genuinely alive:
 *
 *   1. Parallax    — each figure drifts vertically/horizontally at its own
 *                    depth as you scroll.
 *   2. Idle motion — an autonomous bob + sway loop runs continuously, so the
 *                    figures are never frozen even when the page is still
 *                    (on top of each illustration's own internal animation).
 *   3. Scroll lean — the whole troupe leans in the direction of scrolling,
 *                    driven by scroll velocity, so they "react" to the user.
 *   4. Soft in/out — opacity breathes across the scroll so figures fade in and
 *                    out rather than sitting at a constant, static strength.
 *
 * Everything animates transform/opacity only (GPU-composited). Sits above
 * <GeometricBackground/> but below content; pointer-events are off and opacity
 * is kept low so text stays perfectly legible. Honours reduced-motion.
 */

export type OminoPlacement = {
  kind: ServiceKind;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** Rendered width, e.g. "clamp(180px, 26vw, 360px)". */
  width: string;
  /** Vertical parallax range in px across the full page scroll (default 120). */
  depth?: number;
  /** Horizontal drift in px across the full page scroll (default 0). */
  drift?: number;
  /** Rotation in deg across the full page scroll (default 0). */
  rotate?: number;
  /** 0..1 phase so figures breathe/idle out of sync with each other. */
  phase?: number;
};

const SCENES: Record<string, OminoPlacement[]> = {
  // Services page — all five areas spread around the edges.
  servizi: [
    {
      kind: "finanza-agevolata",
      top: "6%",
      left: "-4%",
      width: "clamp(190px,26vw,360px)",
      depth: 150,
      rotate: -4,
      phase: 0.0,
    },
    {
      kind: "trasferimento-tecnologico",
      top: "3%",
      right: "-5%",
      width: "clamp(200px,28vw,380px)",
      depth: 90,
      rotate: 4,
      phase: 0.3,
    },
    {
      kind: "ricerca-sviluppo",
      top: "44%",
      left: "-6%",
      width: "clamp(180px,24vw,340px)",
      depth: 180,
      drift: 26,
      rotate: 5,
      phase: 0.6,
    },
    {
      kind: "finanza-impresa",
      top: "62%",
      right: "-4%",
      width: "clamp(180px,24vw,340px)",
      depth: 150,
      drift: -22,
      rotate: -4,
      phase: 0.15,
    },
    {
      kind: "innovation-management",
      bottom: "1%",
      left: "30%",
      width: "clamp(220px,32vw,440px)",
      depth: 70,
      rotate: 2,
      phase: 0.45,
    },
  ],
  general: [
    {
      kind: "finanza-agevolata",
      top: "10%",
      right: "-4%",
      width: "clamp(180px,24vw,340px)",
      depth: 140,
      rotate: 4,
      phase: 0.1,
    },
    {
      kind: "innovation-management",
      top: "48%",
      left: "-6%",
      width: "clamp(190px,26vw,360px)",
      depth: 170,
      drift: 24,
      rotate: -4,
      phase: 0.5,
    },
    {
      kind: "trasferimento-tecnologico",
      bottom: "4%",
      right: "2%",
      width: "clamp(190px,26vw,360px)",
      depth: 90,
      rotate: 3,
      phase: 0.8,
    },
  ],
  contatti: [
    {
      kind: "finanza-agevolata",
      top: "12%",
      left: "-5%",
      width: "clamp(180px,24vw,340px)",
      depth: 150,
      rotate: -4,
      phase: 0.0,
    },
    {
      kind: "finanza-impresa",
      bottom: "6%",
      right: "-4%",
      width: "clamp(190px,26vw,360px)",
      depth: 110,
      rotate: 4,
      phase: 0.4,
    },
  ],
  bandi: [
    {
      kind: "finanza-agevolata",
      top: "8%",
      left: "-5%",
      width: "clamp(180px,24vw,340px)",
      depth: 150,
      rotate: -3,
      phase: 0.2,
    },
    {
      kind: "finanza-impresa",
      top: "52%",
      right: "-5%",
      width: "clamp(190px,26vw,360px)",
      depth: 170,
      drift: -22,
      rotate: 4,
      phase: 0.55,
    },
    {
      kind: "innovation-management",
      bottom: "2%",
      left: "26%",
      width: "clamp(210px,30vw,400px)",
      depth: 70,
      rotate: 2,
      phase: 0.85,
    },
  ],
};

function FloatingOmino({
  p,
  progress,
  lean,
}: {
  p: OminoPlacement;
  progress: MotionValue<number>;
  lean: MotionValue<number>;
}) {
  const depth = p.depth ?? 120;
  const y = useTransform(progress, [0, 1], [depth, -depth]);
  const x = useTransform(progress, [0, 1], [0, p.drift ?? 0]);
  const rotate = useTransform(progress, [0, 1], [0, p.rotate ?? 0]);

  // Breathe opacity across the scroll, offset by phase so the figures don't all
  // pulse together — gives the backdrop a shifting, living quality.
  const ph = p.phase ?? 0;
  const opacity = useTransform(
    progress,
    [0, 0.12 + ph * 0.1, 0.5, 0.88 - ph * 0.1, 1],
    [0.35, 1, 0.7, 1, 0.35],
  );

  const idleDur = 6 + ph * 4;

  return (
    <motion.div
      style={{
        y,
        x,
        rotate,
        opacity,
        top: p.top,
        bottom: p.bottom,
        left: p.left,
        right: p.right,
        width: p.width,
        willChange: "transform, opacity",
      }}
      className="absolute aspect-[340/240]"
    >
      {/* scroll-velocity lean — the whole figure tips toward the scroll direction */}
      <motion.div style={{ rotate: lean }} className="h-full w-full">
        {/* autonomous idle bob + sway — keeps the figure alive when still */}
        <motion.div
          animate={{ y: [0, -10, 0, 8, 0], rotate: [0, 1.6, 0, -1.6, 0] }}
          transition={{ duration: idleDur, repeat: Infinity, ease: "easeInOut", delay: ph * 2 }}
          className="h-full w-full"
        >
          <ServiceIllustration kind={p.kind} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StaticOmino({ p }: { p: OminoPlacement }) {
  return (
    <div
      style={{ top: p.top, bottom: p.bottom, left: p.left, right: p.right, width: p.width }}
      className="absolute aspect-[340/240]"
    >
      <ServiceIllustration kind={p.kind} />
    </div>
  );
}

export function OminiScrollLayer({
  variant = "general",
  placements,
}: {
  variant?: keyof typeof SCENES;
  placements?: OminoPlacement[];
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Smoothed scroll velocity → a small shared rotation. Spring keeps it from
  // snapping, so the lean eases in and recovers gently when scrolling stops.
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 120, damping: 30, mass: 0.6 });
  const lean = useTransform(smoothVel, [-2.5, 0, 2.5], [-7, 0, 7], { clamp: true });

  const scene = placements ?? SCENES[variant] ?? SCENES.general;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.10] dark:opacity-[0.16]">
        {scene.map((p, i) =>
          reduce ? (
            <StaticOmino key={i} p={p} />
          ) : (
            <FloatingOmino key={i} p={p} progress={scrollYProgress} lean={lean} />
          ),
        )}
      </div>
    </div>
  );
}
