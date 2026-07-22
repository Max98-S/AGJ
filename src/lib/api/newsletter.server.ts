import process from "node:process";

import { getBandiNewsData, type BandoNewsItem } from "../bandi.server";

// Server-only newsletter engine.
//  - addContactToAudience(): salva l'iscritto in una Audience di Resend (lista
//    gestita, con disiscrizione automatica). Se l'audience non è configurata,
//    la funzione esce senza errori, così l'iscrizione continua a funzionare.
//  - sendNewBandiBroadcast(): invia agli iscritti i bandi pubblicati nelle
//    ultime ~26h tramite un Broadcast Resend. Va chiamata UNA volta al giorno
//    dall'endpoint cron.
//
// Variabili d'ambiente:
//   RESEND_API_KEY       — chiave Resend
//   RESEND_AUDIENCE_ID   — ID dell'Audience creata nella dashboard Resend
//   NEWSLETTER_FROM      — mittente (dominio verificato); fallback su CONTACT_FROM
//   NEWSLETTER_WINDOW_H  — finestra "novità" in ore (default 26)

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const CAT_COLOR: Record<string, string> = {
  Regioni: "#059669",
  Ministeri: "#4f46e5",
  Europa: "#2563eb",
  Fiscalità: "#dc2626",
  Enti: "#0891b2",
  Finanziarie: "#b45309",
  Energia: "#ca8a04",
  Startup: "#7c3aed",
  Agricoltura: "#16a34a",
  Export: "#0d9488",
  Camere: "#ea580c",
  "Terzo settore": "#e11d48",
  Portali: "#0d4a5c",
};

/** Aggiunge (o re-iscrive) un contatto all'Audience Resend. No-op se non configurata. */
export async function addContactToAudience(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return; // audience non ancora configurata → salta

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  // 409 / "already exists" = il contatto c'è già: lo consideriamo un successo.
  if (!res.ok && res.status !== 409) {
    const detail = await res.text().catch(() => "");
    if (!/already exists|exists/i.test(detail)) {
      throw new Error(`Aggiunta contatto fallita (${res.status}). ${detail}`.trim());
    }
  }
}

/**
 * Email di benvenuto inviata SUBITO a chi si iscrive, così riceve conferma
 * immediata senza aspettare il primo bando. Best-effort (vedi caller).
 * Richiede un dominio verificato su Resend per arrivare a indirizzi esterni.
 */
export async function sendNewsletterWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.NEWSLETTER_FROM ||
    process.env.CONTACT_FROM ||
    "AGJCONFIN <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY non configurata.");
  }

  const html = `<!doctype html><html><body style="margin:0;background:#f4f7f8;padding:24px;font-family:Inter,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5eaec">
      <div style="background:#0d4a5c;color:#fff;padding:22px 24px;font-size:19px;font-weight:700">Iscrizione confermata — AGJCONFIN</div>
      <div style="padding:22px 24px;font-size:15px;color:#1f2937;line-height:1.6">
        <p style="margin:0 0 14px">Grazie per esserti iscritto alla newsletter <strong>Bandi &amp; Opportunità</strong> di AGJCONFIN.</p>
        <p style="margin:0 0 14px">Da ora riceverai una selezione delle nuove opportunità di finanziamento pubblico — regionali, nazionali ed europee — non appena vengono pubblicate. Al massimo un'email al giorno, e solo quando ci sono novità.</p>
      </div>
      <div style="margin:0 24px 22px;padding:14px 16px;background:#f0f7f9;border:1px solid #cfe4ea;border-radius:12px;color:#0d4a5c;font-size:13px;line-height:1.5">
        Potrai disiscriverti in qualsiasi momento dal link presente in fondo a ogni email.
      </div>
      <div style="padding:14px 24px;color:#6b7280;font-size:12px;border-top:1px solid #eef2f3">AGJCONFIN S.r.l. — Consulenza Finanziaria · agjconfin.com</div>
    </div>
  </body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Iscrizione confermata — Bandi & Opportunità AGJCONFIN",
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Invio benvenuto fallito (${res.status}). ${detail}`.trim());
  }
}

