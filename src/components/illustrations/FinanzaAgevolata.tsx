import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/**
 * FINANZA AGEVOLATA
 * An upright, composed figure reaches toward a floating euro coin — grasping a
 * funding opportunity — beside an ascending growth chart. Replaces the earlier
 * forward-leaning "leap" pose. Echoes the brochure panel
 * "Individuiamo e valorizziamo le opportunità di finanziamento".
 */
export function FinanzaAgevolata({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* faint guide dots (brand tic) */}
      <g className="il-twinkle" style={{ animationDelay: "0.4s" }}>
        <circle cx="34" cy="48" r="2" className="il-accent-soft" />
        <circle cx="42" cy="48" r="2" className="il-accent-soft" />
        <circle cx="34" cy="56" r="2" className="il-accent-soft" />
      </g>
      {/* floating plus accent */}
      <g className="il-twinkle" style={{ animationDelay: "0.9s" }}>
        <path
          d="M300 44 h10 M305 39 v10"
          className="il-s-accent"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* grounding */}
      <ellipse cx="99" cy="205" rx="42" ry="7" className="il-ink" opacity="0.85" />
      <line x1="196" y1="206" x2="330" y2="206" className="il-s" strokeWidth="2" />

      {/* ascending bars */}
      <g className="il-rise" style={{ animationDelay: "0s" }}>
        <rect
          x="252"
          y="176"
          width="16"
          height="30"
          rx="2"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.5"
        />
      </g>
      <g className="il-rise" style={{ animationDelay: "0.25s" }}>
        <rect x="276" y="150" width="16" height="56" rx="2" className="il-accent-soft" />
      </g>
      <g className="il-rise" style={{ animationDelay: "0.5s" }}>
        <rect x="300" y="120" width="16" height="86" rx="2" className="il-accent" />
      </g>
      {/* subtle trend line over the bars */}
      <path
        d="M260 172 L284 146 L308 116"
        className="il-s il-dash"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.6, animationDuration: "2.4s" }}
      />

      {/* euro coin — the opportunity, gently bobbing */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="238" cy="68" r="31" className="il-glow il-glowp" />
        <circle cx="238" cy="68" r="23" className="il-ink" />
        <circle cx="238" cy="68" r="17" className="il-accent" />
        <text
          x="238"
          y="76"
          textAnchor="middle"
          className="il-top"
          style={{ font: "700 23px var(--font-display, sans-serif)" }}
          fill="var(--il-top)"
        >
          €
        </text>
      </motion.g>

      {/* reach-to-opportunity dashed arc: open hand → coin */}
      <path
        d="M158 80 Q194 54 216 64"
        className="il-s-accent il-dash"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M210 58 l8 7 -10 3"
        className="il-s-accent"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* upright figure — gentle idle bob keeps it alive */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "99px 150px" }}
      >
        {/* back leg */}
        <path
          d="M93 156 L87 180 L84 200"
          className="il-s-ink"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="83" cy="202" rx="6" ry="3.4" className="il-ink" />
        {/* front leg */}
        <path
          d="M105 156 L111 180 L114 200"
          className="il-s-ink"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="115" cy="202" rx="6" ry="3.4" className="il-ink" />
        {/* torso */}
        <rect
          x="86"
          y="108"
          width="26"
          height="50"
          rx="13"
          className="il-top"
          stroke="var(--il-line)"
          strokeWidth="1.5"
        />
        {/* relaxed arm */}
        <path
          d="M88 118 L78 140 L75 157"
          className="il-s-top"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="74" cy="159" r="3.8" className="il-face" />
        {/* raised reaching arm */}
        <path
          d="M110 116 L134 98 L156 80"
          className="il-s-top"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="158" cy="78" r="4.2" className="il-face" />
        {/* head */}
        <circle cx="99" cy="96" r="9.5" className="il-face" />
        <path d="M89.5 95 a9.5 9.5 0 0 1 19 -1 q-9.5 -6.5 -19 1 Z" className="il-ink" />
      </motion.g>
    </IllustrationFrame>
  );
}
