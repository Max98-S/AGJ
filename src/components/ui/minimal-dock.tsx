"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Minimal macOS-style dock.
 * Items magnify based on cursor proximity and reveal a tooltip on hover/focus.
 * Fully theme-driven (uses the project's CSS variables, no hard-coded colors).
 */

type DockContextValue = {
  mouseX: MotionValue<number>;
  baseSize: number;
  maxSize: number;
};

const DockContext = React.createContext<DockContextValue | null>(null);

interface DockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart"> {
  baseSize?: number;
  maxSize?: number;
}

export function Dock({ className, children, baseSize = 42, maxSize = 60, ...props }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX, baseSize, maxSize }}>
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn("flex items-end gap-1.5", className)}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

interface DockItemProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  active?: boolean;
}

export function DockItem({ children, label, className, active }: DockItemProps) {
  const ctx = React.useContext(DockContext);
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);

  const baseSize = ctx?.baseSize ?? 42;
  const maxSize = ctx?.maxSize ?? 60;
  const fallbackX = useMotionValue(Infinity);
  const mouseX = ctx?.mouseX ?? fallbackX;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTarget = useTransform(distance, [-130, 0, 130], [baseSize, maxSize, baseSize]);
  const size = useSpring(sizeTarget, { mass: 0.1, stiffness: 200, damping: 15 });
  const iconScale = useTransform(size, [baseSize, maxSize], [1, 1.22]);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-xl transition-colors",
        active
          ? "bg-petrol/15 text-petrol"
          : "text-foreground/70 hover:bg-petrol/10 hover:text-petrol",
        className,
      )}
    >
      <AnimatePresence>
        {hovered && label && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className="pointer-events-none absolute -top-8 z-50 whitespace-nowrap rounded-md bg-petrol px-2 py-1 text-[11px] font-medium leading-none text-white shadow-lg"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.div style={{ scale: iconScale }} className="flex items-center justify-center">
        {children}
      </motion.div>

      {active && (
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-petrol" aria-hidden />
      )}
    </motion.div>
  );
}
