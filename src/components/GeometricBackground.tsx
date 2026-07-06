/**
 * Global site backdrop — one continuous atmosphere.
 *
 * The brand light lives on a single `fixed` layer behind every page,
 * so no section can ever show a colour seam: hero, content and footer
 * all float on the same air.
 *
 *   1. Mesh light — two teal gradient fields drifting on 48s/62s
 *      clocks. Full voice (this is now the only colour layer).
 *   2. Data grid  — hairline network fading in from the top and
 *      dissolving before mid-page. Quiet nod to data & connections.
 *   3. Film grain — 3% texture so large gradients never band.
 *
 * Engineering: pure CSS animation, zero JS at runtime and zero
 * `filter: blur()` layers (softness lives inside the gradients), so
 * compositing stays cheap on low-power devices. Honours the "Riduci
 * animazioni" toggle via the global .reduce-motion guard.
 */
export function GeometricBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* 1 — drifting mesh light */}
      <div className="gb-mesh gb-mesh--a" />
      <div className="gb-mesh gb-mesh--b" />

      {/* 2 — hairline data grid, dissolving from the top */}
      <svg
        className="absolute inset-0 h-full w-full text-petrol opacity-[0.035] dark:opacity-[0.055] [mask-image:radial-gradient(130%_80%_at_50%_0%,black_25%,transparent_72%)]"
        aria-hidden
      >
        <defs>
          <pattern id="gb-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gb-grid)" />
      </svg>

      {/* 3 — film grain */}
      <div className="gb-grain" />
    </div>
  );
}
