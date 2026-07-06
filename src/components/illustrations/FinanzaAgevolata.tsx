import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/**
 * FINANZA AGEVOLATA
 * A figure mid-leap along a dashed trajectory, reaching for a floating euro
 * coin, with an ascending bar chart on the right. Echoes the brochure panel
 * "Individuiamo e valorizziamo le opportunità di finanziamento".
 */
export function FinanzaAgevolata({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* faint guide grid dots */}
      <g className="il-twinkle" style={{ animationDelay: "0.4s" }}>
        <circle cx="40" cy="40" r="2" className="il-accent-soft" />
        <circle cx="48" cy="40" r="2" className="il-accent-soft" />
        <circle cx="40" cy="48" r="2" className="il-accent-soft" />
      </g>

      {/* take-off spot */}
      <ellipse cx="62" cy="206" rx="32" ry="8" className="il-ink" opacity="0.9" />

      {/* dashed leap trajectory + arrowhead */}
      <path
        d="M64 200 Q120 150 150 120 T240 78"
        className="il-s-accent il-dash"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M234 70 l10 9 -13 4"
        className="il-s-accent"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* euro coin */}
      <g className="il-bob">
        <circle cx="256" cy="60" r="30" className="il-glow il-glowp" />
        <circle cx="256" cy="60" r="23" className="il-ink" />
        <circle cx="256" cy="60" r="17" className="il-accent" />
        <text
          x="256"
          y="68"
          textAnchor="middle"
          className="il-top"
          style={{ font: "700 24px var(--font-display, sans-serif)" }}
          fill="var(--il-top)"
        >
          €
        </text>
      </g>

      {/* ascending bars */}
      <line x1="278" y1="206" x2="334" y2="206" className="il-s" strokeWidth="2" />
      <g className="il-rise" style={{ animationDelay: "0s" }}>
        <rect
          x="284"
          y="178"
          width="13"
          height="28"
          rx="2"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.5"
        />
      </g>
      <g className="il-rise" style={{ animationDelay: "0.25s" }}>
        <rect x="300" y="156" width="13" height="50" rx="2" className="il-accent-soft" />
      </g>
      <g className="il-rise" style={{ animationDelay: "0.5s" }}>
        <rect x="316" y="128" width="13" height="78" rx="2" className="il-accent" />
      </g>

      {/* leaping figure — outer group bobs, inner group holds the leaning pose */}
      <motion.g
        animate={{ x: [0, 6, 0], y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "150px 130px" }}
      >
        <g transform="translate(150 130) rotate(-22)">
          {/* back leg (extended) */}
          <path
            d="M-5 0 L-16 20 L-27 33"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="-29" cy="35" rx="6" ry="3.5" className="il-ink" />
          {/* front leg (bent) */}
          <path
            d="M6 0 L16 22 L9 40"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="9" cy="42" rx="6" ry="3.5" className="il-ink" />
          {/* torso */}
          <rect
            x="-11"
            y="-42"
            width="23"
            height="36"
            rx="11"
            className="il-top"
            stroke="var(--il-line)"
            strokeWidth="1.5"
          />
          {/* back arm */}
          <path
            d="M-8 -36 L-20 -22 L-26 -10"
            className="il-s-top"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="-27" cy="-8" r="3.8" className="il-face" />
          {/* reaching arm */}
          <path
            d="M9 -38 L24 -56 L32 -70"
            className="il-s-top"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="33" cy="-72" r="4" className="il-face" />
          {/* head */}
          <circle cx="3" cy="-52" r="9" className="il-face" />
          <path d="M-6 -54 a9 9 0 0 1 18 -1 q-9 -6 -18 1 Z" className="il-ink" />
        </g>
      </motion.g>
    </IllustrationFrame>
  );
}
