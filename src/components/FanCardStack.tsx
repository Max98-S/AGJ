"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { cn } from "@/lib/utils";

/**
 * 3D fan card stack (adapted from the provided CardStack3D reference,
 * rebuilt for this codebase: motion/react instead of framer-motion,
 * text cards instead of next/Image, brand surfaces, a11y).
 *
 * Behaviour:
 *   • At rest the cards sit as a slightly splayed deck, centred.
 *   • Hovering (or keyboard-focusing) the deck fans it out
 *     symmetrically with a gentle Y-rotation and cascading delay.
 *   • Clicking a card brings it front-and-centre (scaled up, straight)
 *     while the others blur and dim — click again to release.
 *   • Below md the deck falls back to a plain readable list: content
 *     is never hidden on touch devices.
 *
 * Engineering notes: the card surface is `glass-strong testimonial-card`
 * (near-opaque) on purpose — backdrop-filter + 3D rotation is the known
 * legibility bug this codebase already documents, so the fan uses solid
 * surfaces. Reduced motion is honoured globally by MotionConfig: states
 * still switch, just without animation.
 */

export type FanCardItem = { icon: LucideIcon; title: string; desc: string };

const titleFont = (title: string) =>
  title.includes("&") ? "font-body tracking-normal" : "font-display";

export function FanCardStack({
  items,
  cardWidth = 330,
  cardHeight = 250,
  spacingX = 200,
  hint = "Passa il mouse per sfogliare · clicca una card per metterla in primo piano",
  className,
}: {
  items: FanCardItem[];
  cardWidth?: number;
  cardHeight?: number;
  /** Horizontal distance between adjacent cards when fanned out. */
  spacingX?: number;
  hint?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [front, setFront] = useState<number | null>(null);
  const n = items.length;

  const toggleFront = (i: number) => setFront((prev) => (prev === i ? null : i));

  return (
    <div className={className}>
      {/* ---- Desktop: 3D fan ---- */}
      <div className="hidden md:block">
        <div className="flex justify-center">
          <div
            className="relative"
            style={{
              width: cardWidth + spacingX * (n - 1),
              height: cardHeight + 80,
              perspective: 1400,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setFront(null);
            }}
            onFocus={() => setHovered(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setHovered(false);
                setFront(null);
              }
            }}
          >
            {items.map((item, i) => {
              const dist = i - (n - 1) / 2;
              const isFront = front === i;
              const dimmed = front !== null && !isFront;
              return (
                <motion.div
                  key={item.title}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFront}
                  onClick={() => toggleFront(i)}
                  onKeyDown={(e: KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFront(i);
                    }
                  }}
                  className="absolute left-1/2 top-8 cursor-pointer rounded-2xl outline-none transition-[filter] duration-300 focus-visible:ring-2 focus-visible:ring-petrol/50 dark:focus-visible:ring-teal-300/50"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    marginLeft: -cardWidth / 2,
                    transformStyle: "preserve-3d",
                    zIndex: isFront ? 60 : 20 - Math.round(Math.abs(dist) * 2),
                    filter: dimmed ? "blur(5px)" : "none",
                  }}
                  initial={false}
                  animate={
                    isFront
                      ? { x: 0, y: -26, rotate: 0, rotateY: 0, scale: 1.13, opacity: 1 }
                      : hovered
                        ? {
                            x: dist * spacingX,
                            y: 0,
                            rotate: 0,
                            rotateY: dist * -8,
                            scale: dimmed ? 0.96 : 1,
                            opacity: dimmed ? 0.55 : 1,
                          }
                        : {
                            x: dist * 14,
                            y: Math.abs(dist) * 5,
                            rotate: dist * 2,
                            rotateY: 0,
                            scale: 1,
                            opacity: 1,
                          }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                    delay: hovered && !isFront && front === null ? Math.abs(dist) * 0.05 : 0,
                  }}
                >
                  <div className="glass-strong testimonial-card flex h-full w-full flex-col rounded-2xl border border-petrol/10 p-6 shadow-xl dark:border-teal-300/15">
                    <div className="glass-petrol mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                      <item.icon size={20} />
                    </div>
                    <h3
                      className={cn(
                        "font-semibold text-petrol dark:text-teal-100",
                        titleFont(item.title),
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground/70">
          {hint}
        </p>
      </div>

      {/* ---- Mobile / small tablet: swipeable snap carousel (no endless list) ---- */}
      <div className="md:hidden">
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div key={item.title} className="w-[78%] shrink-0 snap-center sm:w-[46%]">
              <GlassCard className="h-full">
                <div className="glass-petrol mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
                  <item.icon size={20} />
                </div>
                <h3
                  className={cn(
                    "font-semibold text-petrol dark:text-teal-100",
                    titleFont(item.title),
                  )}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </GlassCard>
            </div>
          ))}
        </div>
        <p className="mt-1 text-center text-[11px] uppercase tracking-wider text-muted-foreground/70">
          Scorri per esplorare →
        </p>
      </div>
    </div>
  );
}
