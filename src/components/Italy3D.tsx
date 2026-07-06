import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ITALY_PATHS } from "./italy-paths";
import { AgjLogo } from "./AgjLogo";

/**
 * Marker coordinates live in the SVG viewBox (0 0 1000 1000) of the Italy map.
 * They were derived from the real WGS84 coordinates of each site and the map's
 * own region geometry, so every dot now sits on its true geographic position.
 */
const SEDI = [
  { id: "roma", city: "Roma", x: 496, y: 464, role: "Head Quarter — Agjconfin · JABER Innovation" },
  { id: "arezzo", city: "Arezzo", x: 458, y: 343, role: "NANESA — Nanomateriali & Q-materials" },
  { id: "bari", city: "Bari", x: 742, y: 528, role: "Biomaterials LAB" },
  {
    id: "teverola",
    city: "Teverola (CE)",
    x: 591,
    y: 536,
    role: "Technology LAB — Jaber Innovation",
  },
  { id: "portici", city: "Portici (NA)", x: 598, y: 550, role: "Nanomaterials LAB c/o IPCB-CNR" },
];

const DEPTH_LAYERS = 6;

export function Italy3D() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("roma");

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      {/* MAP */}
      <div className="relative w-full max-w-2xl mx-auto lg:mx-0" style={{ perspective: 1400 }}>
        {/* Official AGJ logo — floats gently over the map with a soft glow */}
        <motion.div
          className="pointer-events-none absolute left-3 top-3 z-10 sm:left-5 sm:top-5"
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={reduce ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            {!reduce && (
              <motion.span
                aria-hidden
                className="absolute inset-0 -z-10 rounded-2xl bg-petrol-light/40 blur-xl"
                animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.92, 1.06, 0.92] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <div className="glass-strong rounded-2xl px-3 py-2 shadow-lg">
              <AgjLogo variant="full" height={30} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative aspect-square"
          initial={{ opacity: 0, rotateX: 24 }}
          whileInView={{ opacity: 1, rotateX: 16 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          style={{ transformStyle: "preserve-3d" }}
          role="img"
          aria-label="Mappa dell'Italia con le sedi: Roma, Arezzo, Bari, Teverola, Portici."
        >
          {/* Light depth layers - reduced count for perf */}
          {Array.from({ length: DEPTH_LAYERS }).map((_, i) => {
            const t = i / DEPTH_LAYERS;
            return (
              <svg
                key={i}
                viewBox="0 0 1000 1000"
                className="absolute inset-0 w-full h-full"
                style={{
                  transform: `translateZ(${-(i + 1) * 5}px) translateY(${(i + 1) * 1.5}px)`,
                  opacity: 0.6 - t * 0.5,
                }}
              >
                {ITALY_PATHS.map((d, j) => (
                  <path key={j} d={d} fill="#0d4a5c" />
                ))}
              </svg>
            );
          })}

          {/* Top face */}
          <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="italy-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a8aa0" />
                <stop offset="100%" stopColor="#0d4a5c" />
              </linearGradient>
            </defs>
            {ITALY_PATHS.map((d, j) => (
              <path key={j} d={d} fill="url(#italy-fill)" stroke="white" strokeWidth="0.6" />
            ))}

            {/* Connection lines */}
            {SEDI.map((s, i) =>
              SEDI.slice(i + 1).map((tt) => (
                <line
                  key={`${s.id}-${tt.id}`}
                  x1={s.x}
                  y1={s.y}
                  x2={tt.x}
                  y2={tt.y}
                  stroke="white"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  className={reduce ? undefined : "line-flow"}
                />
              )),
            )}

            {/* Markers */}
            {SEDI.map((s, i) => {
              const isActive = active === s.id;
              return (
                <g
                  key={s.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.city} — ${s.role}`}
                >
                  {!reduce && (
                    <motion.circle
                      cx={s.x}
                      cy={s.y}
                      r="6"
                      fill="#4fb1c4"
                      animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 }}
                      style={{ transformOrigin: `${s.x}px ${s.y}px` }}
                    />
                  )}
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={isActive ? 12 : 7}
                    fill="#ffffff"
                    stroke="#0d4a5c"
                    strokeWidth="2.5"
                  />
                  {/* Only the active city is labelled on the map to avoid overlap;
                      the full list is shown alongside on the right. */}
                  {isActive && (
                    <text
                      x={s.x + 18}
                      y={s.y + 6}
                      fill="#ffffff"
                      fontSize="24"
                      fontWeight="700"
                      style={{ paintOrder: "stroke", stroke: "#062e3c", strokeWidth: 3.5 }}
                    >
                      {s.city}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* SITE LIST — to the right of Italy */}
      <ul className="flex flex-col gap-3" aria-label="Elenco sedi">
        {SEDI.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(s.id)}
              onFocus={() => setActive(s.id)}
              onClick={() => setActive(s.id)}
              aria-pressed={active === s.id}
              className={`glass flex w-full items-start gap-3 rounded-xl p-4 text-left transition-all ${
                active === s.id ? "ring-2 ring-petrol scale-[1.02]" : "opacity-80 hover:opacity-100"
              }`}
            >
              <span
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
                  active === s.id ? "bg-petrol" : "bg-petrol/40"
                }`}
                aria-hidden
              />
              <span>
                <span className="block font-display text-lg font-semibold text-petrol">
                  {s.city}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{s.role}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