function fmtDateIT(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function buildBroadcastHtml(items: BandoNewsItem[]): string {
  const cards = items
    .map((it) => {
      const color = CAT_COLOR[it.category] ?? "#0d4a5c";
      const date = fmtDateIT(it.date);
      const meta = [it.source, date].filter(Boolean).map(esc).join(" · ");
      return `<tr><td style="padding:0 0 14px">
        <table width="100%" style="border:1px solid #e5eaec;border-radius:12px;border-collapse:separate">
          <tr><td style="padding:16px 18px">
            <span style="display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${color};margin-bottom:6px">${esc(it.category)}</span>
            <a href="${esc(it.link)}" style="display:block;font-size:16px;font-weight:700;color:#0d4a5c;text-decoration:none;line-height:1.35;margin-bottom:6px">${esc(it.title)}</a>
            ${it.snippet ? `<p style="margin:0 0 8px;font-size:13px;color:#4b5563;line-height:1.5">${esc(it.snippet)}</p>` : ""}
            <div style="font-size:12px;color:#9ca3af">${meta}</div>
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f4f7f8;padding:24px;font-family:Inter,Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto">
      <div style="background:#0d4a5c;color:#fff;padding:22px 24px;border-radius:16px 16px 0 0;font-size:19px;font-weight:700">Nuovi bandi & opportunità — AGJCONFIN</div>
      <div style="background:#fff;padding:22px 24px;border:1px solid #e5eaec;border-top:none">
        <p style="margin:0 0 18px;font-size:14px;color:#1f2937">Ecco le nuove opportunità di finanziamento pubblicate di recente:</p>
        <table width="100%" style="border-collapse:collapse">${cards}</table>
      </div>
      <div style="background:#fff;padding:16px 24px;border:1px solid #e5eaec;border-top:none;border-radius:0 0 16px 16px;color:#6b7280;font-size:12px;line-height:1.6">
        Ricevi questa email perché sei iscritto alla newsletter "Bandi & Opportunità" di AGJCONFIN.<br>
        Non vuoi più riceverla? <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#0d4a5c">Disiscriviti qui</a>.
      </div>
    </div>
  </body></html>`;
}

export type BroadcastResult = {
  ok: boolean;
  sent: boolean;
  newItems: number;
  reason?: string;
};

/** Invia agli iscritti i bandi pubblicati nelle ultime ~26h. */
export async function sendNewBandiBroadcast(): Promise<BroadcastResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from =
    process.env.NEWSLETTER_FROM ||
    process.env.CONTACT_FROM ||
    "AGJCONFIN <onboarding@resend.dev>";
  const windowH = Number(process.env.NEWSLETTER_WINDOW_H || "26");

  if (!apiKey) return { ok: false, sent: false, newItems: 0, reason: "RESEND_API_KEY mancante" };
  if (!audienceId)
    return { ok: false, sent: false, newItems: 0, reason: "RESEND_AUDIENCE_ID mancante" };

  // 1) Prendi i bandi e tieni solo quelli pubblicati nella finestra recente.
  const data = await getBandiNewsData();
  const cutoff = Date.now() - windowH * 60 * 60 * 1000;
  const fresh = data.items.filter((it) => {
    if (!it.date) return false; // gli elementi "fallback" senza data non contano come novità
    const t = new Date(it.date).getTime();
    return !isNaN(t) && t >= cutoff;
  });

  if (fresh.length === 0) {
    return { ok: true, sent: false, newItems: 0, reason: "Nessun bando nuovo nella finestra" };
  }

  // 2) Crea e invia subito il Broadcast all'intera audience.
  const today = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
  }).format(new Date());

  const res = await fetch("https://api.resend.com/broadcasts", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      audience_id: audienceId,
      from,
      name: `Bandi ${new Date().toISOString().slice(0, 10)}`,
      subject: `Nuovi bandi & opportunità — ${today}`,
      html: buildBroadcastHtml(fresh),
      send: true,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Invio broadcast fallito (${res.status}). ${detail}`.trim());
  }

  return { ok: true, sent: true, newItems: fresh.length };
}
