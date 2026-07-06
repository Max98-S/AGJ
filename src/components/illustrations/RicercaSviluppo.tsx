import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/**
 * RICERCA E SVILUPPO
 * A figure climbing a step to connect the last node of a molecular lattice that
 * surrounds a dark core sphere. Pulsing nodes + flowing bonds suggest discovery.
 * Brochure panel: "Trasformiamo intuizioni in innovazione concreta".
 */
const NODES: Array<[number, number]> = [
  [272, 115],
  [236, 53],
  [164, 53],
  [128, 115],
  [164, 177],
  [236, 177],
];

export function RicercaSviluppo({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* dark wide pedestal under the lattice */}
      <path d="M134 180 A66 20 0 0 1 266 180 Z" className="il-ink" opacity="0.92" />
      <ellipse cx="200" cy="180" rx="66" ry="6" className="il-ink" opacity="0.35" />

      {/* bonds: outer polygon */}
      <polygon
        points={NODES.map((n) => n.join(",")).join(" ")}
        className="il-s"
        strokeWidth="1.4"
      />
      {/* bonds: spokes to the core (a couple flow) */}
      {NODES.map(([x, y], i) => (
        <line
          key={i}
          x1="200"
          y1="115"
          x2={x}
          y2={y}
          className={i % 2 === 0 ? "il-s-accent il-dash" : "il-s"}
          strokeWidth={i % 2 === 0 ? 1.6 : 1.2}
        />
      ))}

      {/* core sphere */}
      <g className="il-breathe">
        <circle cx="200" cy="115" r="30" className="il-ink" />
        <circle cx="190" cy="105" r="9" className="il-accent" opacity="0.55" />
      </g>

      {/* nodes */}
      {NODES.map(([x, y], i) => {
        const filled = i % 2 === 1;
        return (
          <g key={`n${i}`} className="il-pulse" style={{ animationDelay: `${i * 0.35}s` }}>
            <circle
              cx={x}
              cy={y}
              r={filled ? 6 : 5.5}
              className={filled ? "il-accent" : "il-surface"}
              stroke={filled ? undefined : "var(--il-line)"}
              strokeWidth={filled ? undefined : 1.6}
            />
          </g>
        );
      })}

      {/* node the climber is connecting + its link */}
      <line x1="106" y1="86" x2="128" y2="115" className="il-s-accent" strokeWidth="1.6" />
      <g className="il-pulse" style={{ animationDelay: "0.15s" }}>
        <circle cx="118" cy="88" r="5.5" className="il-accent" />
      </g>

      {/* small iso cube */}
      <g>
        <polygon points="286,166 300,174 286,182 272,174" className="il-accent-soft" />
        <polygon points="272,174 286,182 286,196 272,188" className="il-ink" />
        <polygon points="300,174 286,182 286,196 300,188" className="il-accent" />
      </g>

      {/* decorative triangle */}
      <polygon points="34,206 54,206 44,188" className="il-s" strokeWidth="1.4" />

      {/* steps */}
      <rect
        x="54"
        y="172"
        width="42"
        height="16"
        rx="2"
        className="il-surface"
        stroke="var(--il-line)"
        strokeWidth="1.5"
      />
      <rect
        x="92"
        y="160"
        width="18"
        height="12"
        rx="2"
        className="il-soft"
        stroke="var(--il-line)"
        strokeWidth="1.3"
      />

      {/* climbing figure */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <g transform="translate(78 150) rotate(-7)">
          {/* back leg planted */}
          <path
            d="M-4 0 L-8 20 L-5 36"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="-6" cy="38" rx="6" ry="3.5" className="il-ink" />
          {/* front leg stepping up */}
          <path
            d="M6 0 L15 11 L13 23"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="14" cy="24" rx="5.5" ry="3.3" className="il-ink" />
          {/* torso */}
          <rect
            x="-10"
            y="-40"
            width="22"
            height="34"
            rx="11"
            className="il-top"
            stroke="var(--il-line)"
            strokeWidth="1.5"
          />
          {/* bracing arm */}
          <path
            d="M-8 -34 L-17 -27 L-22 -18"
            className="il-s-top"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="-23" cy="-17" r="3.8" className="il-face" />
          {/* reaching arm */}
          <path
            d="M8 -36 L20 -52 L29 -64"
            className="il-s-top"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="-66" r="4" className="il-face" />
          {/* head */}
          <circle cx="3" cy="-50" r="8.5" className="il-face" />
          <path d="M-5.5 -52 a8.5 8.5 0 0 1 17 -1 q-8.5 -6 -17 1 Z" className="il-ink" />
        </g>
      </motion.g>
    </IllustrationFrame>
  );
}
