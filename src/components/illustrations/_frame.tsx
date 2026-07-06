import type { ReactNode } from "react";

export type ServiceKind =
  | "ricerca-sviluppo"
  | "finanza-agevolata"
  | "finanza-impresa"
  | "trasferimento-tecnologico"
  | "innovation-management";

/**
 * Common SVG canvas for every illustration. Keeps a single source of truth for
 * the viewBox / aspect ratio so the scenes line up when used in a grid or a card.
 * Colours come from the `--il-*` tokens in styles.css and adapt to the theme.
 */
export function IllustrationFrame({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 340 240"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={title ? `Illustrazione: ${title}` : undefined}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}
