"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, RefreshCw, Newspaper, Clock } from "lucide-react";

import { getBandiNews } from "@/lib/api/bandi.functions";
import type { BandiCategory, BandoNewsItem } from "@/lib/bandi.server";
import { BandoCover } from "@/components/BandoCover";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES: Array<"Tutte" | BandiCategory> = [
  "Tutte",
  "Regionale",
  "Nazionale",
  "Europeo",
  "Fiscale",
];

const CAT_STYLE: Record<BandiCategory, string> = {
  Regionale: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Nazionale: "bg-petrol/15 text-petrol dark:text-teal-200",
  Europeo: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  Fiscale: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

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
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tutte");

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["bandi-news"],
    queryFn: () => getBandiNews(),
    staleTime: 1000 * 60 * 60, // 1h
    gcTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  });

  const items = (data?.items ?? []).filter((i) => cat === "Tutte" || i.category === cat);
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
          ogni giorno le opportunità che contano.
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

      {/* Filtri + aggiornamento */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              cat === c
                ? "bg-petrol text-white dark:bg-teal-400 dark:text-petrol-deep"
                : "glass text-foreground/70 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
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
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {isError
            ? "Impossibile caricare le notizie al momento. Riprova più tardi."
            : "Nessuna notizia in questa categoria al momento."}
        </p>
      )}

      {updated && (
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Ultimo aggiornamento: {updated}
        </p>
      )}
    </section>
  );
}
