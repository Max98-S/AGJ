"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Splits a display string like "2 Mld€", "200+", "95%" into the leading text,
 * the numeric value to count to, and the trailing text — so any prefix/suffix
 * around the number is preserved while the number itself animates.
 */
function parseValue(raw: string) {
  const match = /^(\D*?)([\d.,]+)(.*)$/s.exec(raw);
  if (!match) {
    return { prefix: "", target: 0, suffix: raw, decimals: 0, valid: false };
  }
  const prefix = match[1] ?? "";
  const rawNum = match[2] ?? "0";
  const suffix = match[3] ?? "";
  // Normalise Italian-style separators ("." thousands, "," decimals) just in case.
  const normalized = rawNum.replace(/\./g, "").replace(/,/g, ".");
  const target = parseFloat(normalized);
  const decimals = normalized.includes(".") ? (normalized.split(".")[1]?.length ?? 0) : 0;
  return {
    prefix,
    target: Number.isNaN(target) ? 0 : target,
    suffix,
    decimals,
    valid: true,
  };
}

/**
 * Animated counter that rolls up from 0 to the value written in `value`
 * the first time it scrolls into view. Respects the "Riduci animazioni"
 * toggle by rendering the final number immediately.
 */
export function CountUp({
  value,
  duration = 1.8,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const { prefix, target, suffix, decimals, valid } = parseValue(value);
  const [display, setDisplay] = useState(() => (reduce || !valid ? target : 0));

  useEffect(() => {
    if (!valid || !inView) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, target, reduce, valid, duration]);

  if (!valid) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("it-IT");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
