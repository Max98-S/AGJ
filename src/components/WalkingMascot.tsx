"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * MASCOTTE AGJCONFIN — figure riusabili (movimenti fluidi allo scroll)
 *
 * - <WalkMascot dir/>     : ciclo del passo umano con ginocchio articolato
 *                           (anca + ginocchio + oscillazione braccia + rimbalzo
 *                           del peso + leggero dondolio). dir 1 = verso destra,
 *                           dir -1 = verso sinistra (speculare).
 * - <MascotPointing dir/> : posa statica che indica.
 * - <MascotTaDaa dir/>    : posa "ta-daa!" — presenta con entrambe le mani.
 *
 * La scritta AGJ viene contro-specchiata (scale(dir 1)) così resta sempre
 * leggibile anche quando la figura è ribaltata.
 */

const TIMES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const WALK = {
  duration: 1.05,
  times: TIMES,
  ease: "linear" as const,
  repeat: Infinity,
  repeatType: "loop" as const,
};

// cicli campionati su una sinusoide (9 punti) → interpolazione fluida
const THIGH_N = [-24, -17, 0, 17, 24, 17, 0, -17, -24];
const THIGH_F = [24, 17, 0, -17, -24, -17, 0, 17, 24];
const KNEE_N = [22, 6.4, 0, 6.4, 22, 37.6, 44, 37.6, 22];
const KNEE_F = [22, 37.6, 44, 37.6, 22, 6.4, 0, 6.4, 22];
const ARM_N = [-18, -12.7, 0, 12.7, 18, 12.7, 0, -12.7, -18];
const ARM_F = [18, 12.7, 0, -12.7, -18, -12.7, 0, 12.7, 18];
const SWAY = [0, 1.1, 1.5, 1.1, 0, -1.1, -1.5, -1.1, 0];
const BOB = [0, -2, -4, -2, 0, -2, -4, -2, 0];

