import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Globe2,
  Search,
  FileText,
  ClipboardCheck,
  Lightbulb,
  Landmark,
  MapPin,
  Cpu,
  Leaf,
  FlaskConical,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { FanCardStack } from "@/components/FanCardStack";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";
import { ServiceCardStackSection } from "@/components/ServiceCardStackSection";
import { ServiceZoomParallax } from "@/components/ServiceZoomParallax";
import { ServiceMascotFinanziamenti } from "@/components/ServiceMascotFinanziamenti";

export const Route = createFileRoute("/servizi")({
  head: () => ({
    meta: [
      { title: "Servizi — Agjconfin" },
      {
        name: "description",
        content:
          "Finanza agevolata, Finanza Impresa, Internazionalizzazione, Trasferimento Tecnologico: una gamma completa di servizi per imprese e centri di ricerca.",
      },
    ],
  }),
  component: Servizi,
});

const subServices = [
  {
    icon: Lightbulb,
    title: "Innovation Management",
    desc: "Individuazione innovazioni e definizione roadmap tecnologica per decisioni strategiche.",
  },
  {
    icon: Search,
    title: "Grant Assessment",
    desc: "Identificazione delle opportunità di finanziamento coerenti con l'idea progettuale.",
  },
  {
    icon: FileText,
    title: "Fase di presentazione",
    desc: "Redazione di proposte progettuali per l'ottenimento di finanziamenti.",
  },
  {
    icon: ClipboardCheck,
    title: "Management e Rendicontazione",
    desc: "Gestione del finanziamento, del progetto e del partenariato.",
  },
];

const competences = [
  {
    icon: Landmark,
    slug: "regionali",
    title: "Regionali",
    desc: "Fondo Europeo Sviluppo Regionale (FESR).",
  },
  {
    icon: MapPin,
    slug: "nazionali",
    title: "Nazionali",
    desc: "Agevolazioni economiche dai Ministeri (MIMIT, MASE, MUR, Invitalia, SIMEST).",
  },
  {
    icon: Globe2,
    slug: "europei",
    title: "Europei",
    desc: "Programmi quadro Ricerca, Sviluppo, Innovazione (Horizon Europe, EIC).",
  },
];

const fiscal = [
  {
    icon: FlaskConical,
    title: "Credito d'Imposta R&S&I",
    desc: "Credito d'Imposta Ricerca, Sviluppo, Innovazione tecnologica (CIRI).",
  },
  {
    icon: ShieldCheck,
    title: "Certificazione CIRI",
    desc: "Asseverazione tecnica per accesso al credito d'imposta.",
  },
  {
    icon: Cpu,
    title: "Investimenti Tecnologici",
    desc: "Incentivi per beni strumentali avanzati, digitalizzazione e ammodernamento dei processi produttivi.",
  },
  {
    icon: Leaf,
    title: "Transizione Digitale ed Energetica",
    desc: "Agevolazioni per l'efficientamento energetico e lo sviluppo competitivo delle imprese.",
  },
];

function Servizi() {
  return (
    <PageShell>
      <OminiScrollLayer variant="servizi" />

      {/* Intro "immersiva": la mascotte indica il titolo, poi cammina via a sinistra */}
      <ServiceZoomParallax subtitle="Agjconfin supporta aziende e centri di ricerca nell'accesso ai finanziamenti pubblici e nell'Innovation Management con una gamma integrata di servizi." />

      {/* La mascotte rientra da sinistra e indica i finanziamenti agevolati */}
      <ServiceMascotFinanziamenti />

      {/* Carosello servizi — stesso componente/contenuto della home, sempre allineati */}
      <ServiceCardStackSection showCta={false} className="pt-4 pb-24" />

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-violet-glow">
            Finanziamenti Pubblici R&S
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">Servizi end-to-end</h2>
          <p className="mt-6 text-muted-foreground">
            Un partner unico lungo tutto il percorso: dalla strategia alla rendicontazione finale.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FanCardStack items={subServices} />
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-violet-glow">
            Aree di Competenza
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Finanziamenti Agevolati
          </h2>
          <p className="mt-6 text-muted-foreground">
            Competenze integrate e specialistiche che accompagnano imprese ed enti in ogni fase del
            percorso di sviluppo.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5 auto-rows-fr">
          {competences.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/servizi/$tipo"
                params={{ tipo: c.slug }}
                className="block h-full group/comp"
              >
                <GlassCard className="h-full text-center transition-shadow group-hover/comp:shadow-xl group-hover/comp:-translate-y-1 duration-300">
                  <c.icon
                    className="mx-auto text-violet-glow mb-4 transition-transform tr-premium group-hover/comp:scale-110 group-hover/comp:-rotate-3 duration-500"
                    size={30}
                  />
                  <h3 className="font-display font-semibold text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground opacity-85 transition-opacity duration-500 group-hover/comp:opacity-100">
                    {c.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-petrol dark:text-teal-300 group-hover/comp:underline underline-offset-4">
                    Scopri →
                  </span>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
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
            Agevolazioni Fiscali
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Credito d'imposta & Transizione
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FanCardStack items={fiscal} />
        </motion.div>
      </section>
    </PageShell>
  );
}
