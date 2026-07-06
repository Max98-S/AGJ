"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, User, Send, Loader2 } from "lucide-react";

import { sendContactEmail } from "@/lib/api/contact.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuccessPanel } from "@/components/ui/success-panel";
import { cn } from "@/lib/utils";

type Kind = "azienda" | "persona";

const schema = z.object({
  kind: z.enum(["azienda", "persona"]),
  nome: z.string().trim().min(2, "Campo obbligatorio"),
  piva: z
    .string()
    .trim()
    .min(8, "P. IVA non valida")
    .max(16, "P. IVA non valida")
    .regex(/^[0-9A-Za-z]+$/, "Solo lettere e numeri"),
  email: z.string().trim().email("Email non valida"),
  messaggio: z.string().trim().max(2000).optional(),
});

const EMPTY = { nome: "", piva: "", email: "", messaggio: "" };
type Fields = typeof EMPTY;
type Errors = Partial<Record<keyof Fields, string>>;

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={cn(
          "mt-1.5 bg-background/60",
          error && "border-destructive focus-visible:ring-destructive",
        )}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [kind, setKind] = useState<Kind>("azienda");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ kind, ...fields });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const res = await sendContactEmail({ data: parsed.data });
      if (res.ok) {
        setFields(EMPTY);
        setErrors({});
        setSent(true);
      } else {
        toast.error("Invio non riuscito", { description: res.error });
      }
    } catch {
      toast.error("Invio non riuscito", {
        description: "Si è verificato un errore di rete. Riprova più tardi.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const options: Array<{ value: Kind; label: string; icon: typeof Building2 }> = [
    { value: "azienda", label: "Azienda", icon: Building2 },
    { value: "persona", label: "Persona fisica", icon: User },
  ];

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SuccessPanel
              title="Grazie per averci contattato."
              message="Abbiamo ricevuto correttamente la tua richiesta e ti risponderemo nel più breve tempo possibile."
              action={
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-petrol/30 px-5 py-2.5 text-sm font-semibold text-petrol transition-colors hover:bg-petrol/5 dark:text-teal-100"
                >
                  Invia un'altra richiesta
                </button>
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-display text-2xl font-semibold text-petrol dark:text-teal-100">
              Scrivici
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Seleziona il profilo e compila i campi: riceveremo la richiesta via email e ti
              risponderemo a breve.
            </p>

            {/* Toggle Azienda / Persona — indicatore che scorre */}
            <div className="relative mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-petrol/10 p-1 dark:bg-white/5">
              {options.map((o) => {
                const active = kind === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setKind(o.value)}
                    className={cn(
                      "relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "text-white dark:text-petrol-deep"
                        : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="contact-kind-pill"
                        className="absolute inset-0 -z-10 rounded-xl bg-petrol shadow-sm dark:bg-teal-400"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <o.icon size={16} />
                    {o.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={kind}
                    initial={{ opacity: 0, x: kind === "azienda" ? -24 : 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: kind === "azienda" ? 24 : -24 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    <Field
                      id="nome"
                      label={kind === "azienda" ? "Nome azienda" : "Nome e cognome"}
                      placeholder={
                        kind === "azienda" ? "Es. Rossi Manufacturing S.r.l." : "Es. Mario Rossi"
                      }
                      autoComplete={kind === "azienda" ? "organization" : "name"}
                      value={fields.nome}
                      onChange={set("nome")}
                      error={errors.nome}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  id="piva"
                  label="P. IVA"
                  placeholder="01234567890"
                  value={fields.piva}
                  onChange={set("piva")}
                  error={errors.piva}
                />
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="nome@dominio.it"
                  autoComplete="email"
                  value={fields.email}
                  onChange={set("email")}
                  error={errors.email}
                />
              </div>

              <div>
                <Label htmlFor="messaggio" className="text-sm">
                  Messaggio <span className="text-muted-foreground">(facoltativo)</span>
                </Label>
                <Textarea
                  id="messaggio"
                  value={fields.messaggio}
                  onChange={(e) => set("messaggio")(e.target.value)}
                  placeholder="Raccontaci brevemente il tuo progetto…"
                  rows={4}
                  className="mt-1.5 bg-background/60"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="glass-petrol inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Invio in corso…
                  </>
                ) : (
                  <>
                    Invia richiesta <Send size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Niente spam. Useremo i tuoi dati solo per rispondere alla richiesta.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
