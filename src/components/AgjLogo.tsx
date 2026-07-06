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
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        style={{ height, maxWidth: "100%" }}
        aria-label="AGJ"
      >
        <img
          src={agjMark}
          alt="AGJ"
          draggable={false}
          className="h-full w-auto max-w-full select-none object-contain"
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
        {/* monogram recoloured to white so it reads on the petrol badge */}
        <img
          src={agjMark}
          alt=""
          draggable={false}
          aria-hidden
          className="w-auto select-none object-contain"
          style={{ height: h * 0.6, filter: "brightness(0) invert(1)" }}
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
