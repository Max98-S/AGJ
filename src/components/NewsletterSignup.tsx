"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, Loader2, Check, BellRing } from "lucide-react";

import { subscribeNewsletter } from "@/lib/api/newsletter.functions";
import { cn } from "@/lib/utils";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!emailRe.test(value)) {
      setError("Inserisci un indirizzo email valido");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await subscribeNewsletter({ data: { email: value } });
      if (res.ok) {
        setDone(true);
        setEmail("");
      } else {
        setError(res.error);
      }
    } catch {
      setError("Errore di rete. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-petrol/15 bg-gradient-to-br from-petrol-deep to-petrol p-7 text-white md:p-9">
      {/* ambient motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(127,212,227,0.55), transparent 70%)" }}
      />
      <div className="relative grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            <BellRing size={13} /> Newsletter settimanale
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold leading-tight md:text-3xl">
            Non perdere un bando.
          </h3>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Ricevi via email la selezione delle opportunità di finanziamento più rilevanti per la
            tua impresa. Zero spam, disiscrizione in un clic.
          </p>
        </div>

        <div className="min-h-[3.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl bg-white/12 p-4 backdrop-blur"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-300 text-petrol-deep">
                  <Check size={18} strokeWidth={3} />
                </span>
                <p className="text-sm font-medium">
                  Iscrizione confermata. Ti scriveremo appena escono nuove opportunità.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="La tua email aziendale"
                      aria-label="Email"
                      aria-invalid={!!error}
                      className={cn(
                        "w-full rounded-xl border bg-white/10 py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur transition focus:bg-white/15",
                        error ? "border-red-300/80" : "border-white/20 focus:border-white/45",
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-petrol-deep transition-transform hover:scale-[1.03] disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Iscrizione…
                      </>
                    ) : (
                      "Iscriviti"
                    )}
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-200">{error}</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
