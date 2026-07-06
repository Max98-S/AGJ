import { motion, useMotionValue, useTransform } from "motion/react";
import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";

export function GlassCard({
  children,
  className = "",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-8deg", "8deg"]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  // NOTE: the 3D tilt (rotateX/rotateY) is applied to this OUTER wrapper only.
  // The `.glass` surface below uses backdrop-filter, and Chrome/Safari can
  // render backdrop-filter incorrectly (flattening it to a dull, low-contrast
  // fill that makes text hard to read) when the *same* element is also being
  // rotated in 3D. Keeping the glass panel itself untransformed avoids that
  // bug entirely while still giving the whole card a tilt on hover.
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={tilt ? { rotateX, rotateY } : undefined}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      // h-full keeps the height chain intact inside grids (equal-height
      // cards); `group` lets children react to hover (icons, copy, glow).
      className="group h-full"
    >
      <div className={`glass rounded-3xl p-6 md:p-8 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-cyan-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {children}
      </div>
    </motion.div>
  );
}
