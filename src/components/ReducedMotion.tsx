import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Motion governance for the whole app.
 *
 * There is intentionally NO manual "reduce animations" control: the experience
 * is tuned to run smoothly on its own. We still respect the operating-system
 * `prefers-reduced-motion` setting as an accessibility floor:
 *   • <MotionConfig reducedMotion="user"> makes every framer-motion `animate`
 *     prop honour the OS preference automatically.
 *   • The `.reduce-motion` class on <html> lets the CSS-keyframe animations
 *     (the illustration "omini", floats, glows) opt out as well. It is driven
 *     purely by the media query — no toggle, no localStorage.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => document.documentElement.classList.toggle("reduce-motion", mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
