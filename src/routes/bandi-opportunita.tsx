import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/utils";
import { TrendingUp, Building2, Award, Rocket, BarChart3 } from "lucide-react";
import { BandiNews } from "@/components/BandiNews";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";

export const Route = createFileRoute("/bandi-opportunita")({
  head: () => ({
    meta: [
      { title: "Bandi & Opportunità — Agjconfin" },
      {
        name: "description",
        content:
          "Oltre 2 miliardi € di costi agevolati, 200+ aziende clienti, success rate >95%. Esperienza nei bandi MISE, Horizon Europe, FESR e MIMIT.",
      },
    ],
  }),
  component: Bandi,
});

const numbers = [
  { icon: TrendingUp, value: "2 Mld€", label: "Costi agevolati" },
  { icon: Building2, value: "200+", label: "Aziende clienti" },
  { icon: Award, value: "95%+", label: "Success rate" },
  { icon: BarChart3, value: "800+", label: "Progetti seguiti" },
  { icon: Rocket, value: "36 anni", label: "Di esperienza continuativa" },
];

const bandi = [
  {
    tag: "REGIONALE",
    title: "Fondo Europeo Sviluppo Regionale (FESR)",
    desc: "Bandi regionali per investimenti, R&S, digitalizzazione e sostenibilità.",
  },
  {
    tag: "NAZIONALE",
    title: "MIMIT — Ministero delle Imprese e del Made in Italy",
    desc: "Agevolazioni economiche per imprese, contratti di sviluppo, fondi per l'innovazione.",
  },
  {
    tag: "NAZIONALE",
    title: "MASE — Ministero dell'Ambiente e Sicurezza Energetica",
    desc: "Strumenti per la transizione energetica e progetti di sostenibilità.",
  },
  {
    tag: "NAZIONALE",
    title: "MUR — Ministero dell'Università e della Ricerca",
    desc: "Bandi PNRR, PRIN e finanziamenti per la ricerca applicata.",
  },
  {
    tag: "NAZIONALE",
    title: "Invitalia & SIMEST",
    desc: "Strumenti per la nascita di nuove imprese, M&A e internazionalizzazione.",
  },
  {
    tag: "EUROPEO",
    title: "Horizon Europe & EIC",
    desc: "Programmi quadro per ricerca, sviluppo e innovazione a livello europeo.",
  },
  {
    tag: "FISCALE",
    title: "Credito d'Imposta R&S&I (CIRI)",
    desc: "Credito d'imposta per Ricerca, Sviluppo, Innovazione tecnologica con certificazione.",
  },
  {
    tag: "FISCALE",
    title: "Incentivi per Innovazione e Investimenti",
    desc: "Agevolazioni per investimenti tecnologici, trasformazione digitale ed efficientamento energetico.",
  },
];

const TAG_STYLE: Record<string, string> = {
  REGIONALE: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  NAZIONALE: "bg-petrol/15 text-petrol dark:text-teal-200",
  EUROPEO: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  FISCALE: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

function Bandi() {
  return (
    <PageShell>
      <OminiScrollLayer variant="bandi" />
      <PageHeader
        eyebrow="I Nostri Numeri · Bandi & Opportunità"
        title="Risultati che parlano per noi."
        subtitle="Una mappa completa delle opportunità di finanziamento pubblico, supportata da un track record di oltre tre decenni."
      />

      <section className="container mx-auto px-4 py-12 lg:py-16">
        {/* "Ascending skyline": the five metrics climb from left to right
            like a growth chart — the layout itself tells the story of the
            track record. A dashed trend line draws itself behind the cards,
            each card reveals with a small spring stagger and then floats
            on its own phase. Below lg everything falls back to a clean
            2/3-column grid. */}
        <div className="relative max-w-6xl mx-auto">
          <svg
            aria-hidden
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden lg:block h-full w-full"
            fill="none"
          >
            <motion.path
              d="M 15 360 C 180 348 260 300 400 272 C 540 244 620 180 760 140 C 850 114 930 82 985 62"
              stroke="var(--petrol-light)"
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="6 9"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 items-end">
            {numbers.map((n, i) => (
              <motion.div
                key={n.label}
                className={cn(
                  ["lg:mb-0", "lg:mb-10", "lg:mb-20", "lg:mb-28", "lg:mb-36"][i],
                  i === 4 && "col-span-2 md:col-span-1",
                )}
                initial={{ opacity: 0, y: 70, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 90, damping: 16 }}
              >
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{
                    duration: 5.5 + i * 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35,
                  }}
                >
                  <GlassCard className="h-full text-center">
                    <n.icon
                      className="mx-auto text-violet-glow mb-3 transition-transform duration-500 tr-premium group-hover:scale-110 group-hover:-rotate-3"
                      size={28}
                    />
                    <CountUp
                      value={n.value}
                      className="block text-3xl md:text-4xl font-bold text-gradient"
                    />
                    <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                      {n.label}
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-violet-glow">
            Mappa delle opportunità
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient text-gradient-flow">
            Bandi regionali, nazionali ed europei
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto auto-rows-fr">
          {bandi.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 2) * 0.1 }}
            >
              <GlassCard className="h-full">
                <span
                  className={`mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-transform duration-500 tr-premium group-hover:scale-105 ${TAG_STYLE[b.tag] ?? "bg-petrol/15 text-petrol dark:text-teal-200"}`}
                >
                  {b.tag}
                </span>
                <h3 className="font-display font-semibold text-lg">{b.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 opacity-85 transition-opacity duration-500 group-hover:opacity-100">
                  {b.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <BandiNews />
    </PageShell>
  );
}
