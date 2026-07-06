import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { Mail, MapPin, Globe, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { OminiScrollLayer } from "@/components/OminiScrollLayer";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Agjconfin" },
      {
        name: "description",
        content:
          "Contatta Agjconfin S.r.l: Via Calcutta 08, Roma. Scrivici via email a info@agjconfin.it — ti risponderemo nel più breve tempo possibile.",
      },
    ],
  }),
  component: Contatti,
});

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "info@agjconfin.it",
    href: "mailto:info@agjconfin.it",
  },
  { icon: MapPin, label: "Sede", value: "Via Calcutta, 08 — Roma (RM) 00144" },
  { icon: Globe, label: "Web", value: "www.agjconfin.com", href: "https://www.agjconfin.com" },
];

function Contatti() {
  return (
    <PageShell>
      <OminiScrollLayer variant="contatti" />
      <PageHeader
        eyebrow="Contattaci"
        title="Il prossimo passo verso la vostra crescita inizia da qui."
        subtitle="Raccontaci il tuo progetto: ti risponderemo entro pochi giorni lavorativi."
      />

      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
          <div className="space-y-5">
            {contacts.map((c, i) => {
              const primary = c.label === "Email";
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className={primary ? "ring-1 ring-petrol/20" : undefined}>
                    <a href={c.href} className="flex items-center gap-4 group">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet/30 text-violet-glow transition-transform group-hover:scale-110">
                        <c.icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">
                          {c.label}
                          {primary && (
                            <span className="ml-2 rounded-full bg-petrol/10 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-petrol dark:text-teal-200">
                              Canale preferito
                            </span>
                          )}
                        </div>
                        <div className="break-words font-display text-lg font-semibold">
                          {c.value}
                        </div>
                      </div>
                    </a>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* MAPPA */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass overflow-hidden rounded-3xl max-w-6xl mx-auto"
        >
          <div className="relative aspect-[16/7] w-full bg-petrol/5">
            <iframe
              title="Mappa della sede Agjconfin — Via Calcutta 8, Roma"
              src="https://www.google.com/maps?q=Via%20Calcutta%208%2C%2000144%20Roma%20RM&z=15&output=embed"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-petrol/10 text-petrol">
                <MapPin size={20} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                  Dove siamo
                </span>
                <span className="block font-display font-semibold">
                  Via Calcutta, 08 — Roma (RM) 00144
                </span>
              </span>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Via%20Calcutta%208%2C%2000144%20Roma%20RM"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-strong inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              Apri in Google Maps <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
