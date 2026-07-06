import process from "node:process";

// Server-only mailer. The `.server.ts` suffix keeps this out of the client
// bundle. We use Resend's HTTP API (a single fetch) instead of SMTP so it works
// on every deploy target, including Cloudflare Workers / edge (no TCP sockets).
//
// Required environment variables (set them on your host / .env):
//   RESEND_API_KEY   — API key from https://resend.com (free tier available)
//   CONTACT_TO       — where leads are delivered (default: info@agjconfin.it)
//   CONTACT_FROM     — verified sender, e.g. "AGJCONFIN <noreply@agjconfin.it>"
//                      (in Resend test mode use "AGJCONFIN <onboarding@resend.dev>")
//
// To use SMTP/Nodemailer instead, replace the fetch() block below with a
// nodemailer transport (only on a Node host, not on Workers).

export type LeadKind = "azienda" | "persona";

export type LeadPayload = {
  kind: LeadKind;
  nome: string; // ragione sociale (azienda) o nome e cognome (persona)
  piva: string;
  email: string;
  messaggio?: string;
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(d: LeadPayload) {
  const tipo = d.kind === "azienda" ? "Azienda" : "Persona fisica";
  const labelNome = d.kind === "azienda" ? "Ragione sociale" : "Nome e cognome";
  const rows: Array<[string, string]> = [
    ["Tipologia", tipo],
    [labelNome, d.nome],
    ["P. IVA", d.piva],
    ["Email", d.email],
  ];
  if (d.messaggio) rows.push(["Messaggio", d.messaggio]);

  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#0d4a5c;white-space:nowrap;vertical-align:top">${esc(
          k,
        )}</td><td style="padding:8px 12px;color:#1f2937">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f4f7f8;padding:24px;font-family:Inter,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5eaec">
      <div style="background:#0d4a5c;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">Nuova richiesta dal sito AGJCONFIN</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${tr}</table>
      <div style="padding:14px 24px;color:#6b7280;font-size:12px;border-top:1px solid #eef2f3">Inviato automaticamente dal form Contatti — agjconfin.com</div>
    </div>
  </body></html>`;
}

export async function sendLeadEmail(d: LeadPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "info@agjconfin.it";
  const from = process.env.CONTACT_FROM || "AGJCONFIN <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY non configurata: imposta la variabile d'ambiente per abilitare l'invio email.",
    );
  }

  const tipo = d.kind === "azienda" ? "Azienda" : "Persona fisica";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email,
      subject: `Richiesta contatto — ${tipo}: ${d.nome}`,
      html: buildHtml(d),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Invio email fallito (${res.status}). ${detail}`.trim());
  }
}

// ---------------------------------------------------------------------------
// Newsletter subscription — notifies the inbox that a new address signed up to
// the "Bandi & Opportunità" newsletter. Reuses the same Resend transport.
// ---------------------------------------------------------------------------
export async function sendNewsletterEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "info@agjconfin.it";
  const from = process.env.CONTACT_FROM || "AGJCONFIN <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY non configurata: imposta la variabile d'ambiente per abilitare l'invio email.",
    );
  }

  const html = `<!doctype html><html><body style="margin:0;background:#f4f7f8;padding:24px;font-family:Inter,Arial,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5eaec">
      <div style="background:#0d4a5c;color:#fff;padding:18px 24px;font-size:18px;font-weight:700">Nuova iscrizione newsletter — AGJCONFIN</div>
      <div style="padding:18px 24px;font-size:14px;color:#1f2937">Indirizzo iscritto: <strong>${esc(email)}</strong></div>
      <div style="padding:14px 24px;color:#6b7280;font-size:12px;border-top:1px solid #eef2f3">Iscrizione alla newsletter "Bandi & Opportunità" dal sito agjconfin.com</div>
    </div>
  </body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Nuova iscrizione newsletter: ${email}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Iscrizione fallita (${res.status}). ${detail}`.trim());
  }
}
