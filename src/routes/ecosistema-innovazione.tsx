import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { Atom, FlaskConical, Layers, Cpu, BookOpen, X } from "lucide-react";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/ecosistema-innovazione")({
  head: () => ({
    meta: [
      { title: "Ecosistema Innovazione — Agjconfin & Jaber Innovation" },
      {
        name: "description",
        content:
          "Jaber Innovation S.r.l: coating funzionali, biomateriali, nanomateriali e nanocompositi a base grafene. Dalla ricerca allo scale-up industriale.",
      },
    ],
  }),
  component: Ecosistema,
});

const focus = [
  {
    icon: Layers,
    title: "Coating funzionali & attivi",
    desc: "Rivestimenti ad alte prestazioni per packaging, automotive, aeronautico.",
    detail: `I coating funzionali e attivi sono rivestimenti ad alte prestazioni progettati per conferire proprietà specifiche alle superfici dei materiali. Le nostre soluzioni includono coating barriera per il packaging alimentare e non, rivestimenti anti-corrosione e anti-usura per il settore automotive e aeronautico, coating con proprietà antibatteriche per applicazioni medicali e alimentari, e trattamenti superficiali funzionalizzati per l'elettronica di consumo.

Sviluppiamo formulazioni su misura in stretta collaborazione con le imprese partner, garantendo piena compatibilità con i processi industriali esistenti e ottimizzando le performance in termini di adesione, durabilità e scalabilità produttiva. L'attività di R&S si integra con percorsi di trasferimento tecnologico orientati allo scale-up industriale.`,
  },
  {
    icon: FlaskConical,
    title: "Biomateriali",
    desc: "Materiali bio-based per biomedicale, tessile e industria della carta.",
    detail: `La ricerca sui biomateriali si concentra su polimeri bio-based, bioplastiche e bio-compositi per applicazioni in settori ad alto valore aggiunto. Le nostre competenze coprono materiali biocompatibili per dispositivi medicali e scaffolding tissutale, fibre e finishing tessili a base naturale con proprietà funzionali avanzate, carta e cartone a composizione bio-ibrida per packaging sostenibile, e bio-resine per la sostituzione delle plastiche convenzionali.

Lavoriamo con una rete di centri di ricerca pubblici e privati per accelerare il percorso dalla sintesi in laboratorio alla validazione industriale, con particolare attenzione alla conformità normativa (Reg. CE, REACH, FDA) e alla sostenibilità del ciclo di vita del prodotto.`,
  },
  {
    icon: Atom,
    title: "Nanomateriali & grafene",
    desc: "Nanocompositi a base grafene per elettronica e applicazioni avanzate.",
    detail: `Il grafene e i nanomateriali correlati (ossido di grafene, nanotubi di carbonio, nanoparticelle funzionalizzate) aprono scenari applicativi in continua espansione. Le nostre attività di R&S coprono nanocompositi a base grafene per migliorare le proprietà meccaniche, termiche ed elettriche di matrici polimeriche, inchiostri e paste conduttive per l'elettronica stampata e flessibile, materiali per la gestione termica in sistemi di potenza e batterie, e sensori e interfacce funzionali per applicazioni IoT e wearable.

Disponiamo di competenze caratterizzative avanzate (spettroscopia Raman, AFM, TEM) e di accesso a linee pilota per la produzione di nanocompositi su scala semi-industriale, garantendo la riproducibilità e la traslazione delle formulazioni dal laboratorio alla linea produttiva.`,
  },
  {
    icon: Cpu,
    title: "Compositi avanzati",
    desc: "Soluzioni orientate allo scale-up industriale e trasferimento tecnologico.",
    detail: `I compositi avanzati rappresentano una delle frontiere più promettenti per la riduzione del peso strutturale e il miglioramento delle performance meccaniche in settori come aerospace, automotive, edilizia e sport. Le nostre soluzioni includono compositi a matrice polimerica rinforzati con fibre di carbonio, vetro o naturali (CFRP, GFRP, NFCs), materiali ibridi multi-funzionali con integrazione di funzionalità elettriche o sensoristiche, e formulazioni orientate alla riciclabilità e alla sostenibilità del ciclo di vita.

Il percorso di sviluppo comprende la definizione delle specifiche di progetto, la sintesi e la caratterizzazione delle formulazioni, la produzione di prototipi dimostrativi e l'accompagnamento verso lo scale-up industriale in collaborazione con partner produttivi selezionati.`,
  },
];

