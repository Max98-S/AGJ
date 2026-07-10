import { motion } from "motion/react";
import { IllustrationFrame } from "./_frame";

/**
 * TRASFERIMENTO TECNOLOGICO
 * A figure walks a bridge carrying a payload from a classical research building
 * (knowledge) to a modern skyline (market). Flowing currents run beneath.
 * Brochure panel: "Colleghiamo conoscenza e tecnologia per generare valore".
 */
export function TrasferimentoTecnologico({ title }: { title?: string }) {
  return (
    <IllustrationFrame title={title}>
      {/* ground slabs / banks */}
      <rect x="12" y="172" width="86" height="6" rx="3" className="il-ink" opacity="0.9" />
      <rect x="242" y="172" width="86" height="6" rx="3" className="il-ink" opacity="0.9" />

      {/* ---- LEFT: classical research building ---- */}
      <g>
        {/* flag */}
        <line
          x1="53"
          y1="104"
          x2="53"
          y2="90"
          className="il-s-ink"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* bandierina: fissa (l'animazione ruotava attorno a un'origine errata) */}
        <g>
          <path d="M53 90 L65 93 L53 97 Z" className="il-accent" />
        </g>
        {/* pediment */}
        <polygon
          points="22,124 84,124 53,103"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.5"
        />
        <circle cx="53" cy="118" r="2.5" className="il-accent" />
        {/* entablature */}
        <rect x="22" y="124" width="62" height="7" rx="1" className="il-ink" />
        {/* columns */}
        {[28, 42, 56, 70].map((x) => (
          <rect
            key={x}
            x={x}
            y="131"
            width="6"
            height="33"
            rx="1"
            className="il-surface"
            stroke="var(--il-line)"
            strokeWidth="1.2"
          />
        ))}
        {/* steps */}
        <rect
          x="22"
          y="164"
          width="62"
          height="8"
          rx="1"
          className="il-soft"
          stroke="var(--il-line)"
          strokeWidth="1.3"
        />
      </g>

      {/* ---- RIGHT: modern skyline ---- */}
      <g>
        {/* mid building */}
        <rect
          x="248"
          y="120"
          width="26"
          height="52"
          rx="2"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.4"
        />
        {[126, 138, 150].map((y) => (
          <g key={`a${y}`} className="il-twinkle" style={{ animationDelay: `${(y % 7) * 0.3}s` }}>
            <rect x="253" y={y} width="6" height="6" className="il-accent-soft" />
            <rect x="263" y={y} width="6" height="6" className="il-accent-soft" />
          </g>
        ))}
        {/* dark tower */}
        <rect x="280" y="104" width="22" height="68" rx="2" className="il-ink" />
        {[110, 122, 134, 146, 158].map((y) => (
          <g key={`b${y}`} className="il-twinkle" style={{ animationDelay: `${(y % 5) * 0.4}s` }}>
            <rect x="285" y={y} width="5" height="6" className="il-accent-2" />
            <rect x="293" y={y} width="5" height="6" className="il-accent-2" />
          </g>
        ))}
        {/* short building */}
        <rect
          x="306"
          y="142"
          width="16"
          height="30"
          rx="2"
          className="il-surface"
          stroke="var(--il-line)"
          strokeWidth="1.4"
        />
      </g>

      {/* ---- flowing currents under the bridge ---- */}
      <path
        d="M98 196 C120 184 140 208 160 196 S200 184 222 196 S242 200 242 196"
        className="il-s-accent il-dash"
        strokeWidth="2"
      />
      <path
        d="M98 208 C122 200 142 216 162 208 S204 200 224 208 S242 210 242 208"
        className="il-s il-dash"
        strokeWidth="1.6"
        style={{ animationDuration: "2.4s" }}
      />

      {/* ---- bridge ---- */}
      <path d="M96 172 Q170 96 244 172" className="il-s" strokeWidth="1.6" />
      <path
        d="M96 166 Q170 92 244 166"
        className="il-s-accent"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* ---- walking figure carrying a payload ---- */}
      <motion.g
        initial={{ x: 170, y: 93, opacity: 1 }}
        animate={{
          x: [125, 170, 215, 215, 125, 125],
          y: [106, 93, 106, 106, 106, 106],
          opacity: [1, 1, 1, 0, 0, 1],
        }}
        transition={{
          duration: 6.5,
          times: [0, 0.31, 0.62, 0.7, 0.72, 1],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <g className="il-bob">
          {/* back leg */}
          <path
            d="M-5 0 L-12 16 L-16 31"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="-18" cy="32" rx="6" ry="3.4" className="il-ink" />
          {/* front leg */}
          <path
            d="M5 0 L12 18 L14 35"
            className="il-s-ink"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="15" cy="37" rx="6" ry="3.4" className="il-ink" />
          {/* torso, slight forward lean */}
          <g transform="rotate(-6)">
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
          </g>
          {/* arms holding the box */}
          <path
            d="M-7 -33 L6 -26 L17 -23"
            className="il-s-top"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 -34 L16 -28 L22 -24"
            className="il-s-top"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* payload box */}
          <rect x="16" y="-32" width="20" height="17" rx="2" className="il-accent" />
          <polygon points="16,-32 36,-32 32,-37 20,-37" className="il-accent-soft" />
          {/* head */}
          <circle cx="0" cy="-48" r="8" className="il-face" />
          <path d="M-8 -50 a8 8 0 0 1 16 -1 q-8 -5.5 -16 1 Z" className="il-ink" />
        </g>
      </motion.g>
    </IllustrationFrame>
  );
}
