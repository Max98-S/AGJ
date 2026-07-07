"use client";

import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalkMascot, MascotPointing } from "@/components/WalkingMascot";

/**
 * SERVICE — mascotte AGJCONFIN (beat 2)
 *
 * La mascotte rientra da sinistra camminando (ciclo del passo), si ferma verso
 * il centro e indica il richiamo "Finanziamenti agevolati" sulla destra.
 */
export function ServiceMascotFinanziamenti() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const disabled = reduce || isMobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Entra da sinistra camminando → arriva → indica.
  const walkX = useTransform(scrollYProgress, [0.05, 0.5], ["-55%", "0%"]);
  const walkOpacity = useTransform(scrollYProgress, [0.05, 0.14, 0.46, 0.56], [0, 1, 1, 0]);
  const pointOpacity = useTransform(scrollYProgress, [0.48, 0.6], [0, 1]);

  const Callout = (
    <div className="max-w-md">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-petrol">Il nostro core</span>
      <h2 className="mt-3 text-4xl font-bold leading-[1.1] text-gradient md:text-5xl">
        Finanziamenti agevolati
      </h2>
      <p className="mt-5 text-muted-foreground">
        Individuiamo e valorizziamo le opportunità di finanziamento per la tua impresa,
        seguendoti in ogni fase del processo — dall'analisi alla presentazione della domanda.
      </p>
      <Link
        to="/contatti"
        className="btn-shine glass-petrol mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition-transform duration-500 hover:scale-105"
      >
        Parliamone <ArrowRight size={18} />
      </Link>
    </div>
  );

  if (disabled) {
    return (
      <section className="relative overflow-hidden px-4 py-20">
        <div className="container mx-auto flex flex-col items-center gap-8 text-center">
          <div className="w-40">
            <MascotPointing className="block h-auto w-full" />
          </div>
          <div className="mx-auto">{Callout}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden">
      {/* alone morbido */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-1/2 h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,112,136,0.10),transparent_65%)] blur-2xl"
      />

      <div className="container mx-auto flex min-h-[92vh] items-center px-4">
        {/* richiamo sulla destra */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="ml-auto md:mr-[4%] md:w-[46%] lg:w-[42%]"
        >
          {Callout}
        </motion.div>
      </div>

      {/* mascotte che rientra da sinistra e poi indica */}
      <div className="pointer-events-none absolute bottom-[4%] left-[2%] z-0 w-52 sm:left-[4%] sm:w-56 lg:left-[7%] lg:w-64">
        <motion.div style={{ opacity: walkOpacity, x: walkX }} className="will-change-transform">
          <WalkMascot dir={1} className="block h-auto w-full" />
        </motion.div>
        <motion.div style={{ opacity: pointOpacity }} className="absolute inset-0">
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 92%" }}
          >
            <MascotPointing className="block h-auto w-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
