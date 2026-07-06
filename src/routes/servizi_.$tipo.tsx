import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Landmark, MapPin, Globe2, CheckCircle2, ArrowLeft } from "lucide-react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { BandiFeed } from "@/components/BandiFeed";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";
import type { BandiCategory } from "@/lib/bandi.server";

/* ------------------------------------------------------------------ */
/* Config per ogni tipologia di servizio                                */
/* ------------------------------------------------------------------ */

const TIPO_CONFIG = {
  regionali: {
    icon: Landmark,
    eyebrow: "FESR · Fondi Strutturali Europei",
    title: "Finanziamenti Regionali",
    subtitle:
      "Accesso ai fondi regionali cofinanziati dall'Unione Europea tramite i Programmi Operativi Regionali (POR) e i Piani Nazionali di Ripresa e Resilienza (PNRR).",
    bandiCategory: "Regionale" as BandiCategory,
    bandiLabel: "Regionali",
    highlights: [
      "Analisi dei POR/FESR attivi nella regione target",
      "Verifica dei requisiti di accesso per l'azienda",
      "Redazione della domanda e della documentazione tecnica",
      "Gestione rendicontazioni e controlli in loco",
      "Monitoraggio degli avvisi regionali in tempo reale",
    ],
    description: `I finanziamenti regionali rappresentano una delle principali fonti di agevolazione per le PMI italiane. Attraverso i Programmi Operativi Regionali (POR) cofinanziati dal Fondo Europeo di Sviluppo Regionale (FESR) e dal Fondo Sociale Europeo (FSE), ogni Regione mette a disposizione risorse per sostenere investimenti in ricerca e sviluppo, innovazione tecnologica, digitalizzazione, internazionalizzazione e sostenibilità ambientale.

Il nostro team monitora in modo continuativo gli avvisi pubblici di tutte le Regioni italiane e supporta le imprese in ogni fase del percorso: dalla valutazione dell'opportunità alla presentazione della domanda, fino alla rendicontazione finale e alla gestione delle eventuali ispezioni. Grazie a una rete di professionisti con esperienza diretta presso gli Enti gestori, garantiamo un supporto puntuale e tempestivo.`,
  },

  nazionali: {
    icon: MapPin,
    eyebrow: "MIMIT · MUR · Invitalia · SIMEST · SACE",
    title: "Finanziamenti Nazionali",
    subtitle:
      "Agevolazioni economiche erogate dai Ministeri e dagli Enti nazionali preposti: contributi a fondo perduto, finanziamenti agevolati, crediti d'imposta e garanzie pubbliche.",
    bandiCategory: "Nazionale" as BandiCategory,
    bandiLabel: "Nazionali",
    highlights: [
      "Mappatura degli strumenti MIMIT, MUR, Invitalia, SIMEST, SACE",
      "Valutazione costi-benefici tra strumenti alternativi",
      "Credito d'imposta Ricerca & Sviluppo e innovazione tecnologica",
      "Contratti di sviluppo e accordi di programma",
      "Supporto alle operazioni di internazionalizzazione (SIMEST/SACE)",
    ],
    description: `Il panorama degli incentivi nazionali è estremamente articolato: MIMIT, MUR, Invitalia, SIMEST e SACE gestiscono decine di strumenti agevolativi rivolti a imprese di ogni dimensione e settore. Crediti d'imposta per Ricerca & Sviluppo, incentivi per gli investimenti tecnologici e per la transizione digitale ed energetica, Contratti di Sviluppo, voucher per l'innovazione e contributi per l'internazionalizzazione sono solo alcune delle principali misure disponibili.

Agjconfin dispone di una conoscenza approfondita di tutti questi strumenti, maturata in oltre 36 anni di attività. Offriamo un servizio completo che va dall'analisi preliminare dell'ammissibilità alla presentazione della domanda, dalla gestione degli adempimenti documentali al presidio dei controlli ministeriali. La nostra rete di partner tecnici ci consente di strutturare operazioni complesse, come i Contratti di Sviluppo, con tempi certi e risultati misurabili.`,
  },

  europei: {
    icon: Globe2,
    eyebrow: "Horizon Europe · EIC · LIFE · COSME",
    title: "Finanziamenti Europei",
    subtitle:
      "Programmi quadro dell'Unione Europea per Ricerca, Sviluppo e Innovazione: Horizon Europe, European Innovation Council (EIC), LIFE, COSME e strumenti di finanza blended.",
    bandiCategory: "Europeo" as BandiCategory,
    bandiLabel: "Europei",
    highlights: [
      "Valutazione di eligibilità per Horizon Europe e EIC",
      "Costruzione di consorzi di ricerca internazionali",
      "Redazione di proposal tecnico-scientifici (B1 e B2)",
      "Grant Agreement e gestione post-approvazione",
      "Monitoraggio dei Work Programme annuali",
    ],
    description: `I programmi europei rappresentano la frontiera più avanzata del finanziamento all'innovazione, con budget pluriennali che superano i 90 miliardi di euro solo per Horizon Europe (2021–2027). Strumenti come l'EIC Accelerator, l'EIC Pathfinder, MSCA e i bandi di collaborazione per PMI innovative offrono opportunità straordinarie per le imprese in grado di strutturare progetti di elevato impatto tecnologico e scientifico.

La complessità procedurale e la forte competitività internazionale richiedono un supporto specializzato fin dalle prime fasi: identificazione del bando giusto, costruzione del consorzio, redazione della proposta tecnica e finanziaria, gestione della negoziazione con la Commissione Europea. Agjconfin affianca le imprese con un team dedicato di esperti di progettazione europea, garantendo la massima qualità della proposta e un monitoraggio costante delle opportunità aperte.`,
  },
} as const;

