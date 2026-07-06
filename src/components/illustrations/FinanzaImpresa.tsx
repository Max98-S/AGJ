import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/**
 * FINANZA DI IMPRESA
 * A figure keeps a plank balanced on a fulcrum, with a pie chart and a bar
 * chart riding the beam. The whole beam see-saws gently around the pivot.
 * Brochure panel: "Pianificazione finanziaria per una crescita sostenibile".
 */
export function FinanzaImpresa({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* shallow ground arcs */}
      <path d="M62 206 Q170 238 278 206" className="il-s" strokeWidth="1.4" />
      <path d="M86 214 Q170 240 254 214" className="il-s" strokeWidth="1.2" opacity="0.7" />

      {/* fulcrum (fixed) */}
      <polygon points="170,148 150,182 190,182" className="il-ink" />
      <circle cx="170" cy="148" r="4" className="il-accent" />

      {/* everything riding the beam see-saws together */}
      <motion.g
        animate={{ rotate: [-2.4, 2.4, -2.4] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "170px 148px" }}
      >
        {/* plank */}
        <rect
          x="58"
          y="143"
          width="224"
          height="7"
          rx="3.5"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.5"
        />

        {/* end blocks */}
        <rect
          x="60"
          y="129"
          width="16"
          height="14"
          rx="2"
          className="il-soft"
          stroke="var(--il-line)"
          strokeWidth="1.3"
        />
        <rect
          x="266"
          y="131"
          width="14"
          height="12"
          rx="2"
          className="il-soft"
          stroke="var(--il-line)"
          strokeWidth="1.3"
        />

        {/* pie chart (left) */}
        <g>
          <circle
            cx="106"
            cy="121"
            r="22"
            className="il-surface"
            stroke="var(--il-line)"
            strokeWidth="1.5"
          />
          <path d="M106 121 L128 121 A22 22 0 0 0 96 100.5 Z" className="il-accent" />
          <path d="M106 121 L96 100.5 A22 22 0 0 0 84.7 121 Z" className="il-accent-soft" />
        </g>

        {/* bar chart (right) */}
        <g className="il-rise" style={{ animationDelay: "0s" }}>
          <rect
            x="222"
            y="117"
            width="12"
            height="26"
            rx="2"
            className="il-surface"
            stroke="var(--il-line)"
            strokeWidth="1.4"
          />
        </g>
        <g className="il-rise" style={{ animationDelay: "0.3s" }}>
          <rect x="237" y="103" width="12" height="40" rx="2" className="il-accent-soft" />
        </g>
        <g className="il-rise" style={{ animationDelay: "0.6s" }}>
          <rect x="252" y="111" width="12" height="32" rx="2" className="il-accent" />
        </g>

        {/* balancing figure (centre, slightly left of pivot) */}
        <g transform="translate(152 104)">
          {/* legs */}
          <path
            d="M-4 0 L-7 20 L-7 37"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="-7" cy="39" rx="6" ry="3.4" className="il-ink" />
          <path
            d="M5 0 L8 20 L8 37"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="8" cy="39" rx="6" ry="3.4" className="il-ink" />
          {/* torso */}
          <rect
            x="-9"
            y="-38"
            width="20"
            height="32"
            rx="10"
            className="il-top"
            stroke="var(--il-line)"
            strokeWidth="1.5"
          />
          {/* outstretched arms */}
          <path
            d="M-8 -32 L-22 -35 L-35 -31"
            className="il-s-top"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="-37" cy="-30" r="3.8" className="il-face" />
          <path
            d="M8 -32 L22 -35 L35 -31"
            className="il-s-top"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="37" cy="-30" r="3.8" className="il-face" />
          {/* head */}
          <circle cx="1" cy="-48" r="8" className="il-face" />
          <path d="M-7 -50 a8 8 0 0 1 16 -1 q-8 -5.5 -16 1 Z" className="il-ink" />
        </g>
      </motion.g>
    </IllustrationFrame>
  );
}
