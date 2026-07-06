import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendLeadEmail } from "../email.server";

const contactSchema = z.object({
  kind: z.enum(["azienda", "persona"]),
  nome: z.string().trim().min(2, "Inserisci il nome").max(140),
  piva: z
    .string()
    .trim()
    .min(8, "P. IVA non valida")
    .max(16, "P. IVA non valida")
    .regex(/^[0-9A-Za-z]+$/, "P. IVA non valida"),
  email: z.string().trim().email("Email non valida").max(160),
  messaggio: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactResult = { ok: true } | { ok: false; error: string };

// Receives the contact form payload, validates it, and sends a real email.
// Returns a typed result so the client can show a toast without hitting the
// global error page.
export const sendContactEmail = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<ContactResult> => {
    try {
      await sendLeadEmail({
        kind: data.kind,
        nome: data.nome,
        piva: data.piva,
        email: data.email,
        messaggio: data.messaggio || undefined,
      });
      return { ok: true };
    } catch (err) {
      console.error("[contact] send failed:", err);
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Errore imprevisto durante l'invio. Riprova più tardi.",
      };
    }
  });