type Tipo = keyof typeof TIPO_CONFIG;

/* ------------------------------------------------------------------ */
/* Route                                                                */
/* ------------------------------------------------------------------ */

export const Route = createFileRoute("/servizi_/$tipo")({
  head: ({ params }) => {
    const config = TIPO_CONFIG[params.tipo as Tipo];
    if (!config) return {};
    return {
      meta: [
        { title: `${config.title} — Agjconfin` },
        { name: "description", content: config.subtitle },
      ],
    };
  },
  component: ServiziDetail,
});

function ServiziDetail() {
  const { tipo } = Route.useParams();
  const config = TIPO_CONFIG[tipo as Tipo];

  if (!config) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-40 text-center">
          <h1 className="text-4xl font-bold">Pagina non trovata</h1>
          <p className="mt-4 text-muted-foreground">
            La tipologia di servizio richiesta non esiste.
          </p>
          <Link
            to="/servizi"
            className="mt-8 inline-flex items-center gap-2 glass-petrol rounded-xl px-6 py-3 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Torna ai Servizi
          </Link>
        </div>
      </PageShell>
    );
  }

  const {
    icon: Icon,
    eyebrow,
    title,
    subtitle,
    highlights,
    description,
    bandiCategory,
    bandiLabel,
  } = config;

  return (
    <PageShell>
      <OminiScrollLayer variant="general" />

      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      {/* Breadcrumb / back */}
      <div className="container mx-auto px-4 -mt-4 mb-8">
        <Link
          to="/servizi"
          className="inline-flex items-center gap-2 rounded-xl border border-petrol/30 px-4 py-2.5 text-sm font-semibold text-petrol transition-colors hover:bg-petrol/5 dark:border-teal-300/30 dark:text-teal-200 dark:hover:bg-teal-300/10"
        >
          <ArrowLeft size={14} /> Tutti i Servizi
        </Link>
      </div>

      {/* Descrizione + highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 max-w-6xl mx-auto items-start">
          {/* Testo descrittivo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-violet/20 flex items-center justify-center">
                  <Icon className="text-violet-glow" size={24} />
                </div>
                <h2 className="text-2xl font-display font-semibold">Il nostro approccio</h2>
              </div>
              {description.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`text-muted-foreground leading-relaxed ${i > 0 ? "mt-4" : ""}`}
                >
                  {para}
                </p>
              ))}
            </GlassCard>
          </motion.div>

          {/* Checklist highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-[320px] shrink-0"
          >
            <GlassCard className="h-full">
              <h3 className="font-display font-semibold text-lg mb-5 text-gradient">
                Cosa facciamo per te
              </h3>
              <ul className="space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle2 className="text-teal-400 mt-0.5 shrink-0" size={16} />
                    <span className="text-sm text-muted-foreground leading-snug">{h}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Feed bandi filtrato per categoria */}
      <BandiFeed category={bandiCategory} label={bandiLabel} />
    </PageShell>
  );
}
