"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * MASCOTTE AGJCONFIN — figure riusabili
 *
 * - <WalkMascot/>  : omino con ciclo del passo (gambe/braccia che oscillano dai
 *                    giunti + rimbalzo del peso). Facing destra (dir=1) o
 *                    sinistra (dir=-1). Usato per le sequenze "che cammina".
 * - <MascotPointing/> : posa statica che indica (con targhetta AGJ + mano reale),
 *                    usata a riposo / a fine camminata.
 *
 * I perni delle articolazioni usano originX/originY di framer-motion
 * (frazioni del bounding-box: originY:0 = giunto in alto, originY:1 = anca).
 */

const WALK = { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const };

/* ------------------------------------------------------------------ */
/*  Omino che cammina (ciclo del passo)                                */
/* ------------------------------------------------------------------ */
export function WalkMascot({
  dir = 1,
  className,
}: {
  dir?: 1 | -1;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spin = (kf: number[]) => (reduce ? {} : { rotate: kf });

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      {/* ombra */}
      <ellipse cx="100" cy="276" rx="40" ry="7" className="il-ink" opacity="0.14" />

      {/* rimbalzo del peso su tutta la figura */}
      <motion.g animate={reduce ? {} : { y: [0, -5, 0, -5, 0] }} transition={WALK}>
        <g transform={`translate(100 178) scale(${1.7 * dir} 1.7)`}>
          {/* gamba lontana */}
          <g transform="translate(-2 0)">
            <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin([-18, 18, -18])} transition={WALK}>
              <path d="M0 0 L-2 28 L1 55" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="3" cy="57" rx="9" ry="4.2" className="il-accent" />
            </motion.g>
          </g>

          {/* braccio lontano */}
          <g transform="translate(-11 -48)">
            <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin([15, -15, 15])} transition={WALK}>
              <path d="M0 0 L2 16 L0 32" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="0" cy="33" r="5" className="il-face" />
            </motion.g>
          </g>

          {/* busto + testa (leggero dondolio attorno all'anca) */}
          <motion.g style={{ originX: 0.5, originY: 1 }} animate={reduce ? {} : { rotate: [-1.6, 1.6, -1.6] }} transition={WALK}>
            <rect x="-14" y="-54" width="28" height="54" rx="13" className="il-top" stroke="var(--il-line)" strokeWidth="2" />
            <path d="M-13 -46 q-2 24 6 44 q-9 -8 -9 -24 q0 -12 3 -20 Z" className="il-soft" opacity="0.5" />
            {/* targhetta AGJ */}
            <rect x="0.5" y="-39" width="11.5" height="6" rx="2.4" className="il-accent" />
            <text x="6.25" y="-34.6" textAnchor="middle" fill="var(--il-top)" style={{ font: "700 4px 'Space Grotesk', sans-serif", letterSpacing: "0.15px" }}>AGJ</text>
            {/* collo + testa */}
            <rect x="-4" y="-60" width="8" height="9" rx="3" className="il-face" />
            <circle cx="0" cy="-66" r="13" className="il-face" />
            <path d="M-13 -67 a13 13 0 0 1 26 -1 q-13 -8 -26 1 Z" className="il-ink" />
          </motion.g>

          {/* braccio vicino */}
          <g transform="translate(11 -48)">
            <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin([-15, 15, -15])} transition={WALK}>
              <path d="M0 0 L2 16 L0 32" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="0" cy="33" r="5" className="il-face" />
            </motion.g>
          </g>

          {/* gamba vicina */}
          <g transform="translate(2 0)">
            <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin([18, -18, 18])} transition={WALK}>
              <path d="M0 0 L-2 28 L1 55" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="3" cy="57" rx="9" ry="4.2" className="il-accent" />
            </motion.g>
          </g>
        </g>
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Omino che indica (posa statica)                                    */
/* ------------------------------------------------------------------ */
export function MascotPointing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <g transform="translate(86 150) scale(1.7)">
        <ellipse cx="2" cy="66" rx="34" ry="6" className="il-ink" opacity="0.14" />

        {/* gamba dietro */}
        <path d="M-7 0 L-16 26 L-20 52" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-23" cy="55" rx="10" ry="4.5" className="il-accent" transform="rotate(-18 -23 55)" />
        {/* gamba avanti */}
        <path d="M7 0 L16 30 L14 58" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="18" cy="60" rx="12" ry="5" className="il-accent" />
        <ellipse cx="25" cy="58" rx="4" ry="3" className="il-accent" />

        {/* braccio dietro */}
        <path d="M-11 -48 L-20 -32 L-17 -16" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="-17" cy="-15" r="5" className="il-face" />

        {/* busto */}
        <g transform="rotate(5 0 -6)">
          <rect x="-14" y="-54" width="28" height="54" rx="13" className="il-top" stroke="var(--il-line)" strokeWidth="2" />
          <path d="M-13 -46 q-2 24 6 44 q-9 -8 -9 -24 q0 -12 3 -20 Z" className="il-soft" opacity="0.55" />
          <rect x="0.5" y="-39" width="11.5" height="6" rx="2.4" className="il-accent" />
          <text x="6.25" y="-34.6" textAnchor="middle" fill="var(--il-top)" style={{ font: "700 4px 'Space Grotesk', sans-serif", letterSpacing: "0.15px" }}>AGJ</text>
        </g>

        {/* collo */}
        <rect x="-4" y="-60" width="8" height="9" rx="3" className="il-face" />

        {/* braccio che indica */}
        <path d="M11 -48 L28 -54 L44 -62" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="45" cy="-61" rx="6" ry="5" className="il-face" transform="rotate(-30 45 -61)" />
        <path d="M46 -62.5 L58 -70.5" stroke="var(--il-face)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <circle cx="58.4" cy="-70.8" r="1.85" className="il-face" />
        <path d="M42 -57.6 q3.6 -0.4 5.2 -2.6" stroke="var(--il-face)" strokeWidth="3.1" strokeLinecap="round" fill="none" />
        <path d="M43 -63.2 q3 2.3 6 0.5" stroke="var(--il-line)" strokeWidth="0.8" fill="none" opacity="0.45" />

        {/* testa */}
        <circle cx="2" cy="-66" r="13" className="il-face" />
        <path d="M-11 -67 a13 13 0 0 1 26 -1 q-13 -8 -26 1 Z" className="il-ink" />
      </g>
    </svg>
  );
}
