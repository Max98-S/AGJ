import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Quote, Target, History, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi Siamo — Agjconfin" },
      {
        name: "description",
        content:
          "Agjconfin: società di consulenza indipendente fondata nel 1990. Innovazione, finanza agevolata e operazioni straordinarie.",
      },
    ],
  }),
  component: ChiSiamo,
});

const pillars = [
  {
    icon: History,
    title: "Dal 1990",
    desc: "Fondata da un ex dirigente dell'Istituto Mobiliare Italiano con oltre trent'anni di esperienza nei settori finanziario e industriale.",
  },
  {
    icon: Users,
    title: "Team qualificato",
    desc: "Professionisti con competenze consolidate e trasversali in finanza, innovazione e trasferimento tecnologico.",
  },
  {
    icon: Target,
    title: "Indipendenza",
    desc: "Supportiamo imprese ed enti pubblici nei percorsi di crescita con totale indipendenza e visione strategica.",
  },
];

function ChiSiamo() {
  return (
    <PageShell>
      <OminiScrollLayer variant="general" />
      <PageHeader
        eyebrow="Introduzione · Chi Siamo · I Nostri Obiettivi"
        title="Consulenza indipendente per chi costruisce il futuro."
        subtitle="Offriamo servizi di consulenza finanziaria finalizzati all'accesso agli strumenti di finanza agevolata, supportando le imprese in tutte le fasi del processo, dall'analisi delle opportunità alla presentazione della domanda."
      />

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-5" style={{ perspective: 1200 }}>
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <p.icon
                  className="text-violet-glow mb-4 transition-transform duration-500 tr-premium group-hover:scale-110 group-hover:-rotate-3"
                  size={28}
                />
                <h3 className="font-display font-semibold text-xl">{p.title}</h3>
                <p className="mt-3 text-muted-foreground opacity-85 transition-opacity duration-500 group-hover:opacity-100">
                  {p.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-strong rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet/30 blur-3xl rounded-full" />
          <Quote className="text-violet-glow mb-4" size={32} />
          <p className="text-2xl md:text-3xl font-display leading-snug">
            Non ci limitiamo a fornire consulenza:{" "}
            <span className="text-gradient font-semibold">
              integriamo competenze, ricerca, sviluppo e finanza
            </span>{" "}
            in un unico ecosistema, affinché le imprese possano concentrarsi sul proprio business
            mentre noi trasformiamo le idee in risultati concreti.
          </p>
        </motion.div>
      </section>

      {/* Perché innovare */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-violet-glow">
            I nostri obiettivi
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 text-gradient">Perché innovare?</h2>
          <p className="mt-6 text-muted-foreground text-lg">
            In un mercato spesso orientato alla stabilità e alla gestione del presente, innovare
            rappresenta la scelta strategica che distingue chi si limita a sopravvivere da chi
            costruisce crescita e vantaggio competitivo nel tempo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto auto-rows-fr">
          {[
            {
              t: "Strategia di supporto finanziario",
              d: "Ai piani di investimento di lungo periodo.",
            },
            { t: "Percorso di crescita", d: "Di lungo periodo e non occasionale." },
            { t: "Opportunità organizzativa", d: "Per ripensare all'organizzazione e crescita." },
            { t: "Relazioni & partenariati", d: "Industriali nazionali e internazionali." },
          ].map((it, i) => (
            <motion.div
              key={it.t}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet/30 flex items-center justify-center text-violet-glow font-bold shrink-0 transition-transform duration-500 tr-premium group-hover:scale-110 group-hover:-rotate-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg">{it.t}</h3>
                    <p className="text-muted-foreground mt-1 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
                      {it.d}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
