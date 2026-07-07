import type { ReactElement } from "react";
import type { ServiceKind } from "./_frame";
import { RicercaSviluppo } from "./RicercaSviluppo";
import { FinanzaAgevolata } from "./FinanzaAgevolata";
import { FinanzaImpresa } from "./FinanzaImpresa";
import { TrasferimentoTecnologico } from "./TrasferimentoTecnologico";
import { InnovationManagement } from "./InnovationManagement";

export type { ServiceKind } from "./_frame";

type Meta = {
  Component: (props: { title?: string }) => ReactElement;
  title: string;
  caption: string;
  tag: string;
  /** Longer copy shown in the "more info" modal opened from the card stack. */
  detail: string;
};

export const SERVICE_ILLUSTRATIONS: Record<ServiceKind, Meta> = {
  "ricerca-sviluppo": {
    Component: RicercaSviluppo,
    title: "Ricerca e Sviluppo",
    caption: "Trasformiamo intuizioni in innovazione concreta.",
    tag: "R&D",
    detail:
      "In sinergia con la nostra rete di partner di ricerca e con la consociata Jaber Innovation Srl, sviluppiamo soluzioni nel campo dei materiali avanzati come coating funzionali, biomateriali, nanomateriali, compositi avanzati, etc. Accompagnando l'innovazione dal laboratorio allo scale-up industriale.",
  },
  "finanza-agevolata": {
    Component: FinanzaAgevolata,
    title: "Finanza Agevolata",
    caption: "Individuiamo e valorizziamo le opportunità di finanziamento.",
    tag: "Core service",
    detail:
      "Individuiamo le opportunità di finanziamento più coerenti con il progetto e accompagniamo l'azienda in ogni fase: dalla stesura della domanda alla gestione del finanziamento, fino alla rendicontazione finale. Copriamo bandi regionali (FESR), nazionali (MIMIT, MASE, MUR, Invitalia, SIMEST) ed europei (Horizon Europe, EIC).",
  },
  "finanza-impresa": {
    Component: FinanzaImpresa,
    title: "Finanza di Impresa",
    caption: "Pianificazione finanziaria per una crescita sostenibile.",
    tag: "Capital",
    detail:
      "Supportiamo operazioni straordinarie — M&A, leverage e management buy-out — e strumenti di finanza a supporto della crescita strutturale dell'impresa, affiancando il management nella pianificazione degli investimenti di lungo periodo.",
  },
  "trasferimento-tecnologico": {
    Component: TrasferimentoTecnologico,
    title: "Trasferimento Tecnologico",
    caption: "Colleghiamo conoscenza e tecnologia per generare valore.",
    tag: "Innovation",
    detail:
      "Accompagniamo il trasferimento tecnologico dal laboratorio al mercato, in sinergia con partner industriali come Jaber Innovation: dalla validazione della tecnologia allo scale-up produttivo, fino all'introduzione sul mercato.",
  },
  "innovation-management": {
    Component: InnovationManagement,
    title: "Innovation Management",
    caption: "Governare l'innovazione in modo strutturato.",
    tag: "Strategy",
    detail:
      "Individuiamo le innovazioni a maggior potenziale e definiamo roadmap tecnologiche strutturate, per supportare decisioni strategiche coerenti con gli obiettivi di crescita dell'impresa.",
  },
};

/** Order matching the brochure grid (3 + 2). */
export const SERVICE_ORDER: ServiceKind[] = [
  "ricerca-sviluppo",
  "finanza-agevolata",
  "finanza-impresa",
  "trasferimento-tecnologico",
  "innovation-management",
];

/** Render just the animated artwork for a service. */
export function ServiceIllustration({ kind }: { kind: ServiceKind }) {
  const { Component, title } = SERVICE_ILLUSTRATIONS[kind];
  return <Component title={title} />;
}

/**
 * A self-contained service panel: artwork on top, title + caption below,
 * mirroring the brochure layout. Used by the home CardStack and the
 * services grid so both stay in sync.
 */
export function ServiceIllustrationCard({
  kind,
  active = false,
  showTag = true,
  action,
}: {
  kind: ServiceKind;
  active?: boolean;
  showTag?: boolean;
  /** Optional CTA rendered inside the caption footer's own flow (never as an
   * absolute overlay), so it can never sit on top of the title/caption text. */
  action?: ReactElement | false;
}) {
  const { Component, title, caption, tag } = SERVICE_ILLUSTRATIONS[kind];
  return (
    <div
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass transition-shadow ${
        active ? "ring-2 ring-petrol/40 dark:ring-teal-300/40" : ""
      }`}
    >
      {showTag && (
        <span className="absolute right-3 top-3 z-10 rounded-full border border-petrol/15 bg-white/70 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-petrol backdrop-blur dark:border-teal-300/20 dark:bg-white/10 dark:text-teal-100">
          {tag}
        </span>
      )}

      {/* Artwork — fixed aspect region so it can never crowd the caption */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden px-5 pt-5">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.04]" />
        <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <Component title={title} />
        </div>
      </div>

      {/* Caption footer — its own legible surface, clearly separated, never clipped.
          The CTA (when provided) flows below the caption instead of floating on
          top of it, so it can never cover the text. */}
      <div className="relative mt-auto flex flex-col gap-1.5 border-t border-petrol/10 bg-white/55 px-5 py-4 backdrop-blur-sm dark:border-teal-300/10 dark:bg-white/[0.04]">
        <h3 className="font-display text-lg font-semibold leading-tight text-petrol dark:text-teal-100">
          {title}
        </h3>
        <div className="h-[3px] w-7 rounded-full bg-petrol-light" />
        <p className="text-sm leading-snug text-muted-foreground">{caption}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
