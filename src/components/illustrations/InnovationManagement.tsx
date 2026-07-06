import type { ReactNode } from "react";
import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/* one icon bubble */
function Bubble({
  x,
  y,
  delay,
  children,
}: {
  x: number;
  y: number;
  delay: number;
  children: ReactNode;
}) {
  return (
    <g className="il-bob" style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}>
      <circle
        cx={x}
        cy={y}
        r="17"
        className="il-surface"
        stroke="var(--il-line)"
        strokeWidth="1.5"
      />
      <g transform={`translate(${x} ${y})`}>{children}</g>
    </g>
  );
}

/**
 * INNOVATION MANAGEMENT
 * A figure orchestrates an iso-cube cluster ringed by orbiting icon bubbles —
 * idea, mechanism, people and metrics — governed in a structured way.
 * Brochure panel: "Governare l'innovazione in modo strutturato".
 */
export function InnovationManagement({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* soft halo + tilted orbit */}
      <ellipse cx="210" cy="123" rx="100" ry="74" className="il-glow il-glowp" opacity="0.12" />
      <g transform="rotate(-9 210 123)">
        <ellipse
          cx="210"
          cy="123"
          rx="98"
          ry="60"
          className="il-s"
          strokeWidth="1.4"
          strokeDasharray="2 8"
        />
        {/* orbiting dots */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "210px 123px" }}
        >
          <circle cx="308" cy="123" r="3" className="il-accent-2" />
          <circle cx="161" cy="71" r="3" className="il-accent-2" />
          <circle cx="161" cy="175" r="3" className="il-accent-2" />
        </motion.g>
      </g>

      {/* faint links from the core to each bubble */}
      {[
        [120, 74],
        [300, 74],
        [124, 176],
        [300, 168],
      ].map(([bx, by], i) => (
        <line
          key={i}
          x1="210"
          y1="123"
          x2={bx}
          y2={by}
          className="il-s"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.7"
        />
      ))}

      {/* iso cube cluster */}
      <g className="il-breathe">
        {/* right face */}
        <polygon points="244,104 210,122 210,160 244,142" className="il-accent" />
        {/* left face */}
        <polygon points="176,104 210,122 210,160 176,142" className="il-ink" />
        {/* top face */}
        <polygon points="210,86 244,104 210,122 176,104" className="il-accent-soft" />
        {/* subdivision edges → reads as a cluster */}
        <g className="il-s" strokeWidth="1" opacity="0.65">
          <line x1="193" y1="95" x2="227" y2="113" />
          <line x1="227" y1="95" x2="193" y2="113" />
          <line x1="193" y1="113" x2="193" y2="151" />
          <line x1="227" y1="113" x2="227" y2="151" />
          <line x1="176" y1="123" x2="210" y2="141" />
          <line x1="244" y1="123" x2="210" y2="141" />
        </g>
      </g>

      {/* bubbles */}
      {/* lightbulb */}
      <Bubble x={112} y={68} delay={0}>
        <circle cx="0" cy="-2" r="6" className="il-accent" />
        <rect x="-3" y="3" width="6" height="4" rx="1" className="il-ink" />
        <line
          x1="0"
          y1="-12"
          x2="0"
          y2="-15"
          className="il-s-accent"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          x1="8"
          y1="-6"
          x2="11"
          y2="-8"
          className="il-s-accent"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <line
          x1="-8"
          y1="-6"
          x2="-11"
          y2="-8"
          className="il-s-accent"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </Bubble>
      {/* gear */}
      <Bubble x={300} y={72} delay={0.5}>
        <g className="il-spin">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect
              key={a}
              x="-1.5"
              y="-10"
              width="3"
              height="4"
              rx="1"
              className="il-ink"
              transform={`rotate(${a})`}
            />
          ))}
          <circle cx="0" cy="0" r="6.5" className="il-ink" />
          <circle cx="0" cy="0" r="2.6" className="il-surface" />
        </g>
      </Bubble>
      {/* people */}
      <Bubble x={124} y={176} delay={0.9}>
        <circle cx="-4" cy="-4" r="3.2" className="il-ink" />
        <circle cx="4" cy="-4" r="3.2" className="il-accent" />
        <path d="M-10 6 a6 6 0 0 1 12 0 Z" className="il-ink" />
        <path d="M-2 6 a6 6 0 0 1 12 0 Z" className="il-accent" />
      </Bubble>
      {/* chart */}
      <Bubble x={300} y={168} delay={1.3}>
        <rect x="-8" y="0" width="4" height="7" rx="1" className="il-accent-soft" />
        <rect x="-2" y="-5" width="4" height="12" rx="1" className="il-accent" />
        <rect x="4" y="-9" width="4" height="16" rx="1" className="il-ink" />
      </Bubble>

      {/* figure (back to us) gesturing at the cluster */}
      <g transform="translate(56 150)">
        {/* legs */}
        <path
          d="M-4 0 L-6 20 L-6 38"
          className="il-s-ink"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="-7" cy="40" rx="6" ry="3.4" className="il-ink" />
        <path
          d="M5 0 L7 20 L7 38"
          className="il-s-ink"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="8" cy="40" rx="6" ry="3.4" className="il-ink" />
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
        {/* resting arm */}
        <path
          d="M-8 -33 L-13 -20 L-15 -8"
          className="il-s-top"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="-16" cy="-7" r="3.6" className="il-face" />
        {/* gesturing arm toward the cluster */}
        <motion.g
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "8px -34px" }}
        >
          <path
            d="M8 -34 L24 -42 L41 -47"
            className="il-s-top"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="43" cy="-48" r="3.8" className="il-face" />
        </motion.g>
        {/* head (back of the head) */}
        <circle cx="1" cy="-48" r="8" className="il-ink" />
        <circle cx="3" cy="-46" r="6" className="il-accent-soft" opacity="0.35" />
      </g>
    </IllustrationFrame>
  );
}