function Ecosistema() {
  const [openCard, setOpenCard] = useState<(typeof focus)[0] | null>(null);

  return (
    <PageShell>
      <OminiScrollLayer variant="general" />
      <PageHeader
        eyebrow="Fase 5 · Attività di R&D"
        title="Un unico partner per l'intero percorso di innovazione"
        subtitle="Dalla strategia alla ricerca applicata, dalla validazione tecnologica all'accesso ai finanziamenti: coordiniamo competenze specialistiche per trasformare progetti innovativi in risultati concreti."
      />

      {/* Citazione — punto 10 */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-petrol rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <blockquote className="text-xl md:text-2xl font-display font-medium leading-snug text-white">
              "Le imprese non hanno bisogno di dieci fornitori diversi per innovare. Hanno bisogno
              di un partner capace di coordinare{" "}
              <span className="text-teal-200">competenze, ricerca e strumenti finanziari</span> in
              un unico percorso orientato ai risultati."
            </blockquote>
          </div>
        </motion.div>
      </section>

      {/* Modello integrato — punto 11 */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard className="md:p-12">
            <span className="text-xs uppercase tracking-[0.3em] text-violet-glow">
              Un modello integrato
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold mt-4">
              Un modello integrato,{" "}
              <span className="text-gradient">non una semplice consulenza</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Abbiamo costruito una rete di competenze specialistiche nella ricerca pubblica e
              privata, integrata con una struttura dedicata al trasferimento tecnologico.
              Affianchiamo le imprese in ogni fase del percorso di innovazione, dalla definizione
              dell'idea alla sua valorizzazione industriale. Un unico interlocutore, un processo
              strutturato e tutte le competenze necessarie per trasformare la ricerca in opportunità
              concrete di crescita e sviluppo.
            </p>
          </GlassCard>
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
            Core focus & settori applicativi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gradient">
            Dal laboratorio al mercato
          </h2>
          <p className="mt-6 text-muted-foreground">
            Grazie ai nostri partner di ricerca, da più di 15 anni, ci siamo specializzati in nuove
            soluzioni nel campo dei materiali applicati nei settori packaging, automotive,
            aeronautico, elettronico, biomedicale, tessile, industria della carta etc.
          </p>
          <p className="mt-4 text-sm font-semibold text-petrol uppercase tracking-[0.15em]">
            Principali prodotti sviluppati:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: 1200 }}>
          {focus.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col">
                <f.icon className="text-violet-glow mb-4" size={28} />
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{f.desc}</p>
                <button
                  onClick={() => setOpenCard(f)}
                  className="mt-4 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-petrol dark:text-teal-300 hover:underline hover:underline-offset-4 transition"
                >
                  <BookOpen size={13} />
                  Leggi di più
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Dialog modal flash card */}
        <Dialog open={openCard !== null} onOpenChange={(open) => !open && setOpenCard(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {openCard && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-violet/20 flex items-center justify-center text-violet-glow">
                      <openCard.icon size={20} />
                    </div>
                    <DialogTitle className="font-display text-xl leading-tight">
                      {openCard.title}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {openCard.desc}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  {openCard.detail.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>

      <section className="container mx-auto px-4 py-20">
        {/* Citazione finale — punto 15 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-petrol rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <blockquote className="text-xl md:text-2xl font-display font-medium leading-snug text-white">
              "Le imprese non hanno bisogno di dieci fornitori diversi per innovare. Hanno bisogno
              di un partner capace di coordinare{" "}
              <span className="text-teal-200">competenze, ricerca e strumenti finanziari</span> in
              un unico percorso orientato ai risultati."
            </blockquote>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
