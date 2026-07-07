import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  TrendingUp,
  Brain,
  Globe2,
  Beaker,
  Building2,
  Rocket,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { AgjLogo } from "@/components/AgjLogo";
import { CountUp } from "@/components/CountUp";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { TextEffect } from "@/components/ui/text-effect";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { ServiceCardStackSection } from "@/components/ServiceCardStackSection";
import { Magnetic } from "@/components/Magnetic";
import { CardHint } from "@/components/CardHint";
import { ScrollAssembleTitle } from "@/components/ScrollAssembleTitle";
import { LogosBand } from "@/components/LogosBand";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agjconfin — Consulenza Finanziaria & Innovazione" },
      {
        name: "description",
        content:
          "Trasformiamo idee e investimenti in crescita concreta. Consulenza in finanza agevolata, innovazione e trasferimento tecnologico dal 1990.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "2 Mld€", label: "Costi agevolati" },
  { value: "200+", label: "Aziende clienti" },
  { value: "95%", label: "Success rate" },
  { value: "800+", label: "Progetti seguiti" },
];

const highlights = [
  {
    icon: TrendingUp,
    title: "Finanza Agevolata",
    desc: "Bandi regionali, nazionali ed europei: dalla strategia alla rendicontazione.",
    detail:
      "Individuiamo le opportunità di finanziamento più coerenti con il progetto e accompagniamo l'azienda in ogni fase: dalla stesura della domanda alla gestione del finanziamento, fino alla rendicontazione finale. Copriamo bandi regionali (FESR), nazionali (MIMIT, MASE, MUR, Invitalia, SIMEST) ed europei (Horizon Europe, EIC).",
  },
  {
    icon: Building2,
    title: "Finanza Impresa",
    desc: "Strumenti di credito, finanza straordinaria e supporto agli investimenti.",
    detail:
      "Supportiamo operazioni straordinarie — M&A, leverage e management buy-out — e strumenti di finanza a supporto della crescita strutturale dell'impresa, affiancando il management nella pianificazione degli investimenti di lungo periodo.",
  },
  {
    icon: Brain,
    title: "Innovation Management",
    desc: "Roadmap tecnologiche e trasferimento dal laboratorio al mercato.",
    detail:
      "Individuiamo le innovazioni a maggior potenziale e definiamo roadmap tecnologiche strutturate, per supportare decisioni strategiche coerenti con gli obiettivi di crescita dell'impresa.",
  },
  {
    icon: Globe2,
    title: "Internazionalizzazione",
    desc: "Partenariati e relazioni industriali nazionali e internazionali.",
    detail:
      "Definiamo strategie e strumenti per l'espansione sui mercati esteri, costruendo partenariati industriali internazionali e individuando le agevolazioni dedicate ai percorsi di internazionalizzazione.",
  },
  {
    icon: Beaker,
    title: "R&D Applicata",
    desc: "Innovazione guidata dalla ricerca: affianchiamo le imprese nello sviluppo di soluzioni tecnologiche concrete e sostenibili.",
    detail:
      "Innovazione guidata dalla ricerca: insieme ai nostri partner ed alla consociata Jaber Innovation, affianchiamo le imprese nello sviluppo di soluzioni tecnologiche concrete e sostenibili. Sviluppiamo progetti nel campo dei materiali avanzati, biomateriali, nanomateriali e compositi, accompagnando l'innovazione dal laboratorio allo scale-up industriale.",
  },
];

