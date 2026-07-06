import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Building2, Layers, Workflow, Network, Megaphone, Mail, Menu, X } from "lucide-react";
import { AgjLogo } from "./AgjLogo";
import { ThemeToggle } from "./ThemeProvider";
import { Dock, DockItem } from "./ui/minimal-dock";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chi-siamo", label: "Chi Siamo", icon: Building2 },
  { to: "/servizi", label: "Servizi", icon: Layers },
  { to: "/come-lavoriamo", label: "Come Lavoriamo", icon: Workflow },
  { to: "/ecosistema-innovazione", label: "Ecosistema", icon: Network },
  { to: "/bandi-opportunita", label: "Bandi & Opportunità", icon: Megaphone },
  { to: "/contatti", label: "Contatti", icon: Mail },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed left-0 right-0 top-4 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="container mx-auto px-4">
        <nav
          className={`glass flex items-center justify-between gap-2 rounded-2xl px-3 py-2 transition-all ${scrolled ? "shadow-xl" : ""}`}
        >
          <Link to="/" className="group flex items-center gap-2 pl-1">
            <AgjLogo
              variant="full"
              height={34}
              className="transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Dock navigation — desktop */}
          <Dock className="hidden lg:flex">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} aria-label={l.label}>
                  <DockItem label={l.label} active={active}>
                    <l.icon size={20} strokeWidth={2} />
                  </DockItem>
                </Link>
              );
            })}
          </Dock>

          <div className="flex items-center gap-0.5">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="rounded-lg p-2 hover:bg-petrol/10 lg:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong mt-2 rounded-2xl p-4 lg:hidden"
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => {
                  const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                  return (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                          active ? "bg-petrol/10 text-petrol font-semibold" : "hover:bg-petrol/10"
                        }`}
                      >
                        <l.icon size={18} />
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
