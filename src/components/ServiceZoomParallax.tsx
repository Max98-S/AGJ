"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalkMascot, MascotPointing } from "@/components/WalkingMascot";

/**
 * SERVICE HERO — mascotte AGJCONFIN (beat 1)
 *
 * A riposo la mascotte indica il titolo centrale. Allo scroll passa alla
 * camminata (ciclo del passo umano) e se ne va verso sinistra uscendo di scena.
 * Il testo resta centrato e leggibile. Nome/export invariati.
 */
export function ServiceZoomParallax({
  eyebrow = "I nostri servizi",
  title = "Una gamma completa per crescere, innovare, competere.",
  subtitle,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const disabled = reduce || isMobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // A riposo → indica. Appena scrolli → cammina a sinistra ed esce.
  const pointOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const walkOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.82, 0.98], [0, 1, 1, 0]);
  const walkX = useTransform(scrollYProgress, [0.1, 1], ["0%", "-150%"]);

  return (
    <section
      ref={ref}
      className={
        disabled
          ? "relative overflow-hidden px-4 py-16 text-center md:py-24"
          : "relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4"
      }
    >
      {/* alone morbido dietro il titolo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,112,136,0.10),transparent_65%)] blur-2xl"
      />

      {!disabled && (
        <>
          {/* posa che indica (a riposo) */}
          <motion.div
            style={{ opacity: pointOpacity }}
            className="pointer-events-none absolute bottom-[4%] left-[2%] z-0 w-52 will-change-transform sm:left-[4%] sm:w-56 lg:left-[6%] lg:w-64"
          >
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-1.2, 1.2, -1.2] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "50% 92%" }}
            >
              <MascotPointing className="block h-auto w-full" />
            </motion.div>
          </motion.div>

          {/* camminata verso sinistra (allo scroll) */}
          <motion.div
            style={{ opacity: walkOpacity, x: walkX }}
            className="pointer-events-none absolute bottom-[4%] left-[2%] z-0 w-52 will-change-transform sm:left-[4%] sm:w-56 lg:left-[6%] lg:w-64"
          >
            <WalkMascot dir={-1} className="block h-auto w-full" />
          </motion.div>
        </>
      )}

      {/* copy centrato, sempre leggibile */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-petrol">{eyebrow}</span>
        <h1 className="mx-auto mt-4 text-4xl font-bold leading-[1.08] text-gradient sm:text-5xl md:text-6xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{subtitle}</p>}
        {!disabled && (
          <div className="mt-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Scorri ↓</div>
        )}
      </div>
    </section>
  );
}
