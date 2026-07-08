"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * ScrollSlides — deck di slide a tutta pagina rivelate verticalmente allo scroll.
 *
 * La sezione è alta n×100vh; al suo interno un contenitore "sticky" resta fermo
 * mentre la colonna di slide scorre verso l'alto (una slide per schermata).
 * NON dirotta lo scroll globale (niente wheel-jacking): si scorre normalmente e
 * funziona anche su mobile. Su mobile / reduced-motion le slide vengono
 * semplicemente impilate.
 */
export function ScrollSlides({ slides }: { slides: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const n = slides.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);

  if (reduce || isMobile) {
    return (
      <div className="flex flex-col">
        {slides.map((s, i) => (
          <div key={i} className="flex min-h-[85vh] items-center py-16">
            {s}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${n * 100}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ y }}>
          {slides.map((s, i) => (
            <div key={i} className="flex h-screen w-full items-center justify-center overflow-hidden px-4 py-24">
              <div className="w-full">{s}</div>
            </div>
          ))}
        </motion.div>

        {/* indicatori di slide */}
        <div className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
          {slides.map((_, i) => (
            <Dot key={i} progress={scrollYProgress} index={i} n={n} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Dot({
  progress,
  index,
  n,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  n: number;
}) {
  const center = n > 1 ? index / (n - 1) : 0;
  const span = n > 1 ? 0.5 / (n - 1) : 0.5;
  const opacity = useTransform(progress, [center - span, center, center + span], [0.3, 1, 0.3]);
  const scale = useTransform(progress, [center - span, center, center + span], [1, 1.7, 1]);
  return (
    <motion.span
      style={{ opacity, scale }}
      className="block h-2 w-2 rounded-full bg-petrol dark:bg-teal-300"
    />
  );
}
