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
  ArrowRight,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { FanCardStack } from "@/components/FanCardStack";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";
import { ServiceCardStackSection } from "@/components/ServiceCardStackSection";
import { ServiceIllustration } from "@/components/illustrations";
import { TextEffect } from "@/components/ui/text-effect";

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

      {/* HERO — titolo grande al centro; illustrazioni ai lati per riempire lo spazio */}
      <section className="relative overflow-hidden px-4 pb-6 pt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(29,112,136,0.10),transparent_65%)] blur-2xl"
        />
        <div className="container relative mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-petrol">
              I nostri servizi
            </span>
            {/* stesso effetto del titolo di "Chi siamo" (blur, parola per parola).
                NB: niente `text-gradient` qui — usa background-clip:text +
                text-fill-color:transparent, e le parole (che TextEffect rende
                come <span> figli) risulterebbero invisibili. */}
            <TextEffect
              as="h1"
              per="word"
              preset="blur"
              delay={0.1}
              className="mx-auto mt-5 text-5xl font-bold leading-[1.05] text-petrol dark:text-teal-100 sm:text-6xl md:text-7xl"
            >
              Una gamma completa per crescere, innovare, competere.
            </TextEffect>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Agjconfin supporta aziende e centri di ricerca nell'accesso ai finanziamenti pubblici
              e nell'Innovation Management con una gamma integrata di servizi.
            </p>
          </motion.div>

          {/* illustrazioni: trasferimento tecnologico a sinistra, innovation management in basso a destra */}
          <div className="mt-2 grid items-end gap-6 md:mt-[-3rem] md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="order-2 md:order-1"
            >
              <div className="w-full max-w-md md:ml-[2%] lg:max-w-lg">
                <ServiceIllustration kind="trasferimento-tecnologico" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="order-1 flex justify-center md:order-2 md:mt-16 md:justify-end"
            >
              <div className="w-full max-w-md md:mr-[2%] lg:max-w-lg">
                <ServiceIllustration kind="innovation-management" />
              </div>
            </motion.div>
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
            Aree di Competenza
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Finanziamenti Agevolati
          </h2>
          <p className="mt-6 text-muted-foreground">
            Individuiamo le opportunità di finanziamento più coerenti con il progetto e
            accompagniamo l'azienda in ogni fase: dalla stesura della domanda alla gestione del
            finanziamento, fino alla rendicontazione finale.
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

      {/* CTA finale — contatti */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-gradient md:text-4xl">
            Parliamo del vostro progetto.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dalla ricerca dei bandi alla rendicontazione finale: un unico partner per l'intero
            percorso.
          </p>
          <Link
            to="/contatti"
            className="btn-shine glass-petrol mt-7 inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold transition-transform duration-500 hover:scale-105"
          >
            Contattaci <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </PageShell>
  );
}
