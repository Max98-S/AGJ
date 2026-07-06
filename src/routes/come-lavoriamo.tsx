import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";

export const Route = createFileRoute("/come-lavoriamo")({
  head: () => ({
    meta: [
      { title: "Come Lavoriamo — Agjconfin" },
      {
        name: "description",
        content:
          "Le 6 fasi del nostro supporto: dall'individuazione dello strumento al rendiconto finale. Un metodo integrato che riduce rischi e massimizza il valore.",
      },
    ],
  }),
  component: ComeLavoriamo,
});

const phases = [
  {
    n: "01",
    title: "Individuazione strumento",
    desc: "Individuazione dello strumento finanziario più idoneo in ambito europeo, nazionale e regionale.",
  },
  {
    n: "02",
    title: "Analisi & partenariato",
    desc: "Analisi di fattibilità del progetto; ricerca partner nel caso di progetti in cordata e supporto nella costituzione del partenariato.",
  },
  {
    n: "03",
    title: "Stesura domanda",
    desc: "Consulenza per la stesura della domanda di agevolazione e individuazione delle spese ammissibili.",
  },
  {
    n: "04",
    title: "Istruttoria & firma",
    desc: "Assistenza durante la fase istruttoria; supporto e negoziazione Consorzio, firma dell'atto di concessione / Contratto Finanziamento / Grant Agreement.",
  },
  {
    n: "05",
    title: "Attività di R&D",
    desc: "Dalla consulenza alla ricerca: accompagniamo l'innovazione in ogni sua fase, in sinergia con una rete di partner di ricerca, pubblici e privati — tra cui Jaber Innovation.",
  },
  {
    n: "06",
    title: "Rendicontazione",
    desc: "Rendicontazione tecnico-economica fino all'ultima erogazione; project management, gestione dei rapporti con ente finanziatore; audit dei progetti.",
  },
];

function ComeLavoriamo() {
  return (
    <PageShell>
      <OminiScrollLayer variant="general" />
      <PageHeader
        eyebrow="Le Nostre Fasi"
        title="Un metodo integrato. Sei fasi. Un risultato."
        subtitle="Riduciamo i rischi, ottimizziamo i tempi e massimizziamo il valore delle opportunità, trasformando le idee in risultati concreti."
      />

      <section className="container mx-auto px-4 py-12">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet via-violet-glow to-cyan-glow opacity-40" />
          {phases.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative pl-20 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={i % 2 ? "md:text-left" : "md:text-right"}>
                <GlassCard>
                  <div className="text-5xl font-bold text-gradient mb-2">{p.n}</div>
                  <h3
                    className={
                      p.title.includes("&")
                        ? "font-body font-semibold tracking-normal text-xl"
                        : "font-display font-semibold text-xl"
                    }
                  >
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{p.desc}</p>
                </GlassCard>
              </div>
              <div className="hidden md:block" />
              <div className="absolute left-4 md:left-1/2 top-8 -translate-x-1/2 w-8 h-8 rounded-full bg-violet glass-strong flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-violet-glow animate-pulse-glow" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
