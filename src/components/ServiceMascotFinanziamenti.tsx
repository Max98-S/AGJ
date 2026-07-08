"use client";

import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalkMascot, MascotTaDaa } from "@/components/WalkingMascot";

/**
 * SERVICE — mascotte AGJCONFIN (beat 2)
 *
 * Il callout "Finanziamenti agevolati" è a SINISTRA. La mascotte entra da
 * destra camminando verso sinistra (ciclo del passo), arriva e fa il "ta-daa!"
 * presentando il richiamo con entrambe le mani. Tutto allo scroll.
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

  // Entra da destra → va verso il centro camminando (più strada) → arriva
  // vicino al richiamo → "ta-daa!". Anticipato: già fatto quando è in vista.
  const walkX = useTransform(scrollYProgress, [0.03, 0.3], ["165%", "0%"]);
  const walkOpacity = useTransform(scrollYProgress, [0.03, 0.11, 0.28, 0.36], [0, 1, 1, 0]);
  const tadaaOpacity = useTransform(scrollYProgress, [0.34, 0.44], [0, 1]);
  const tadaaPop = useTransform(scrollYProgress, [0.34, 0.44], [0.85, 1]);

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
        Contattaci <ArrowRight size={18} />
      </Link>
    </div>
  );

  if (disabled) {
    return (
      <section className="relative overflow-hidden px-4 py-20">
        <div className="container mx-auto flex flex-col items-start gap-8">
          {Callout}
          <div className="mx-auto w-40">
            <MascotTaDaa dir={-1} className="block h-auto w-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden">
      {/* alone morbido a sinistra, dietro il richiamo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[14%] top-1/2 h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,112,136,0.10),transparent_65%)] blur-2xl"
      />

      {/* richiamo spostato a SINISTRA */}
      <div className="container mx-auto flex min-h-[92vh] items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mr-auto md:ml-[3%] md:w-[46%] lg:w-[42%]"
        >
          {Callout}
        </motion.div>
      </div>

      {/* mascotte: entra da destra, cammina fin verso il centro, poi "ta-daa!" accanto al richiamo */}
      <div className="pointer-events-none absolute bottom-[4%] left-[44%] z-0 w-52 sm:left-[46%] sm:w-56 lg:w-60">
        <motion.div style={{ opacity: walkOpacity, x: walkX }} className="will-change-transform">
          <WalkMascot dir={-1} className="block h-auto w-full" />
        </motion.div>
        <motion.div style={{ opacity: tadaaOpacity, scale: tadaaPop }} className="absolute inset-0 origin-bottom">
          <MascotTaDaa dir={-1} className="block h-auto w-full" />
        </motion.div>
      </div>
    </section>
  );
}
