import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Globe } from "lucide-react";
import { AgjLogo } from "./AgjLogo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-petrol/15 bg-white/40 dark:bg-white/5 backdrop-blur">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <AgjLogo variant="full" height={44} />
            <p className="mt-4 text-muted-foreground text-sm max-w-md">
              Uniamo innovazione e strategia per guidare il futuro degli investimenti.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-petrol">
              Naviga
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/chi-siamo" className="hover:text-petrol">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link to="/servizi" className="hover:text-petrol">
                  Servizi
                </Link>
              </li>
              <li>
                <Link to="/come-lavoriamo" className="hover:text-petrol">
                  Come Lavoriamo
                </Link>
              </li>
              <li>
                <Link to="/ecosistema-innovazione" className="hover:text-petrol">
                  Ecosistema
                </Link>
              </li>
              <li>
                <Link to="/bandi-opportunita" className="hover:text-petrol">
                  Bandi & Opportunità
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-petrol">
              Contatti
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 shrink-0 text-petrol" />{" "}
                <a href="mailto:info@agjconfin.it" className="hover:text-petrol break-all">
                  info@agjconfin.it
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-petrol" /> Via Calcutta, 08 — Roma
                00144
              </li>
              <li className="flex items-start gap-2">
                <Globe size={14} className="mt-1 shrink-0 text-petrol" />{" "}
                <a
                  href="https://www.agjconfin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-petrol"
                >
                  www.agjconfin.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-petrol/10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Agjconfin S.r.l — Consulenza Finanziaria. Tutti i diritti
          riservati.
        </div>
      </div>
    </footer>
  );
}
