"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Newspaper,
  Clock,
  Search,
  X,
  LayoutGrid,
  MapPin,
  Building2,
  Star,
  Calculator,
  Network,
  Banknote,
  Zap,
  Rocket,
  Sprout,
  Ship,
  Store,
  HeartHandshake,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import { getBandiNews } from "@/lib/api/bandi.functions";
import type { BandiCategory, BandoNewsItem } from "@/lib/bandi.server";
import { BandoCover } from "@/components/BandoCover";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Skeleton } from "@/components/ui/skeleton";

// Colore + icona per ciascuna area monitorata (usati dai "pulsantini" filtro).
const CAT_META: Record<BandiCategory, { color: string; icon: LucideIcon }> = {
  Regioni: { color: "#059669", icon: MapPin },
  Ministeri: { color: "#4f46e5", icon: Building2 },
  Europa: { color: "#2563eb", icon: Star },
  Fiscalità: { color: "#dc2626", icon: Calculator },
  Enti: { color: "#0891b2", icon: Network },
  Finanziarie: { color: "#b45309", icon: Banknote },
  Energia: { color: "#ca8a04", icon: Zap },
  Startup: { color: "#7c3aed", icon: Rocket },
  Agricoltura: { color: "#16a34a", icon: Sprout },
  Export: { color: "#0d9488", icon: Ship },
  Camere: { color: "#ea580c", icon: Store },
  "Terzo settore": { color: "#e11d48", icon: HeartHandshake },
  Portali: { color: "#0d4a5c", icon: Landmark },
};

const CAT_STYLE: Record<BandiCategory, string> = {
  Regioni: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Ministeri: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  Europa: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Fiscalità: "bg-red-500/15 text-red-700 dark:text-red-300",
  Enti: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  Finanziarie: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Energia: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  Startup: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Agricoltura: "bg-green-500/15 text-green-700 dark:text-green-300",
  Export: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  Camere: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  "Terzo settore": "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Portali: "bg-petrol/15 text-petrol dark:text-teal-200",
};

const CATEGORIES = Object.keys(CAT_META) as BandiCategory[];

/** Normalizza per una ricerca accent-insensitive. */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fmtDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

