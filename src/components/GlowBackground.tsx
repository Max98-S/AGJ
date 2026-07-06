import { motion } from "motion/react";

export function GlowBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="glow-orb"
        style={{
          background: "oklch(0.55 0.3 285)",
          width: 600,
          height: 600,
          top: "-10%",
          left: "-10%",
        }}
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-orb"
        style={{
          background: "oklch(0.6 0.22 220)",
          width: 500,
          height: 500,
          bottom: "-10%",
          right: "-10%",
        }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-orb"
        style={{
          background: "oklch(0.5 0.28 320)",
          width: 400,
          height: 400,
          top: "40%",
          left: "60%",
        }}
        animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
