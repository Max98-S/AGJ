"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven "assemble" title: while the heading travels from the
 * bottom of the viewport toward its centre, every word converges from
 * a scattered position (horizontal offset + slight 3D tilt + fade)
 * into the final composition. Scrubbing back down reverses it — the
 * animation is bound to the scrollbar, not to a timer.
 *
 * Design notes:
 *   • Animates per *word*, not per character: Space Grotesk's kerning
 *     and the heading's tracking stay intact, and ~17 motion values
 *     cost nothing (per-character would spawn hundreds and break
 *     letter spacing).
 *   • `lines` keeps the art-directed line breaks: from lg up each
 *     line is a block (the composition the client signed off), below
 *     lg words flow naturally.
 *   • Under reduced motion the words render statically.
 */

export type TitleSegment = {
  text: string;
  /** Extra classes for these words (e.g. the emphasised tail). */
  className?: string;
};

function Word({
  word,
  dist,
  progress,
  className,
}: {
  word: string;
  dist: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  const x = useTransform(progress, [0, 1], [dist * 42, 0]);
  const rotateX = useTransform(progress, [0, 1], [dist * 14, 0]);
  const opacity = useTransform(progress, [0, 0.65], [0, 1]);
  return (
    <motion.span
      className={cn("inline-block", className)}
      style={{ x, rotateX, opacity, transformPerspective: 700 }}
    >
      {word}
    </motion.span>
  );
}

export function ScrollAssembleTitle({
  lines,
  className,
}: {
  lines: TitleSegment[][];
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.55"],
  });

  return (
    <h2 ref={ref} className={className}>
      {lines.map((segments, li) => {
        const words = segments.flatMap((seg) =>
          seg.text
            .split(" ")
            .filter(Boolean)
            .map((w) => ({ w, className: seg.className })),
        );
        const center = (words.length - 1) / 2;
        return (
          <span key={li} className="lg:block">
            {words.map((item, wi) => (
              <Fragment key={wi}>
                {reduce ? (
                  <span className={item.className}>{item.w}</span>
                ) : (
                  <Word
                    word={item.w}
                    dist={wi - center}
                    progress={scrollYProgress}
                    className={item.className}
                  />
                )}
                {wi < words.length - 1 ? " " : null}
              </Fragment>
            ))}{" "}
          </span>
        );
      })}
    </h2>
  );
}
