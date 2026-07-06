import { createFileRoute } from "@tanstack/react-router";
import process from "node:process";

import { sendNewBandiBroadcast } from "@/lib/api/newsletter.server";

// Endpoint chiamato UNA volta al giorno da un cron esterno (es. cron-job.org).
// Protetto da CRON_SECRET: il cron deve inviare l'header
//   Authorization: Bearer <CRON_SECRET>
// oppure aggiungere ?key=<CRON_SECRET> all'URL.
export const Route = createFileRoute("/api/cron/bandi")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const header = request.headers.get("authorization") || "";
        const url = new URL(request.url);
        const provided = header.replace(/^Bearer\s+/i, "").trim() || url.searchParams.get("key");

        if (!secret || provided !== secret) {
          return new Response(JSON.stringify({ ok: false, error: "Non autorizzato" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        try {
          const result = await sendNewBandiBroadcast();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("[cron/bandi] failed:", err);
          return new Response(
            JSON.stringify({
              ok: false,
              error: err instanceof Error ? err.message : "Errore imprevisto",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
