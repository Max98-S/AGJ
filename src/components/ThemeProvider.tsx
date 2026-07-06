"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type ThemeCtx = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const STORAGE_KEY = "agj:theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default matches the server-rendered markup; corrected on mount below.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    let initial: Theme = "light";

    if (root.classList.contains("dark")) {
      initial = "dark";
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === "light" || stored === "dark") {
          initial = stored;
        } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
          initial = "dark";
        }
      } catch {
        /* ignore */
      }
    }

    applyTheme(initial);
    setThemeState(initial);
  }, []);

  const setTheme = (t: Theme) => {
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    setThemeState(t);
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={isDark ? "Tema scuro attivo" : "Tema chiaro attivo"}
      className={
        className ??
        "relative inline-flex h-9 w-[3.75rem] shrink-0 items-center rounded-full border border-petrol/20 bg-petrol/5 px-1 transition-colors hover:bg-petrol/10"
      }
    >
      {/* Track icons (faint, behind the knob) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[7px] text-petrol/55">
        <Sun size={13} />
        <Moon size={13} />
      </span>

      {/* Sliding knob */}
      <motion.span
        className="relative z-10 grid h-7 w-7 place-items-center rounded-full bg-petrol text-white shadow-md"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              <Moon size={15} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              <Sun size={15} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
