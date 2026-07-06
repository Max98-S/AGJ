"use client";

import { useMemo } from "react";
import { Landmark, MapPin, Globe2, Receipt, type LucideIcon } from "lucide-react";
import type { BandiCategory } from "@/lib/bandi.server";

/**
 * Generated cover artwork for a news item.
 *
 * RSS feeds rarely carry usable images, and hot-linking thumbnails is fragile
 * and slow. Instead each card gets a deterministic, on-brand SVG cover derived
 * from the item id — a layered gradient with translucent hexagons, a chevron
 * sweep and a category glyph. Same id ⇒ same cover (stable across renders), but
 * every item looks distinct. Pure SVG: crisp, instant, zero network.
 */

type Palette = { from: string; via: string; to: string; glyphBg: string };

const PALETTES: Record<BandiCategory, Palette> = {
  Regionale: { from: "#0d6b5a", via: "#119077", to: "#1fae8f", glyphBg: "rgba(255,255,255,0.16)" },
  Nazionale: { from: "#062e3c", via: "#0d4a5c", to: "#2a8aa0", glyphBg: "rgba(255,255,255,0.16)" },
  Europeo: { from: "#0a2a5c", via: "#1d4f88", to: "#3f7bc4", glyphBg: "rgba(255,255,255,0.18)" },
  Fiscale: { from: "#7a4b10", via: "#b07a1e", to: "#e0a93a", glyphBg: "rgba(255,255,255,0.20)" },
};

const ICONS: Record<BandiCategory, LucideIcon> = {
  Regionale: MapPin,
  Nazionale: Landmark,
  Europeo: Globe2,
  Fiscale: Receipt,
};

function hashString(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^= h >>> 16) >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

export function BandoCover({
  seed,
  category,
  className = "",
}: {
  seed: string;
  category: BandiCategory;
  className?: string;
}) {
  const pal = PALETTES[category];
  const Icon = ICONS[category];
  const gid = useMemo(() => `bc-${hashString(seed).toString(36)}`, [seed]);

  const hexes = useMemo(() => {
    const rnd = mulberry32(hashString(seed));
    return Array.from({ length: 5 }, () => ({
      cx: 20 + rnd() * 360,
      cy: 10 + rnd() * 180,
      r: 26 + rnd() * 58,
      o: 0.05 + rnd() * 0.12,
      sw: rnd() > 0.5 ? 1.5 : 0,
    }));
  }, [seed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={pal.from} />
            <stop offset="55%" stopColor={pal.via} />
            <stop offset="100%" stopColor={pal.to} />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill={`url(#${gid})`} />

        {/* translucent hexagon field, seeded per item */}
        <g>
          {hexes.map((h, i) => (
            <path
              key={i}
              d={hexPath(h.cx, h.cy, h.r)}
              fill={`rgba(255,255,255,${h.o})`}
              stroke={h.sw ? "rgba(255,255,255,0.18)" : "none"}
              strokeWidth={h.sw}
            />
          ))}
        </g>

        {/* chevron sweep — the brand ">" motif */}
        <g fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="10">
          <path d="M-20 220 L120 70 L100 50 L-40 200" />
          <path d="M40 230 L180 80 L160 60 L20 210" />
        </g>

        {/* soft vignette for text contrast on the lower edge */}
        <rect width="400" height="200" fill="url(#vig)" />
        <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="rgba(6,46,60,0)" />
          <stop offset="100%" stopColor="rgba(6,46,60,0.35)" />
        </linearGradient>
      </svg>

      {/* category glyph badge, centred */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl text-white backdrop-blur-sm"
          style={{ background: pal.glyphBg, boxShadow: "0 8px 24px -8px rgba(6,46,60,0.5)" }}
        >
          <Icon size={26} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