function CategoryBadge({ category }: { category: BandiCategory }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${CAT_STYLE[category]}`}
    >
      {category}
    </span>
  );
}

/** Large editorial lead article. */
function FeaturedArticle({ item }: { item: BandoNewsItem }) {
  const date = fmtDate(item.date);
  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group block"
    >
      <article className="glass overflow-hidden rounded-3xl transition-shadow hover:shadow-2xl">
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
            <BandoCover
              seed={item.id}
              category={item.category}
              className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-petrol backdrop-blur dark:bg-petrol-deep/80 dark:text-teal-100">
              ★ In evidenza
            </span>
          </div>
          <div className="flex flex-col justify-center gap-4 p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge category={item.category} />
              {date && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} /> {date}
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-petrol dark:group-hover:text-teal-200 md:text-3xl">
              {item.title}
            </h3>
            {item.snippet && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.snippet}
              </p>
            )}
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{item.source}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-petrol transition-transform group-hover:translate-x-0.5 dark:text-teal-200">
                Leggi l'articolo <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </article>
    </motion.a>
  );
}

/** Standard feed card. */
function FeedCard({ item, index }: { item: BandoNewsItem; index: number }) {
  const date = fmtDate(item.date);
  return (
    <motion.a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.06 }}
      className="group block"
    >
      <article className="glass flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <BandoCover
            seed={item.id}
            category={item.category}
            className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <span className="absolute left-3 top-3">
            <CategoryBadge category={item.category} />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          {date && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={11} /> {date}
            </span>
          )}
          <h3 className="mt-2 font-display font-semibold leading-snug text-foreground transition-colors group-hover:text-petrol dark:group-hover:text-teal-200">
            {item.title}
          </h3>
          {item.snippet && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.snippet}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="truncate pr-2 text-xs text-muted-foreground">{item.source}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-petrol dark:text-teal-200">
              Leggi{" "}
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </motion.a>
  );
}

function CardSkeleton() {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-3 h-3 w-full" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function BandiNews() {
  const [cat, setCat] = useState<BandiCategory | "Tutte">("Tutte");
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["bandi-news"],
    queryFn: () => getBandiNews(),
    staleTime: 1000 * 60 * 60, // 1h
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  });

  const all = data?.items ?? [];

  // 1) Filtro testuale (su titolo, fonte, categoria, sommario).
  const q = norm(query.trim());
  const textFiltered = q
    ? all.filter((i) =>
        norm(`${i.title} ${i.source} ${i.category} ${i.snippet}`).includes(q),
      )
    : all;

  // 2) Conteggi per categoria (riflettono la ricerca testuale).
  const counts: Record<string, number> = { Tutte: textFiltered.length };
  for (const c of CATEGORIES) counts[c] = 0;
  for (const it of textFiltered) counts[it.category] = (counts[it.category] ?? 0) + 1;

  // 3) Filtro per categoria.
  const items = cat === "Tutte" ? textFiltered : textFiltered.filter((i) => i.category === cat);
  const updated = data?.updatedAt ? fmtDate(data.updatedAt) : null;
  const [featured, ...rest] = items;

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-10 max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-petrol dark:text-teal-200">
          <Newspaper size={14} /> Newsletter · aggiornata ogni giorno
        </span>
        <h2 className="mt-4 text-4xl font-bold text-gradient md:text-5xl">
          Bandi & incentivi, in tempo reale
        </h2>
        <p className="mt-6 text-muted-foreground">
          Una redazione automatica che monitora le fonti regionali, nazionali ed europee e seleziona
          ogni giorno le opportunità che contano. Cerca per parola chiave o filtra per categoria.
        </p>
      </motion.div>

      {/* Lead-gen: iscrizione newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <NewsletterSignup />
      </motion.div>

      {/* Ricerca */}
      <div className="relative mx-auto mb-5 max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un bando, un ente, una Regione…"
          aria-label="Cerca tra i bandi"
          className="glass w-full rounded-2xl py-3.5 pl-12 pr-11 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-petrol/40 dark:focus:ring-teal-400/40"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Cancella ricerca"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* "Pulsantini" filtro per categoria + aggiornamento */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setCat("Tutte")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            cat === "Tutte"
              ? "bg-petrol text-white dark:bg-teal-400 dark:text-petrol-deep"
              : "glass text-foreground/70 hover:text-foreground"
          }`}
        >
          <LayoutGrid size={13} /> Tutte
          <span className="opacity-60">{counts.Tutte}</span>
        </button>

        {CATEGORIES.map((c) => {
          const isActive = cat === c;
          const Icon = CAT_META[c].icon;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "text-white dark:text-petrol-deep"
                  : "glass text-foreground/70 hover:text-foreground"
              }`}
              style={isActive ? { backgroundColor: CAT_META[c].color } : undefined}
            >
              {isActive ? (
                <Icon size={13} />
              ) : (
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CAT_META[c].color }}
                />
              )}
              {c}
              <span className="opacity-60">{counts[c]}</span>
            </button>
          );
        })}

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
          aria-label="Aggiorna"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Aggiorna
        </button>
      </div>

      <p className="mb-8 text-center text-xs text-muted-foreground">
        {items.length} {items.length === 1 ? "bando trovato" : "bandi trovati"}
        {cat !== "Tutte" && ` · ${cat}`}
      </p>

      {isLoading ? (
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="mx-auto max-w-6xl space-y-5">
          {featured && <FeaturedArticle item={featured} />}
          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((it, i) => (
                <FeedCard key={it.id} item={it} index={i} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {isError
              ? "Impossibile caricare le notizie al momento. Riprova più tardi."
              : query
                ? `Nessun bando corrisponde a “${query}”${cat !== "Tutte" ? ` in ${cat}` : ""}.`
                : "Nessun bando in questa categoria al momento."}
          </p>
          {(query || cat !== "Tutte") && !isError && (
            <button
              onClick={() => {
                setQuery("");
                setCat("Tutte");
              }}
              className="mt-4 rounded-full bg-petrol px-4 py-1.5 text-sm font-medium text-white transition hover:scale-[1.03] dark:bg-teal-400 dark:text-petrol-deep"
            >
              Azzera filtri
            </button>
          )}
        </div>
      )}

      {updated && (
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Ultimo aggiornamento: {updated}
        </p>
      )}
    </section>
  );
}
