import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendNewsletterEmail } from "../email.server";
import { addContactToAudience, sendNewsletterWelcomeEmail } from "./newsletter.server";

const subscribeSchema = z.object({
  email: z.string().trim().email("Email non valida").max(160),
});

export type SubscribeResult = { ok: true } | { ok: false; error: string };

// Riceve un'iscrizione alla newsletter, valida l'indirizzo, lo salva nell'Audience
// Resend, invia un'email di benvenuto all'iscritto e notifica la casella interna.
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(subscribeSchema)
  .handler(async ({ data }): Promise<SubscribeResult> => {
    try {
      // 1) Salva l'iscritto nella lista (no-op se l'audience non è configurata).
      await addContactToAudience(data.email);
    } catch (err) {
      // Non blocchiamo l'iscrizione per un problema sulla lista: logghiamo soltanto.
      console.error("[newsletter] audience add failed:", err);
    }

    try {
      // 2) Email di benvenuto immediata all'iscritto (best-effort).
      await sendNewsletterWelcomeEmail(data.email);
    } catch (err) {
      console.error("[newsletter] welcome send failed:", err);
    }

    try {
      // 3) Notifica interna alla casella (registro dell'iscrizione).
      await sendNewsletterEmail(data.email);
      return { ok: true };
    } catch (err) {
      console.error("[newsletter] subscribe failed:", err);
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Errore imprevisto durante l'iscrizione. Riprova più tardi.",
      };
    }
  });
