import { cn } from "@/lib/utils";
import agjMark from "@/assets/agj-mark.png";

/**
 * AGJCONFIN logo.
 * Uses the real high-resolution "AGJ" monogram (extracted from the brochure)
 * so the lettering stays crisp and legible at every size — in both themes.
 *
 * variant="full"  → petrol badge with the white monogram + "CONFIN" wordmark
 * variant="mark"  → the large standalone monogram (used in the hero)
 *
 * `height` accepts a number (px) or any CSS length string (e.g. a clamp()),
 * which lets the hero scale the mark fluidly on phones and tablets.
 */
export function AgjLogo({
  variant = "full",
  className,
  height = 40,
}: {
  variant?: "full" | "mark";
  className?: string;
  height?: number | string;
}) {
  if (variant === "mark") {
    return (
      <div
        className={cn(
          "inline-flex shrink-0 items-center justify-center text-petrol dark:text-teal-100",
          className,
        )}
        style={{ height, maxWidth: "100%" }}
        aria-label="AGJ"
        role="img"
      >
        {/*
         * Il monogramma viene disegnato con una MASCHERA CSS e colorato con
         * `currentColor`: solo il canale alpha del PNG viene usato, quindi il
         * contorno resta pulito su qualunque sfondo (niente alone chiaro in
         * dark mode) e il colore segue il tema.
         */}
        <span
          aria-hidden
          className="block h-full w-full"
          style={{
            backgroundColor: "currentColor",
            WebkitMaskImage: `url(${agjMark})`,
            maskImage: `url(${agjMark})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            aspectRatio: "1008 / 1045",
          }}
        />
      </div>
    );
  }

  // Wordmark badge — arithmetic needs a numeric height.
  const h = typeof height === "number" ? height : 40;

  return (
    <div
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
      style={{ height: h }}
      aria-label="AGJCONFIN"
    >
      <span
        className="relative inline-flex items-center justify-center rounded-full bg-petrol ring-1 ring-white/20"
        style={{ height: h, width: h }}
      >
        {/* monogramma in bianco tramite maschera: contorno pulito, niente filtri */}
        <span
          aria-hidden
          className="block bg-white"
          style={{
            height: h * 0.6,
            width: h * 0.6 * (1008 / 1045),
            WebkitMaskImage: `url(${agjMark})`,
            maskImage: `url(${agjMark})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      </span>
      <span
        className="font-display font-bold leading-none text-foreground/85"
        style={{ fontSize: h * 0.42, letterSpacing: "0.14em" }}
      >
        CONFIN
      </span>
    </div>
  );
}
