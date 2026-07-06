"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Confetti } from "./confetti";

/**
 * Premium confirmation panel shown after a successful submission.
 *
 * Composition: a soft halo, a ring + checkmark that draw themselves on, a
 * gentle confetti burst, and the message. Every animation is transform/opacity
 * or SVG `pathLength` based (compositor-friendly) and the whole thing collapses
 * to a calm static state under `prefers-reduced-motion`.
 */
export function SuccessPanel({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  const reduce = useReducedMotion();

  const draw = reduce
    ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center px-4 py-10 text-center"
    >
      <Confetti />

      {/* Checkmark badge */}
      <div className="relative mb-6">
        {/* pulsing halo */}
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(79,177,196,0.45), transparent 70%)",
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
          />
        )}
        <motion.div
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="relative grid h-24 w-24 place-items-center rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--petrol-deep), var(--petrol-light))",
            boxShadow: "0 18px 40px -12px rgba(13,74,92,0.55)",
          }}
        >
          <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none">
            <motion.circle
              cx="26"
              cy="26"
              r="23"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2.5"
              {...draw}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            />
            <motion.path
              d="M15 27 l7.5 7.5 L38 19"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...draw}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display text-2xl font-semibold text-petrol dark:text-teal-100"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
      >
        {message}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-7"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