function Home() {
  const [openHighlight, setOpenHighlight] = useState<(typeof highlights)[number] | null>(null);

  return (
    <PageShell>
      {/* HERO — faithful to the brochure cover */}
      <section className="relative overflow-hidden">
        <div className="container relative mx-auto px-4 pt-8 pb-20">
          {/* Top brochure strip */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 mb-10"
          >
            <AgjLogo variant="full" height={56} />
          </motion.div>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            {/* LEFT: title block */}
            <div>
              <div className="flex flex-nowrap items-baseline gap-x-2 sm:gap-x-3">
                <TextEffect
                  as="h1"
                  per="char"
                  preset="blur"
                  className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold leading-[0.95] text-petrol tracking-tight"
                >
                  AGJCONFIN
                </TextEffect>

                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="shrink-0 whitespace-nowrap text-lg sm:text-2xl md:text-3xl font-display font-semibold text-petrol/80"
                >
                  S.r.l
                </motion.span>
              </div>

              {/* Petrol ribbon */}
              <motion.div
                initial={{ opacity: 0, x: -40, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-8 inline-block"
              >
                <div className="petrol-ribbon px-8 py-4 pr-14">
                  <span className="text-xl md:text-2xl font-display font-bold tracking-wider">
                    CONSULENZA FINANZIARIA
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-10 text-lg text-foreground/80 max-w-xl leading-relaxed"
              >
                Uniamo innovazione e strategia per guidare il futuro degli investimenti.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Magnetic>
                  <Link
                    to="/servizi"
                    className="btn-shine glass-petrol px-6 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 hover:scale-105 transition-transform tr-premium duration-500 group"
                  >
                    Scopri i servizi{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform tr-premium duration-500"
                    />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.16}>
                  <Link
                    to="/contatti"
                    className="inline-flex px-6 py-3.5 rounded-xl font-semibold border border-petrol/30 text-petrol hover:bg-petrol/5 hover:border-petrol/50 transition-colors duration-500 tr-premium"
                  >
                    Contattaci
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* RIGHT: hexagon mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.9, type: "spring", stiffness: 90 }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <AgjLogo
                  variant="mark"
                  height="clamp(180px, 42vw, 420px)"
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="h-full text-center" tilt>
                <CountUp
                  value={s.value}
                  className="block text-4xl md:text-5xl font-bold text-gradient"
                />
                <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ECOSISTEMA — partner / institutional logos marquee */}
      <section className="container mx-auto px-4 py-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8"
        >
          In sinergia con l'ecosistema dell'innovazione
        </motion.p>
        <LogosBand />
      </section>

      {/* HIGHLIGHT — hero highlight section */}
      <section className="container mx-auto px-4 py-10">
        <HeroHighlight containerClassName="rounded-3xl py-20 px-6 bg-white/40 dark:bg-white/5">
          {/* Line-breaks stay art-directed (three balanced lines from lg up,
              measured at 15.7 / 21.0 / 22.6em in Space Grotesk Bold) while the
              words assemble as the heading scrolls into view. */}
          <ScrollAssembleTitle
            className="text-[1.7rem] sm:text-3xl md:text-4xl lg:text-[2.4rem] xl:text-[2.9rem] 2xl:text-[3.25rem] font-display font-bold text-petrol dark:text-teal-100 leading-[1.15] text-center mx-auto text-balance lg:text-wrap"
            lines={[
              [{ text: "La finanza non è solo opportunità" }],
              [{ text: "è lo strumento strategico che trasforma idee" }],
              [
                { text: "e investimenti in" },
                {
                  text: "crescita concreta e sostenibile.",
                  className: "font-extrabold text-petrol-deep dark:text-white",
                },
              ],
            ]}
          />
        </HeroHighlight>
      </section>

      {/* HIGHLIGHTS */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-petrol font-semibold">
            Cosa facciamo
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 text-gradient text-gradient-flow">
            Un partner unico, lungo tutto il percorso.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            Dalla definizione della strategia all'individuazione delle opportunità, dalla
            progettazione alla gestione operativa del finanziamento.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5" style={{ perspective: 1000 }}>
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
              className="aspect-square"
            >
              <button
                type="button"
                onClick={() => setOpenHighlight(h)}
                aria-haspopup="dialog"
                className="block h-full w-full cursor-pointer text-left"
              >
                <GlassCard className="h-full flex flex-col">
                  <CardHint />
                  <div className="w-12 h-12 rounded-2xl glass-petrol flex items-center justify-center mb-4 shrink-0 transition-transform duration-500 tr-premium group-hover:scale-110 group-hover:-rotate-3">
                    <h.icon size={22} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-petrol">{h.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
                    {h.desc}
                  </p>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modale di dettaglio — tap-to-expand per le card "Un partner unico" */}
      <Dialog
        open={openHighlight !== null}
        onOpenChange={(open) => !open && setOpenHighlight(null)}
      >
        <DialogContent className="max-w-lg">
          {openHighlight && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl glass-petrol flex items-center justify-center shrink-0">
                    <openHighlight.icon size={20} />
                  </div>
                  <DialogTitle className="font-display text-xl leading-tight text-petrol dark:text-teal-100">
                    {openHighlight.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  {openHighlight.desc}
                </DialogDescription>
              </DialogHeader>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {openHighlight.detail}
              </p>
              <Link
                to="/servizi"
                onClick={() => setOpenHighlight(null)}
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-petrol hover:underline underline-offset-4 dark:text-teal-300"
              >
                Vai ai servizi <ArrowRight size={14} />
              </Link>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CARD STACK — services carousel (shared with /servizi, always in sync) */}
      <ServiceCardStackSection />

      {/* CTA FINALE — effetto container-scroll 3D (citazione che sale + card che si raddrizza) */}
      <ContainerScroll
        titleComponent={
          <>
            <Award className="mx-auto mb-6 text-petrol" size={36} />
            <h2 className="font-display text-3xl font-medium leading-snug text-foreground md:text-5xl">
              Trasformiamo idee e investimenti in{" "}
              <span className="text-gradient">crescita concreta e sostenibile.</span>
            </h2>
          </>
        }
      >
        <div className="px-6 text-center">
          <Rocket className="mx-auto mb-6 text-petrol" size={40} />
          <h3 className="text-gradient text-gradient-flow text-3xl font-bold md:text-5xl">
            Il prossimo passo verso la vostra crescita inizia da qui.
          </h3>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link
                to="/contatti"
                className="btn-shine glass-petrol tr-premium inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-transform duration-500 hover:scale-105"
              >
                Contattaci <Users size={18} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </ContainerScroll>
    </PageShell>
  );
}