function AgjTag({ dir }: { dir: 1 | -1 }) {
  return (
    <>
      <rect x="0.5" y="-39" width="11.5" height="6" rx="2.4" className="il-accent" />
      <g transform={`translate(6.25 -34.6) scale(${dir} 1)`}>
        <text x="0" y="0" textAnchor="middle" fill="var(--il-top)" style={{ font: "700 4px 'Space Grotesk', sans-serif", letterSpacing: "0.15px" }}>AGJ</text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Omino che cammina — ciclo del passo con ginocchio                  */
/* ------------------------------------------------------------------ */
export function WalkMascot({ dir = 1, className }: { dir?: 1 | -1; className?: string }) {
  const reduce = useReducedMotion();
  const spin = (kf: number[]) => (reduce ? {} : { rotate: kf });

  const Leg = (thigh: number[], knee: number[], hipX: number) => (
    <g transform={`translate(${hipX} 0)`}>
      <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin(thigh)} transition={WALK}>
        <path d="M0 0 L0 28" className="il-s-ink" strokeWidth="12" strokeLinecap="round" />
        <g transform="translate(0 28)">
          <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin(knee)} transition={WALK}>
            <path d="M0 0 L0 26" className="il-s-ink" strokeWidth="11" strokeLinecap="round" />
            <ellipse cx="1.5" cy="27" rx="9" ry="4.2" className="il-accent" />
          </motion.g>
        </g>
      </motion.g>
    </g>
  );

  const Arm = (kf: number[], shX: number) => (
    <g transform={`translate(${shX} -48)`}>
      <motion.g style={{ originX: 0.5, originY: 0 }} animate={spin(kf)} transition={WALK}>
        <path d="M0 0 L-0.5 15 L0 30" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="0" cy="31" r="5" className="il-face" />
      </motion.g>
    </g>
  );

  return (
    <svg viewBox="0 0 200 300" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <motion.g animate={reduce ? {} : { y: BOB }} transition={WALK}>
        <g transform={`translate(100 176) scale(${1.7 * dir} 1.7)`}>
          {/* arti lontani */}
          {Leg(THIGH_F, KNEE_F, -2)}
          {Arm(ARM_F, -11)}

          {/* busto + testa (dondolio attorno all'anca) */}
          <motion.g style={{ originX: 0.5, originY: 1 }} animate={reduce ? {} : { rotate: SWAY }} transition={WALK}>
            <rect x="-14" y="-54" width="28" height="54" rx="13" className="il-top" stroke="var(--il-line)" strokeWidth="2" />
            <path d="M-13 -46 q-2 24 6 44 q-9 -8 -9 -24 q0 -12 3 -20 Z" className="il-soft" opacity="0.5" />
            <AgjTag dir={dir} />
            <rect x="-4" y="-60" width="8" height="9" rx="3" className="il-face" />
            <circle cx="0" cy="-66" r="13" className="il-face" />
            <path d="M-13 -67 a13 13 0 0 1 26 -1 q-13 -8 -26 1 Z" className="il-ink" />
          </motion.g>

          {/* arti vicini */}
          {Arm(ARM_N, 11)}
          {Leg(THIGH_N, KNEE_N, 2)}
        </g>
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Omino che indica (statico)                                         */
/* ------------------------------------------------------------------ */
export function MascotPointing({ dir = 1, className }: { dir?: 1 | -1; className?: string }) {
  return (
    <svg viewBox="0 0 200 300" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <g transform={`translate(100 150) scale(${1.7 * dir} 1.7)`}>
        {/* gamba dietro */}
        <path d="M-7 0 L-16 26 L-20 52" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-23" cy="55" rx="10" ry="4.5" className="il-accent" transform="rotate(-18 -23 55)" />
        {/* gamba avanti */}
        <path d="M7 0 L16 30 L14 58" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="18" cy="60" rx="12" ry="5" className="il-accent" />

        {/* braccio dietro */}
        <path d="M-11 -48 L-20 -32 L-17 -16" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="-17" cy="-15" r="5" className="il-face" />

        {/* busto */}
        <g transform="rotate(5 0 -6)">
          <rect x="-14" y="-54" width="28" height="54" rx="13" className="il-top" stroke="var(--il-line)" strokeWidth="2" />
          <path d="M-13 -46 q-2 24 6 44 q-9 -8 -9 -24 q0 -12 3 -20 Z" className="il-soft" opacity="0.55" />
          <AgjTag dir={dir} />
        </g>
        <rect x="-4" y="-60" width="8" height="9" rx="3" className="il-face" />

        {/* braccio che indica */}
        <path d="M11 -48 L28 -54 L44 -62" className="il-s-top" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="43.5" cy="-61" rx="4" ry="3.4" className="il-face" transform="rotate(-30 43.5 -61)" />
        <path d="M44.5 -61.5 L51 -66" stroke="var(--il-face)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="51.2" cy="-66.2" r="1.25" className="il-face" />
        <path d="M41.5 -58 q2.4 -0.2 3.4 -1.8" stroke="var(--il-face)" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* testa */}
        <circle cx="2" cy="-66" r="13" className="il-face" />
        <path d="M-11 -67 a13 13 0 0 1 26 -1 q-13 -8 -26 1 Z" className="il-ink" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Omino "ta-daa!" — presenta con entrambe le mani                    */
/* ------------------------------------------------------------------ */
export function MascotTaDaa({ dir = 1, className }: { dir?: 1 | -1; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 300" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <g transform={`translate(100 150) scale(${1.7 * dir} 1.7)`}>
        {/* gambe piantate, leggermente aperte */}
        <path d="M-4 0 L-8 28 L-10 56" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-13" cy="58" rx="11" ry="4.6" className="il-accent" />
        <path d="M4 0 L8 28 L10 56" className="il-s-ink" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="13" cy="58" rx="11" ry="4.6" className="il-accent" />

        {/* busto: leggera inclinazione IN AVANTI, verso il richiamo */}
        <g transform="rotate(4 0 0)">
          <rect x="-14" y="-54" width="28" height="54" rx="13" className="il-top" stroke="var(--il-line)" strokeWidth="2" />
          <path d="M-13 -46 q-2 24 6 44 q-9 -8 -9 -24 q0 -12 3 -20 Z" className="il-soft" opacity="0.5" />
          <AgjTag dir={dir} />
        </g>
        <rect x="-4" y="-60" width="8" height="9" rx="3" className="il-face" />

        {/* braccia: entrambe protese in avanti (verso il callout) — "voilà!" */}
        <path d="M-11 -48 L8 -50 L30 -47" className="il-s-top" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="31" cy="-47" r="4.8" className="il-face" />
        <path d="M34 -47.5 q0 -3 -2.5 -4.2" stroke="var(--il-face)" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M11 -48 L25 -57 L41 -65" className="il-s-top" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="-65.5" r="4.8" className="il-face" />
        <path d="M45 -66 q0.5 -3 -2 -4.8" stroke="var(--il-face)" strokeWidth="2.3" strokeLinecap="round" fill="none" />

        {/* testa (verso il richiamo) */}
        <circle cx="4" cy="-67" r="13" className="il-face" />
        <path d="M-9 -68 a13 13 0 0 1 26 -1 q-13 -8 -26 1 Z" className="il-ink" />

        {/* scintille "ta-daa" (sul lato del richiamo) */}
        {[
          [48, -70], [35, -62], [51, -56], [31, -70], [44, -76], [55, -64],
        ].map(([x, y], i) => (
          <motion.g
            key={i}
            animate={reduce ? {} : { scale: [0.5, 1, 0.5], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <path d={`M${x} ${y - 3} L${x + 0.8} ${y} L${x} ${y + 3} L${x - 0.8} ${y} Z M${x - 3} ${y} L${x} ${y - 0.8} L${x + 3} ${y} L${x} ${y + 0.8} Z`} className="il-accent" />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
