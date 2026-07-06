"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

/**
 * Ecosystem / institutional-partner marquee.
 *
 * NOTE: these are typographic wordmark placeholders for the institutions the
 * brochure references. Swap each entry's `node` with the real logo (ideally an
 * inline <svg> or an <img> in /src/assets) when available.
 */
const partners: { id: string; label: string; sub?: string }[] = [
  { id: "jaber", label: "JABER", sub: "Innovation" },
  { id: "nanesa", label: "NANESA" },
  { id: "mimit", label: "MIMIT" },
  { id: "mur", label: "MUR" },
  { id: "invitalia", label: "Invitalia" },
  { id: "simest", label: "SIMEST" },
  { id: "sace", label: "SACE" },
  { id: "horizon", label: "Horizon", sub: "Europe" },
  { id: "regione", label: "Regione", sub: "Lazio" },
  { id: "mase", label: "MASE" },
];

function Wordmark({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex select-none items-baseline gap-1.5 px-2 text-foreground/45 grayscale transition-all duration-300 hover:text-petrol hover:grayscale-0">
      <span className="font-display text-xl font-bold tracking-tight md:text-2xl">{label}</span>
      {sub && (
        <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">{sub}</span>
      )}
    </div>
  );
}

export function LogosBand() {
  return (
    <div className="relative w-full overflow-hidden py-2">
      <InfiniteSlider gap={56} duration={32} durationOnHover={90} className="w-full">
        {partners.map((p) => (
          <Wordmark key={p.id} label={p.label} sub={p.sub} />
        ))}
      </InfiniteSlider>

      {/* fade the edges into the page background */}
      <ProgressiveBlur
        className="pointer-events-none absolute left-0 top-0 h-full w-24"
        direction="left"
        blurIntensity={1}
      />
      <ProgressiveBlur
        className="pointer-events-none absolute right-0 top-0 h-full w-24"
        direction="right"
        blurIntensity={1}
      />
    </div>
  );
}
