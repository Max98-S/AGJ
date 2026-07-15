import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import { CardHint } from "@/components/CardHint";
import {
  SERVICE_ILLUSTRATIONS,
  ServiceIllustrationCard,
  type ServiceKind,
} from "@/components/illustrations";
import { cn } from "@/lib/utils";

export type ServiceCard = CardStackItem & { kind: ServiceKind };

/**
 * Single source of truth for the 5 service cards shown in the scrolling
 * card-stack carousel. Shared between the home page and /servizi so the
 * two stay perfectly in sync (same content, same order, same artwork).
 */
export const serviceCards: ServiceCard[] = [
  {
    id: 1,
    kind: "finanza-agevolata",
    title: "Finanza Agevolata",
    description: "Bandi regionali, nazionali ed europei: dalla strategia alla rendicontazione.",
    tag: "Core service",
  },
  {
    id: 2,
    kind: "finanza-impresa",
    title: "Finanza d'Impresa",
    description: "Strumenti di credito, finanza straordinaria e supporto agli investimenti.",
    tag: "Capital",
  },
  {
    id: 3,
    kind: "trasferimento-tecnologico",
    title: "Trasferimento Tecnologico",
    description: "Dal laboratorio al mercato: scale-up industriale con Jaber Innovation.",
    tag: "Innovation",
  },
  {
    id: 4,
    kind: "ricerca-sviluppo",
    title: "Ricerca & Sviluppo",
    description: "Innovazione guidata dalla ricerca, dal laboratorio allo scale-up industriale.",
    tag: "R&D",
  },
  {
    id: 5,
    kind: "innovation-management",
    title: "Innovation Management",
    description: "Roadmap tecnologiche e supporto strategico per progetti complessi.",
    tag: "Strategy",
  },
];

export function ServiceCardStackSection({
  eyebrow = "I nostri servizi",
  title = "Esplora la nostra offerta",
  showCta = true,
  className,
}: {
  eyebrow?: string;
  title?: string;
  /** Show the "Scopri il servizio" link on the active card. Turn off when the
   * section already lives on /servizi — linking to the current page is redundant. */
  showCta?: boolean;
  className?: string;
}) {
  const [openCard, setOpenCard] = useState<ServiceCard | null>(null);

  // The card stack uses fixed pixel dimensions; on phones a 400px-wide card
  // overflows and clips. Measure the viewport and shrink the deck to fit,
  // keeping the original 400:420 proportion. Desktop stays 400x420.
  const [dims, setDims] = useState({ w: 400, h: 420 });
  useEffect(() => {
    const compute = () => {
      const w = Math.max(248, Math.min(400, window.innerWidth - 44));
      setDims({ w, h: Math.round(w * 1.05) });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (!openCard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCard(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openCard]);

  return (
    <section className={cn("container mx-auto px-4 py-20", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-petrol font-semibold">
          {eyebrow}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">{title}</h2>
      </motion.div>

      <CardStack
        items={serviceCards}
        cardWidth={dims.w}
        cardHeight={dims.h}
        autoAdvance
        intervalMs={4200}
        renderCard={(item, { active }) => (
          <div
            onClick={
              active
                ? (e) => {
                    e.stopPropagation();
                    setOpenCard(item);
                  }
                : undefined
            }
            className={cn("group relative h-full w-full", active && "cursor-pointer")}
          >
            <ServiceIllustrationCard
              kind={item.kind}
              active={active}
              action={
                showCta ? (
                  <Link
                    to="/servizi"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={active ? 0 : -1}
                    className={cn(
                      "glass-petrol px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex w-fit items-center gap-1.5 shadow-lg transition-all hover:scale-105",
                      active ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                  >
                    Scopri il servizio <ArrowRight size={13} />
                  </Link>
                ) : undefined
              }
            />
            <CardHint
              className={cn("left-3 right-auto top-3", active ? "opacity-100" : "opacity-0")}
            />
          </div>
        )}
      />

      <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground/70 md:hidden">
        Scorri o tocca una card →
      </p>

      {/* Modale "più info" — al click sulla card attiva: si alza, si gira, blur sullo sfondo */}
      <AnimatePresence>
        {openCard && (
          <motion.div
            key="backdrop"
            role="presentation"
            onClick={() => setOpenCard(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          >
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-card-expand-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 60, rotateY: -18, scale: 0.9 }}
              animate={{ opacity: 1, y: -8, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, rotateY: 12, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              style={{ transformPerspective: 1200 }}
              className="glass-strong relative w-full max-w-md rounded-3xl p-8"
            >
              <button
                type="button"
                onClick={() => setOpenCard(null)}
                aria-label="Chiudi"
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <X size={18} />
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-petrol dark:text-teal-300">
                {SERVICE_ILLUSTRATIONS[openCard.kind].tag}
              </span>
              <h3
                id="service-card-expand-title"
                className="mt-2 font-display text-2xl font-semibold text-petrol dark:text-teal-100"
              >
                {SERVICE_ILLUSTRATIONS[openCard.kind].title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {SERVICE_ILLUSTRATIONS[openCard.kind].detail}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
